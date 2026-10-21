import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  translations,
  languages,
  isLanguage,
  getCategoryLabel,
  slugifyCategory,
  type Language,
  type Category,
  type CustomCategory,
} from "@/lib/art-content";
import { artworkAssetMap } from "@/lib/artwork-assets";
import {
  defaultAdminProfile,
  getProfileInitials,
  type AdminProfile,
  type Artwork,
  type Inquiry,
} from "@/lib/portfolio-types";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as api from "@/lib/api";

export type { Artwork, Inquiry, AdminProfile };
export { defaultAdminProfile, getProfileInitials };

export const defaultWorks: Artwork[] = Object.entries({
  0: ["real_art_ali_birra_leather", "leather", "personal", "60 × 85 cm", "2024"],
  1: ["real_art_leather_hachalu", "leather", "personal", "55 × 75 cm", "2024"],
  2: ["real_art_leader_leather", "leather", "other", "50 × 70 cm", "2024"],
  3: ["real_art_school_mural", "canvas", "school", "12 × 4 m", "2024"],
  4: ["real_art_irreecha_mural", "canvas", "hotel", "8 × 3.5 m", "2024"],
  5: ["real_art_elora_coffee", "canvas", "hotel", "5 × 2.6 m", "2025"],
  6: ["real_art_dam_landscape", "canvas", "hospital", "6 × 2.8 m", "2025"],
  7: ["real_art_cafe_mural", "canvas", "hotel", "4 × 3 m", "2025"],
  8: ["real_art_live_canvas", "canvas", "personal", "70 × 90 cm", "2025"],
  9: ["real_art_oromo_girl_mural", "canvas", "school", "3 × 1.2 m", "2025"],
  10: ["real_art_elder_framed", "canvas", "hospital", "50 × 65 cm", "2025"],
  11: ["real_art_portrait_color", "canvas", "personal", "40 × 60 cm", "2025"],
  12: ["real_art_evolution_school_mural", "canvas", "school", "8 × 2.5 m", "2025"],
  13: ["real_art_olii_salon_mural", "canvas", "hotel", "4 × 3 m", "2025"],
  14: ["real_art_wildlife_safari", "canvas", "hospital", "120 × 90 cm", "2025"],
} as Record<number, [string, "leather" | "canvas", Category, string, string]>).map(
  ([id, [key, medium, category, dimensions, year]]) => ({
    id: Number(id),
    src: artworkAssetMap[key] ?? "",
    medium,
    category,
    dimensions,
    year,
    imageKey: key,
    isCustom: false,
  })
);

const initialInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Tolosa Bekele",
    phone: "+251 911 234 567",
    category: "school",
    medium: "leather",
    message:
      "Mana barumsaa keenyaaf suuraa Abbaa Gadaa gogaa loonii fi muka dhiheetiin qophaa'e hojjechiisuu barbaanna.",
    date: "2026-10-16 14:30",
    status: "pending",
  },
  {
    id: "inq-2",
    name: "Aster Dibaba",
    phone: "+251 922 876 543",
    category: "hotel",
    medium: "canvas",
    message:
      "Hoteela keenyaaf galma keessummootaa miidhagsuuf suuraa callee fi aadaa Oromoo bal'ina 80x120cm barbaanna.",
    date: "2026-10-15 10:15",
    status: "in_progress",
  },
  {
    id: "inq-3",
    name: "Dr. Fayisaa Hundee",
    phone: "+251 933 456 789",
    category: "hospital",
    medium: "canvas",
    message:
      "Kutaa da'umsaa hospitaala keenyaaf suuraa nagaa fi jaalala haadhaa fi daa'imaa calaqqisiisu.",
    date: "2026-10-14 09:00",
    status: "completed",
  },
  {
    id: "inq-4",
    name: "Obsaa & Caaltuu",
    phone: "+251 944 112 233",
    category: "personal",
    medium: "leather",
    message:
      "Ayyaana gaa'ela keenyaaf suuraa maatii gogaa irratti muka aadaatiin qophaa'e nuuf hojjedhaa.",
    date: "2026-10-17 11:20",
    status: "pending",
  },
];

let sessionFavorites: number[] = [];
const favoriteListeners = new Set<(favs: number[]) => void>();

function notifyFavoriteListeners(favs: number[]) {
  sessionFavorites = favs;
  favoriteListeners.forEach((fn) => fn(sessionFavorites));
}

function storageErrorToast(language: Language) {
  toast.error(
    language === "om"
      ? "Kuusaan guuteera — suuraa xinnoo filadhu."
      : language === "am"
        ? "ማከማቻ ሞልቷል — ትንሽ ሥዕል ይምረጡ።"
        : "Storage is full — try a smaller image."
  );
}

export function usePortfolio() {
  const [language, setLanguageState] = useState<Language>("om");
  const [favorites, setFavorites] = useState<number[]>(sessionFavorites);
  const [works, setWorks] = useState<Artwork[]>(defaultWorks);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(defaultAdminProfile);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [backendReady, setBackendReady] = useState(false);

  const t = translations[language];

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("nagaa-language");
      if (isLanguage(savedLang)) setLanguageState(savedLang);
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const listener = (newFavs: number[]) => setFavorites([...newFavs]);
    favoriteListeners.add(listener);
    return () => {
      favoriteListeners.delete(listener);
    };
  }, []);

  // Load from Supabase when configured; otherwise localStorage fallback
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!isSupabaseConfigured) {
        loadLocalFallback();
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const session = await api.getAdminSession();
        if (!cancelled) setIsAdminLoggedIn(Boolean(session));

        const bundle = await api.fetchPortfolioBundle();
        if (cancelled) return;

        setWorks(bundle.works.length > 0 ? bundle.works : defaultWorks);
        setCustomCategories(bundle.categories);
        setInquiries(bundle.inquiries);
        if (bundle.profile) setAdminProfile(bundle.profile);
        setBackendReady(true);

        if (session) {
          try {
            const freshInquiries = await api.fetchInquiries();
            if (!cancelled) setInquiries(freshInquiries);
          } catch {
            /* keep public bundle */
          }
        }
      } catch (err) {
        console.error("Supabase boot failed, using local fallback", err);
        if (!cancelled) {
          loadLocalFallback();
          toast.error(
            language === "om"
              ? "Supabase quunnamuun hin dandeenye — haala local fayyadamaa jira."
              : "Could not reach Supabase — using local mode."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    function loadLocalFallback() {
      try {
        const savedCustom = localStorage.getItem("nagaa-custom-artworks");
        const savedOverrides = localStorage.getItem("nagaa-artwork-overrides");
        const savedHidden = localStorage.getItem("nagaa-hidden-artworks");
        const savedCategories = localStorage.getItem("nagaa-custom-categories");
        const savedProfile = localStorage.getItem("nagaa-admin-profile");
        const savedInquiries = localStorage.getItem("nagaa-inquiries");
        const adminAuth = sessionStorage.getItem("nagaa-admin-auth");

        const overrides: Record<number, Partial<Artwork>> = savedOverrides
          ? JSON.parse(savedOverrides)
          : {};
        const hidden: number[] = savedHidden ? JSON.parse(savedHidden) : [];
        const custom: Artwork[] = savedCustom ? JSON.parse(savedCustom) : [];

        const merged = [
          ...defaultWorks
            .filter((w) => !hidden.includes(w.id))
            .map((w) => (overrides[w.id] ? { ...w, ...overrides[w.id] } : w)),
          ...custom,
        ];
        setWorks(merged);
        if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
        if (savedProfile) setAdminProfile({ ...defaultAdminProfile, ...JSON.parse(savedProfile) });
        if (savedInquiries) setInquiries(JSON.parse(savedInquiries));
        else localStorage.setItem("nagaa-inquiries", JSON.stringify(initialInquiries));
        if (adminAuth === "true") setIsAdminLoggedIn(true);
      } catch {
        /* optional */
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeLanguage(value: string) {
    if (!isLanguage(value)) return;
    setLanguageState(value);
    try {
      localStorage.setItem("nagaa-language", value);
    } catch {
      /* optional */
    }
  }

  function toggleFavorite(id: number) {
    const isFav = favorites.includes(id);
    let updated: number[];
    if (isFav) {
      updated = favorites.filter((item) => item !== id);
      toast.info(t.unsave, { description: t.titles[id] ?? "" });
    } else {
      updated = [...favorites, id];
      toast.success(t.save, { description: t.titles[id] ?? "" });
    }
    notifyFavoriteListeners(updated);
  }

  function categoryLabel(category: string) {
    return getCategoryLabel(category, t.categories, customCategories);
  }

  async function addCustomCategory(label: string): Promise<CustomCategory | null> {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const id = slugifyCategory(trimmed);
    const exists =
      customCategories.some((c) => c.id === id) || Object.keys(t.categories).includes(id);
    if (exists) {
      return customCategories.find((c) => c.id === id) ?? { id, label: trimmed };
    }

    if (backendReady) {
      try {
        const created = await api.createCategory(trimmed);
        setCustomCategories((prev) => [...prev, created]);
        toast.success(t.adminCategoryAdded, { description: trimmed });
        return created;
      } catch (err) {
        console.error(err);
        toast.error("Failed to add category");
        return null;
      }
    }

    const next: CustomCategory = { id, label: trimmed };
    const updated = [...customCategories, next];
    setCustomCategories(updated);
    try {
      localStorage.setItem("nagaa-custom-categories", JSON.stringify(updated));
    } catch {
      /* optional */
    }
    toast.success(t.adminCategoryAdded, { description: trimmed });
    return next;
  }

  async function addCustomArtwork(newWorkData: {
    title: string;
    description: string;
    medium: "leather" | "canvas";
    category: Category;
    dimensions: string;
    imageSrc: string;
  }) {
    if (backendReady) {
      try {
        const created = await api.createArtwork(newWorkData);
        setWorks((prev) => [created, ...prev]);
        toast.success(t.adminArtworkAdded, { description: newWorkData.title });
      } catch (err) {
        console.error(err);
        toast.error(
          language === "om"
            ? "Suuraa dabaluun hin milkoofne. Login admin mirkaneessi."
            : "Could not add artwork. Make sure you are logged in as admin."
        );
      }
      return;
    }

    const nextId = works.length > 0 ? Math.max(...works.map((w) => w.id)) + 1 : 100;
    const newArtwork: Artwork = {
      id: nextId,
      src: newWorkData.imageSrc,
      medium: newWorkData.medium,
      category: newWorkData.category,
      dimensions: newWorkData.dimensions || "60 × 80 cm",
      year: new Date().getFullYear().toString(),
      customTitle: newWorkData.title,
      customDesc: newWorkData.description,
      isCustom: true,
    };
    const updated = [newArtwork, ...works.filter((w) => w.isCustom), ...works.filter((w) => !w.isCustom)];
    // simpler: prepend
    setWorks([newArtwork, ...works]);
    try {
      const customOnly = [newArtwork, ...works.filter((w) => w.isCustom)];
      localStorage.setItem("nagaa-custom-artworks", JSON.stringify(customOnly));
    } catch {
      storageErrorToast(language);
      return;
    }
    toast.success(t.adminArtworkAdded, { description: newWorkData.title });
  }

  async function updateArtwork(
    id: number,
    data: {
      title: string;
      description: string;
      medium: "leather" | "canvas";
      category: Category;
      dimensions: string;
      imageSrc: string;
    }
  ) {
    const target = works.find((w) => w.id === id);
    if (!target) return;

    if (backendReady && target.uuid) {
      try {
        const updated = await api.updateArtworkByUuid(target.uuid, data);
        setWorks((prev) => prev.map((w) => (w.id === id ? updated : w)));
        toast.success(t.adminArtworkUpdated, { description: data.title });
      } catch (err) {
        console.error(err);
        toast.error("Failed to update artwork");
      }
      return;
    }

    const patch = {
      src: data.imageSrc,
      medium: data.medium,
      category: data.category,
      dimensions: data.dimensions || "60 × 80 cm",
      customTitle: data.title,
      customDesc: data.description,
    };
    setWorks((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
    try {
      if (target.isCustom) {
        const custom = works
          .filter((w) => w.isCustom)
          .map((w) => (w.id === id ? { ...w, ...patch } : w));
        localStorage.setItem("nagaa-custom-artworks", JSON.stringify(custom));
      } else {
        const overrides = JSON.parse(localStorage.getItem("nagaa-artwork-overrides") || "{}");
        overrides[id] = { ...overrides[id], ...patch };
        localStorage.setItem("nagaa-artwork-overrides", JSON.stringify(overrides));
      }
    } catch {
      storageErrorToast(language);
      return;
    }
    toast.success(t.adminArtworkUpdated, { description: data.title });
  }

  async function deleteArtwork(id: number) {
    const target = works.find((w) => w.id === id);
    if (!target) return;

    if (backendReady && target.uuid) {
      try {
        await api.deleteArtworkByUuid(target.uuid);
        setWorks((prev) => prev.filter((w) => w.id !== id));
        toast.info(t.adminArtworkDeleted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete artwork");
      }
      return;
    }

    setWorks((prev) => prev.filter((w) => w.id !== id));
    try {
      if (target.isCustom) {
        const custom = works.filter((w) => w.isCustom && w.id !== id);
        localStorage.setItem("nagaa-custom-artworks", JSON.stringify(custom));
      } else {
        const hidden: number[] = JSON.parse(localStorage.getItem("nagaa-hidden-artworks") || "[]");
        if (!hidden.includes(id)) {
          localStorage.setItem("nagaa-hidden-artworks", JSON.stringify([...hidden, id]));
        }
      }
    } catch {
      /* optional */
    }
    toast.info(t.adminArtworkDeleted);
  }

  function deleteCustomArtwork(id: number) {
    void deleteArtwork(id);
  }

  async function addInquiry(data: {
    name: string;
    phone: string;
    category: Category;
    medium: "leather" | "canvas" | "both";
    message: string;
  }): Promise<boolean> {
    if (backendReady || isSupabaseConfigured) {
      try {
        const created = await api.createInquiry(data);
        // Public submitters are not authenticated — don't keep inquiries in their local state.
        // Admin dashboard will load them after login via fetchInquiries().
        if (isAdminLoggedIn) {
          setInquiries((prev) => [created, ...prev]);
        }
        return true;
      } catch (err) {
        console.error(err);
        toast.error(
          language === "om"
            ? "Ajaja erguu hin dandeenye. Irra deebi'ii yaali."
            : language === "am"
              ? "ትዕዛዙን መላክ አልተሳካም። እንደገና ይሞክሩ።"
              : "Could not send your request. Please try again."
        );
        return false;
      }
    }

    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      category: data.category,
      medium: data.medium,
      message: data.message,
      date: new Date().toLocaleString(),
      status: "pending",
    };
    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    try {
      localStorage.setItem("nagaa-inquiries", JSON.stringify(updated));
    } catch {
      /* optional */
    }
    return true;
  }

  async function refreshInquiries(): Promise<void> {
    if (!(backendReady || isSupabaseConfigured) || !isAdminLoggedIn) return;
    try {
      const fresh = await api.fetchInquiries();
      setInquiries(fresh);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateInquiryStatus(
    id: string,
    status: "pending" | "in_progress" | "completed"
  ) {
    if (backendReady) {
      try {
        const updated = await api.updateInquiryStatusApi(id, status);
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
        toast.success(t.adminInquiryStatusUpdated);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update status");
      }
      return;
    }

    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    setInquiries(updated);
    try {
      localStorage.setItem("nagaa-inquiries", JSON.stringify(updated));
    } catch {
      /* optional */
    }
    toast.success(t.adminInquiryStatusUpdated);
  }

  async function deleteInquiry(id: string) {
    if (backendReady) {
      try {
        await api.deleteInquiryApi(id);
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        toast.info(t.adminInquiryDeleted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete inquiry");
      }
      return;
    }

    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    try {
      localStorage.setItem("nagaa-inquiries", JSON.stringify(updated));
    } catch {
      /* optional */
    }
    toast.info(t.adminInquiryDeleted);
  }

  async function adminLogin(password: string, email?: string): Promise<boolean> {
    if (backendReady || isSupabaseConfigured) {
      try {
        const loginEmail = (email || adminProfile.email || "admin@nagaa.art").trim();
        await api.adminSignIn(loginEmail, password);
        setIsAdminLoggedIn(true);
        try {
          const fresh = await api.fetchInquiries();
          setInquiries(fresh);
        } catch {
          /* optional */
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    if (
      password === "nagaa" ||
      password === "nagaa2026" ||
      password === "admin" ||
      password === "123456"
    ) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem("nagaa-admin-auth", "true");
      } catch {
        /* optional */
      }
      return true;
    }
    return false;
  }

  async function adminLogout() {
    if (backendReady || isSupabaseConfigured) {
      try {
        await api.adminSignOut();
      } catch {
        /* optional */
      }
    }
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem("nagaa-admin-auth");
    } catch {
      /* optional */
    }
    toast.info(t.adminLogout);
  }

  async function updateAdminProfile(next: Partial<AdminProfile>) {
    if (backendReady) {
      try {
        const updated = await api.updateAdminProfileApi({ ...adminProfile, ...next });
        setAdminProfile(updated);
        toast.success(t.adminProfileUpdated);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
      }
      return;
    }

    const updated: AdminProfile = {
      ...adminProfile,
      ...next,
      name: (next.name ?? adminProfile.name).trim() || defaultAdminProfile.name,
      role: (next.role ?? adminProfile.role).trim() || defaultAdminProfile.role,
      email: (next.email ?? adminProfile.email).trim() || defaultAdminProfile.email,
      phone: (next.phone ?? adminProfile.phone).trim(),
      avatar: next.avatar !== undefined ? next.avatar : adminProfile.avatar,
    };
    setAdminProfile(updated);
    try {
      localStorage.setItem("nagaa-admin-profile", JSON.stringify(updated));
    } catch {
      storageErrorToast(language);
      return;
    }
    toast.success(t.adminProfileUpdated);
  }

  return {
    language,
    changeLanguage,
    languages,
    t,
    favorites,
    toggleFavorite,
    works,
    customWorks: works.filter((w) => w.isCustom),
    customCategories,
    addCustomCategory,
    categoryLabel,
    addCustomArtwork,
    updateArtwork,
    deleteArtwork,
    deleteCustomArtwork,
    inquiries,
    addInquiry,
    refreshInquiries,
    updateInquiryStatus,
    deleteInquiry,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminProfile,
    updateAdminProfile,
    isLoading,
    backendReady,
    isSupabaseConfigured,
  };
}
