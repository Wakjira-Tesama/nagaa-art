import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { resolveArtworkSrc } from "@/lib/artwork-assets";
import { slugifyCategory, type Category, type CustomCategory } from "@/lib/art-content";
import type {
  AdminProfileRow,
  ArtworkRow,
  CategoryRow,
  InquiryRow,
} from "@/lib/database.types";
import type { AdminProfile, Artwork, Inquiry } from "@/lib/portfolio-types";

function stableNumericId(uuid: string): number {
  let hash = 2166136261;
  for (let i = 0; i < uuid.length; i += 1) {
    hash ^= uuid.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function mapArtwork(row: ArtworkRow): Artwork {
  const artwork: Artwork = {
    id: row.legacy_id ?? stableNumericId(row.id),
    uuid: row.id,
    src: resolveArtworkSrc(row.image_url, row.image_key),
    medium: row.medium,
    category: row.category,
    dimensions: row.dimensions,
    year: row.year,
    customTitle: row.title,
    customDesc: row.description,
    isCustom: !row.is_seed,
  };
  if (row.image_key) artwork.imageKey = row.image_key;
  return artwork;
}

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    category: row.category,
    medium: row.medium,
    message: row.message,
    date: new Date(row.created_at).toLocaleString(),
    status: row.status,
  };
}

function mapProfile(row: AdminProfileRow): AdminProfile {
  return {
    name: row.name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar_url,
  };
}

function mapCategory(row: CategoryRow): CustomCategory | null {
  if (row.is_builtin) return null;
  return { id: row.id, label: row.label };
}

export async function fetchPortfolioBundle(): Promise<{
  works: Artwork[];
  categories: CustomCategory[];
  inquiries: Inquiry[];
  profile: AdminProfile | null;
}> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }
  const supabase = getSupabase();

  const [artworksRes, categoriesRes, inquiriesRes, profileRes] = await Promise.all([
    supabase.from("artworks").select("*").order("sort_order", { ascending: true }),
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("admin_profile").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (artworksRes.error) throw artworksRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  // inquiries may fail for anon — return empty until admin logs in
  const inquiries = inquiriesRes.error ? [] : (inquiriesRes.data ?? []).map(mapInquiry);
  if (profileRes.error) throw profileRes.error;

  return {
    works: (artworksRes.data ?? []).map(mapArtwork),
    categories: (categoriesRes.data ?? [])
      .map(mapCategory)
      .filter((c): c is CustomCategory => Boolean(c)),
    inquiries,
    profile: profileRes.data ? mapProfile(profileRes.data) : null,
  };
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await getSupabase()
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInquiry);
}

async function dataUrlToBlob(dataUrl: string): Promise<{ blob: Blob; ext: string }> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext =
    blob.type === "image/png"
      ? "png"
      : blob.type === "image/webp"
        ? "webp"
        : blob.type === "image/gif"
          ? "gif"
          : "jpg";
  return { blob, ext };
}

export async function uploadArtworkImage(fileOrDataUrl: File | string, folder = "gallery") {
  const supabase = getSupabase();
  let blob: Blob;
  let ext = "jpg";

  if (typeof fileOrDataUrl === "string") {
    if (fileOrDataUrl.startsWith("http://") || fileOrDataUrl.startsWith("https://")) {
      return fileOrDataUrl;
    }
    if (fileOrDataUrl.startsWith("data:")) {
      const converted = await dataUrlToBlob(fileOrDataUrl);
      blob = converted.blob;
      ext = converted.ext;
    } else {
      return fileOrDataUrl;
    }
  } else {
    blob = fileOrDataUrl;
    ext =
      fileOrDataUrl.type === "image/png"
        ? "png"
        : fileOrDataUrl.type === "image/webp"
          ? "webp"
          : fileOrDataUrl.type === "image/gif"
            ? "gif"
            : "jpg";
  }

  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage.from("artworks").upload(path, blob, {
    cacheControl: "3600",
    upsert: false,
    contentType: blob.type || `image/${ext}`,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("artworks").getPublicUrl(path);
  return data.publicUrl;
}

export async function createCategory(label: string): Promise<CustomCategory> {
  const id = slugifyCategory(label);
  const { data, error } = await getSupabase()
    .from("categories")
    .insert({ id, label: label.trim(), is_builtin: false })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      return { id, label: label.trim() };
    }
    throw error;
  }
  return { id: data.id, label: data.label };
}

export async function createArtwork(input: {
  title: string;
  description: string;
  medium: "leather" | "canvas";
  category: Category;
  dimensions: string;
  imageSrc: string;
}): Promise<Artwork> {
  const imageUrl = await uploadArtworkImage(input.imageSrc);
  const { data: maxSort } = await getSupabase()
    .from("artworks")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await getSupabase()
    .from("artworks")
    .insert({
      title: input.title,
      description: input.description,
      medium: input.medium,
      category: input.category,
      dimensions: input.dimensions || "60 × 80 cm",
      year: new Date().getFullYear().toString(),
      image_url: imageUrl,
      is_seed: false,
      sort_order: (maxSort?.sort_order ?? 100) + 1,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapArtwork(data);
}

export async function updateArtworkByUuid(
  uuid: string,
  input: {
    title: string;
    description: string;
    medium: "leather" | "canvas";
    category: Category;
    dimensions: string;
    imageSrc: string;
  }
): Promise<Artwork> {
  const patch: {
    title: string;
    description: string;
    medium: "leather" | "canvas";
    category: string;
    dimensions: string;
    image_url?: string | null;
    image_key?: string | null;
  } = {
    title: input.title,
    description: input.description,
    medium: input.medium,
    category: input.category,
    dimensions: input.dimensions || "60 × 80 cm",
  };

  const src = input.imageSrc;
  const isData = src.startsWith("data:");
  const isLocalAsset =
    src.includes("/assets/") ||
    src.includes("localhost") ||
    src.includes("127.0.0.1");
  const isHostedRemote =
    (src.startsWith("http://") || src.startsWith("https://")) && !isLocalAsset;

  if (isData) {
    patch.image_url = await uploadArtworkImage(src);
    patch.image_key = null;
  } else if (isHostedRemote) {
    patch.image_url = src;
    patch.image_key = null;
  }

  const { data, error } = await getSupabase()
    .from("artworks")
    .update(patch)
    .eq("id", uuid)
    .select("*")
    .single();
  if (error) throw error;
  return mapArtwork(data);
}

export async function deleteArtworkByUuid(uuid: string) {
  const { error } = await getSupabase().from("artworks").delete().eq("id", uuid);
  if (error) throw error;
}

export async function createInquiry(input: {
  name: string;
  phone: string;
  category: Category;
  medium: "leather" | "canvas" | "both";
  message: string;
}): Promise<Inquiry> {
  // Public (anon) users may INSERT but cannot SELECT inquiries (admin-only RLS).
  // Do not use .select() here — RETURNING would fail RLS and roll back the insert.
  const { error } = await getSupabase().from("inquiries").insert({
    name: input.name,
    phone: input.phone,
    category: input.category,
    medium: input.medium,
    message: input.message,
    status: "pending",
  });
  if (error) throw error;

  return {
    id: `pending-${Date.now()}`,
    name: input.name,
    phone: input.phone,
    category: input.category,
    medium: input.medium,
    message: input.message,
    date: new Date().toLocaleString(),
    status: "pending",
  };
}

export async function updateInquiryStatusApi(
  id: string,
  status: "pending" | "in_progress" | "completed"
): Promise<Inquiry> {
  const { data, error } = await getSupabase()
    .from("inquiries")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapInquiry(data);
}

export async function deleteInquiryApi(id: string) {
  const { error } = await getSupabase().from("inquiries").delete().eq("id", id);
  if (error) throw error;
}

export async function updateAdminProfileApi(input: Partial<AdminProfile>): Promise<AdminProfile> {
  let avatarUrl = input.avatar;
  if (avatarUrl && avatarUrl.startsWith("data:")) {
    avatarUrl = await uploadArtworkImage(avatarUrl, "avatars");
  }

  const patch: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  } = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.role !== undefined) patch.role = input.role;
  if (input.email !== undefined) patch.email = input.email;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (avatarUrl !== undefined) patch.avatar_url = avatarUrl;

  const { data, error } = await getSupabase()
    .from("admin_profile")
    .update(patch)
    .eq("id", 1)
    .select("*")
    .single();
  if (error) throw error;
  return mapProfile(data);
}

export async function adminSignIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function adminSignOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session;
}
