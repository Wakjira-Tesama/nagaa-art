import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  translations,
  languages,
  isLanguage,
  getCategoryLabel,
  slugifyCategory,
  type Language,
  type Filter,
  type Category,
  type CustomCategory,
} from "@/lib/art-content";

import realArtAliBirraLeather from "@/assets/real_art_ali_birra_leather.jpg";
import realArtLeatherHachalu from "@/assets/real_art_leather_hachalu.jpg";
import realArtLeaderLeather from "@/assets/real_art_leader_leather.jpg";
import realArtSchoolMural from "@/assets/real_art_school_mural.jpg";
import realArtIrreechaMural from "@/assets/real_art_irreecha_mural.jpg";
import realArtEloraCoffee from "@/assets/real_art_elora_coffee.png";
import realArtDamLandscape from "@/assets/real_art_dam_landscape.jpg";
import realArtCafeMural from "@/assets/real_art_cafe_mural.jpg";
import realArtLiveCanvas from "@/assets/real_art_live_canvas.jpg";
import realArtOromoGirlMural from "@/assets/real_art_oromo_girl_mural.jpg";
import realArtElderFramed from "@/assets/real_art_elder_framed.jpg";
import realArtPortraitColor from "@/assets/real_art_portrait_color.jpg";
import realArtEvolutionSchoolMural from "@/assets/real_art_evolution_school_mural.jpg";
import realArtOliiSalonMural from "@/assets/real_art_olii_salon_mural.png";
import realArtWildlifeSafari from "@/assets/real_art_wildlife_safari.jpg";

export interface Artwork {
  id: number;
  src: string;
  medium: "leather" | "canvas";
  category: Category;
  dimensions: string;
  year: string;
  customTitle?: string;
  customDesc?: string;
  isCustom?: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  category: Category;
  medium: "leather" | "canvas" | "both";
  message: string;
  date: string;
  status: "pending" | "in_progress" | "completed";
}

export interface AdminProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

export const defaultAdminProfile: AdminProfile = {
  name: "Nagaa Abboomaa",
  role: "Master Artist",
  email: "admin@nagaa.art",
  phone: "+251 911 000 000",
  avatar: "",
};

export function getProfileInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const defaultWorks: Artwork[] = [
  { id: 0, src: realArtAliBirraLeather, medium: "leather", category: "personal", dimensions: "60 × 85 cm", year: "2024" },
  { id: 1, src: realArtLeatherHachalu, medium: "leather", category: "personal", dimensions: "55 × 75 cm", year: "2024" },
  { id: 2, src: realArtLeaderLeather, medium: "leather", category: "other", dimensions: "50 × 70 cm", year: "2024" },
  { id: 3, src: realArtSchoolMural, medium: "canvas", category: "school", dimensions: "12 × 4 m", year: "2024" },
  { id: 4, src: realArtIrreechaMural, medium: "canvas", category: "hotel", dimensions: "8 × 3.5 m", year: "2024" },
  { id: 5, src: realArtEloraCoffee, medium: "canvas", category: "hotel", dimensions: "5 × 2.6 m", year: "2025" },
  { id: 6, src: realArtDamLandscape, medium: "canvas", category: "hospital", dimensions: "6 × 2.8 m", year: "2025" },
  { id: 7, src: realArtCafeMural, medium: "canvas", category: "hotel", dimensions: "4 × 3 m", year: "2025" },
  { id: 8, src: realArtLiveCanvas, medium: "canvas", category: "personal", dimensions: "70 × 90 cm", year: "2025" },
  { id: 9, src: realArtOromoGirlMural, medium: "canvas", category: "school", dimensions: "3 × 1.2 m", year: "2025" },
  { id: 10, src: realArtElderFramed, medium: "canvas", category: "hospital", dimensions: "50 × 65 cm", year: "2025" },
  { id: 11, src: realArtPortraitColor, medium: "canvas", category: "personal", dimensions: "40 × 60 cm", year: "2025" },
  { id: 12, src: realArtEvolutionSchoolMural, medium: "canvas", category: "school", dimensions: "8 × 2.5 m", year: "2025" },
  { id: 13, src: realArtOliiSalonMural, medium: "canvas", category: "hotel", dimensions: "4 × 3 m", year: "2025" },
  { id: 14, src: realArtWildlifeSafari, medium: "canvas", category: "hospital", dimensions: "120 × 90 cm", year: "2025" },
];

const initialInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Tolosa Bekele",
    phone: "+251 911 234 567",
    category: "school",
    medium: "leather",
    message: "Mana barumsaa keenyaaf suuraa Abbaa Gadaa gogaa loonii fi muka dhiheetiin qophaa'e hojjechiisuu barbaanna.",
    date: "2026-10-16 14:30",
    status: "pending",
  },
  {
    id: "inq-2",
    name: "Aster Dibaba",
    phone: "+251 922 876 543",
    category: "hotel",
    medium: "canvas",
    message: "Hoteela keenyaaf galma keessummootaa miidhagsuuf suuraa callee fi aadaa Oromoo bal'ina 80x120cm barbaanna.",
    date: "2026-10-15 10:15",
    status: "in_progress",
  },
  {
    id: "inq-3",
    name: "Dr. Fayisaa Hundee",
    phone: "+251 933 456 789",
    category: "hospital",
    medium: "canvas",
    message: "Kutaa da'umsaa hospitaala keenyaaf suuraa nagaa fi jaalala haadhaa fi daa'imaa calaqqisiisu.",
    date: "2026-10-14 09:00",
    status: "completed",
  },
  {
    id: "inq-4",
    name: "Obsaa & Caaltuu",
    phone: "+251 944 112 233",
    category: "personal",
    medium: "leather",
    message: "Ayyaana gaa'ela keenyaaf suuraa maatii gogaa irratti muka aadaatiin qophaa'e nuuf hojjedhaa.",
    date: "2026-10-17 11:20",
    status: "pending",
  },
];

// Session-only in-memory storage for favorites across route changes
let sessionFavorites: number[] = [];
const favoriteListeners = new Set<(favs: number[]) => void>();

function notifyFavoriteListeners(favs: number[]) {
  sessionFavorites = favs;
  favoriteListeners.forEach((fn) => fn(sessionFavorites));
}

export function usePortfolio() {
  const [language, setLanguageState] = useState<Language>("om");
  const [favorites, setFavorites] = useState<number[]>(sessionFavorites);
  const [customWorks, setCustomWorks] = useState<Artwork[]>([]);
  const [artworkOverrides, setArtworkOverrides] = useState<Record<number, Partial<Artwork>>>({});
  const [hiddenWorkIds, setHiddenWorkIds] = useState<number[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(defaultAdminProfile);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Initialize from storage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("nagaa-language");
      if (isLanguage(savedLang)) setLanguageState(savedLang);

      const savedCustom = localStorage.getItem("nagaa-custom-artworks");
      if (savedCustom) {
        setCustomWorks(JSON.parse(savedCustom));
      }

      const savedOverrides = localStorage.getItem("nagaa-artwork-overrides");
      if (savedOverrides) {
        setArtworkOverrides(JSON.parse(savedOverrides));
      }

      const savedHidden = localStorage.getItem("nagaa-hidden-artworks");
      if (savedHidden) {
        setHiddenWorkIds(JSON.parse(savedHidden));
      }

      const savedCategories = localStorage.getItem("nagaa-custom-categories");
      if (savedCategories) {
        setCustomCategories(JSON.parse(savedCategories));
      }

      const savedProfile = localStorage.getItem("nagaa-admin-profile");
      if (savedProfile) {
        setAdminProfile({ ...defaultAdminProfile, ...JSON.parse(savedProfile) });
      }

      const savedInquiries = localStorage.getItem("nagaa-inquiries");
      if (savedInquiries) {
        setInquiries(JSON.parse(savedInquiries));
      } else {
        localStorage.setItem("nagaa-inquiries", JSON.stringify(initialInquiries));
      }

      const adminAuth = sessionStorage.getItem("nagaa-admin-auth");
      if (adminAuth === "true") {
        setIsAdminLoggedIn(true);
      }
    } catch {
      /* storage is optional */
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

  function changeLanguage(value: string) {
    if (!isLanguage(value)) return;
    setLanguageState(value);
    try {
      localStorage.setItem("nagaa-language", value);
    } catch {
      /* storage is optional */
    }
  }

  const t = translations[language];

  function toggleFavorite(id: number) {
    const isFav = favorites.includes(id);
    let updated: number[];
    if (isFav) {
      updated = favorites.filter((item) => item !== id);
      toast.info(t.unsave, {
        description: t.titles[id] ?? "",
      });
    } else {
      updated = [...favorites, id];
      toast.success(t.save, {
        description: t.titles[id] ?? "",
      });
    }
    notifyFavoriteListeners(updated);
  }

  // Combined works (default + overrides + custom), excluding deleted defaults
  const allWorks: Artwork[] = [
    ...defaultWorks
      .filter((work) => !hiddenWorkIds.includes(work.id))
      .map((work) => {
        const override = artworkOverrides[work.id];
        return override ? { ...work, ...override } : work;
      }),
    ...customWorks,
  ];

  function categoryLabel(category: string) {
    return getCategoryLabel(category, t.categories, customCategories);
  }

  function persistCustomWorks(updated: Artwork[]) {
    setCustomWorks(updated);
    try {
      localStorage.setItem("nagaa-custom-artworks", JSON.stringify(updated));
      return true;
    } catch {
      toast.error(
        language === "om"
          ? "Kuusaan guuteera — suuraa xinnoo filadhu."
          : language === "am"
            ? "ማከማቻ ሞልቷል — ትንሽ ሥዕል ይምረጡ።"
            : "Storage is full — try a smaller image."
      );
      return false;
    }
  }

  function persistOverrides(updated: Record<number, Partial<Artwork>>) {
    setArtworkOverrides(updated);
    try {
      localStorage.setItem("nagaa-artwork-overrides", JSON.stringify(updated));
      return true;
    } catch {
      toast.error(
        language === "om"
          ? "Kuusaan guuteera — suuraa xinnoo filadhu."
          : language === "am"
            ? "ማከማቻ ሞልቷል — ትንሽ ሥዕል ይምረጡ።"
            : "Storage is full — try a smaller image."
      );
      return false;
    }
  }

  // Admin: Add a custom gallery category
  function addCustomCategory(label: string): CustomCategory | null {
    const trimmed = label.trim();
    if (!trimmed) return null;

    const id = slugifyCategory(trimmed);
    const exists =
      customCategories.some((c) => c.id === id) ||
      Object.keys(t.categories).includes(id);

    if (exists) {
      const existing = customCategories.find((c) => c.id === id);
      return existing ?? { id, label: trimmed };
    }

    const next: CustomCategory = { id, label: trimmed };
    const updated = [...customCategories, next];
    setCustomCategories(updated);
    try {
      localStorage.setItem("nagaa-custom-categories", JSON.stringify(updated));
    } catch {
      /* storage is optional */
    }
    toast.success(t.adminCategoryAdded, { description: trimmed });
    return next;
  }

  // Admin: Add new artwork
  function addCustomArtwork(newWorkData: {
    title: string;
    description: string;
    medium: "leather" | "canvas";
    category: Category;
    dimensions: string;
    imageSrc: string;
  }) {
    const knownIds = [
      ...defaultWorks.map((w) => w.id),
      ...customWorks.map((w) => w.id),
      ...Object.keys(artworkOverrides).map(Number),
    ];
    const nextId = knownIds.length > 0 ? Math.max(...knownIds) + 1 : 100;
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

    if (!persistCustomWorks([newArtwork, ...customWorks])) return;
    toast.success(t.adminArtworkAdded, {
      description: newWorkData.title,
    });
  }

  // Admin: Update any artwork (default or custom)
  function updateArtwork(
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
    const patch = {
      src: data.imageSrc,
      medium: data.medium,
      category: data.category,
      dimensions: data.dimensions || "60 × 80 cm",
      customTitle: data.title,
      customDesc: data.description,
    };

    const customIndex = customWorks.findIndex((w) => w.id === id);
    if (customIndex !== -1) {
      const updated = customWorks.map((w) =>
        w.id === id ? { ...w, ...patch } : w
      );
      if (!persistCustomWorks(updated)) return;
    } else {
      const updated = {
        ...artworkOverrides,
        [id]: { ...artworkOverrides[id], ...patch },
      };
      if (!persistOverrides(updated)) return;
    }

    toast.success(t.adminArtworkUpdated, {
      description: data.title,
    });
  }

  // Admin: Delete any artwork (default or custom)
  function deleteArtwork(id: number) {
    const isCustom = customWorks.some((w) => w.id === id);
    if (isCustom) {
      persistCustomWorks(customWorks.filter((w) => w.id !== id));
    } else {
      const updatedHidden = hiddenWorkIds.includes(id)
        ? hiddenWorkIds
        : [...hiddenWorkIds, id];
      setHiddenWorkIds(updatedHidden);
      try {
        localStorage.setItem("nagaa-hidden-artworks", JSON.stringify(updatedHidden));
      } catch {
        /* storage is optional */
      }

      if (artworkOverrides[id]) {
        const { [id]: _removed, ...rest } = artworkOverrides;
        setArtworkOverrides(rest);
        try {
          localStorage.setItem("nagaa-artwork-overrides", JSON.stringify(rest));
        } catch {
          /* storage is optional */
        }
      }
    }
    toast.info(t.adminArtworkDeleted);
  }

  /** @deprecated use deleteArtwork — kept for compatibility */
  function deleteCustomArtwork(id: number) {
    deleteArtwork(id);
  }

  // Add inquiry from Contact / Works form
  function addInquiry(data: {
    name: string;
    phone: string;
    category: Category;
    medium: "leather" | "canvas" | "both";
    message: string;
  }) {
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
      /* storage is optional */
    }
  }

  // Admin: Update inquiry status
  function updateInquiryStatus(id: string, status: "pending" | "in_progress" | "completed") {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status } : inq
    );
    setInquiries(updated);
    try {
      localStorage.setItem("nagaa-inquiries", JSON.stringify(updated));
    } catch {
      /* storage is optional */
    }
    toast.success(t.adminInquiryStatusUpdated);
  }

  // Admin: Delete inquiry
  function deleteInquiry(id: string) {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    try {
      localStorage.setItem("nagaa-inquiries", JSON.stringify(updated));
    } catch {
      /* storage is optional */
    }
    toast.info(t.adminInquiryDeleted);
  }

  // Admin Auth functions
  function adminLogin(password: string): boolean {
    // Password check: accepts "nagaa", "nagaa2026", "admin", "123456"
    if (password === "nagaa" || password === "nagaa2026" || password === "admin" || password === "123456") {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem("nagaa-admin-auth", "true");
      } catch {
        /* storage is optional */
      }
      return true;
    }
    return false;
  }

  function adminLogout() {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem("nagaa-admin-auth");
    } catch {
      /* storage is optional */
    }
    toast.info(t.adminLogout);
  }

  function updateAdminProfile(next: Partial<AdminProfile>) {
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
      toast.error(
        language === "om"
          ? "Kuusaan guuteera — suuraa xinnoo filadhu."
          : language === "am"
            ? "ማከማቻ ሞልቷል — ትንሽ ፎቶ ይምረጡ።"
            : "Storage is full — try a smaller photo."
      );
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
    works: allWorks,
    customWorks,
    customCategories,
    addCustomCategory,
    categoryLabel,
    addCustomArtwork,
    updateArtwork,
    deleteArtwork,
    deleteCustomArtwork,
    inquiries,
    addInquiry,
    updateInquiryStatus,
    deleteInquiry,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminProfile,
    updateAdminProfile,
  };
}
