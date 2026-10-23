import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  Unlock,
  Palette,
  Users,
  Trash2,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  Eye,
  EyeOff,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  Languages,
  Calendar,
  Upload,
  ImagePlus,
  Pencil,
  Camera,
  UserRound,
  ChevronDown,
  Settings,
  KeyRound,
  Lock,
  User,
  Images,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePortfolio, getProfileInitials } from "@/hooks/use-portfolio";
import {
  listSelectableCategories,
  type Category,
} from "@/lib/art-content";
import nagaaHero from "@/assets/nagaa_hero.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Nagaa Art Studio Management" },
      {
        name: "description",
        content: "Nagaa Art Admin console to manage gallery artworks and client inquiries.",
      },
    ],
  }),
  component: AdminPage,
});

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function AdminPage() {
  const {
    t,
    language,
    changeLanguage,
    languages,
    works,
    inquiries,
    customCategories,
    addCustomCategory,
    categoryLabel,
    addCustomArtwork,
    updateArtwork,
    deleteArtwork,
    updateInquiryStatus,
    deleteInquiry,
    refreshInquiries,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminProfile,
    updateAdminProfile,
    updateAdminCredentials,
    isSupabaseConfigured,
    backendReady,
  } = usePortfolio();

  const [username, setUsername] = useState("admin@nagaa.art");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (adminProfile.email) setUsername(adminProfile.email);
  }, [adminProfile.email]);

  const [currentView, setCurrentView] = useState<"overview" | "artworks" | "inquiries">("overview");

  const onRefreshInquiries = useEffectEvent(() => {
    void refreshInquiries();
  });

  // Keep admin inquiry list in sync with Supabase (new website orders)
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    onRefreshInquiries();
    const timer = window.setInterval(() => onRefreshInquiries(), 20000);
    const onFocus = () => onRefreshInquiries();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAdminLoggedIn, currentView]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState<"profile" | "settings">("profile");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [inquirySearch, setInquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  const [artCategoryFilter, setArtCategoryFilter] = useState<Category>("all");
  const [artMediumFilter, setArtMediumFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newMedium, setNewMedium] = useState<string>("leather");
  const [customMediumInput, setCustomMediumInput] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("school");
  const [newDimensions, setNewDimensions] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);
  const isEditingArtwork = editingArtworkId !== null;

  const selectableCategories = listSelectableCategories(customCategories);
  const filterCategories: Category[] = ["all", ...selectableCategories];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const success = await adminLogin(password, username);
      if (!success) {
        setLoginError(
          isSupabaseConfigured
            ? language === "om"
              ? "Imeelii ykn jecha icchiitii sirrii miti. Supabase Auth fayyadami."
              : "Invalid email or password. Use your Supabase Auth admin user."
            : language === "om"
              ? "Jechi icchiitii sirrii miti. (Fakkeenya: 'nagaa' ykn 'nagaa2026')"
              : language === "am"
                ? "የይለፍ ቃሉ ትክክል አይደለም። (ለምሳሌ፡ 'nagaa' ወይም 'nagaa2026')"
                : "Invalid password. (Hint: use 'nagaa' or 'nagaa2026')"
        );
      } else {
        toast.success(
          language === "om"
            ? "Baga Nagaan Dhuftan, Ogeessa Nagaa!"
            : language === "am"
              ? "እንኳን ደህና መጡ፣ ናጋ አቦማ!"
              : "Welcome to Nagaa Art Studio Admin!"
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleQuickDemoLogin() {
    if (isSupabaseConfigured) {
      toast.info(
        language === "om"
          ? "Supabase irratti imeelii fi password admin fayyadami."
          : "Use your Supabase admin email and password."
      );
      return;
    }
    await adminLogin("nagaa");
    toast.success("Demo Login Successful!");
  }

  function readImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "om"
          ? "Fayyadama suuraa qofa filadhu."
          : language === "am"
            ? "እባክዎ የሥዕል ፋይል ብቻ ይምረጡ።"
            : "Please select an image file."
      );
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(t.adminImageTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readImageFile(file);
  }

  function handleAdditionalImagesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(
          language === "om"
            ? "Fayyadama suuraa qofa filadhu."
            : language === "am"
              ? "እባክዎ የሥዕል ፋይል ብቻ ይምረጡ።"
              : "Please select an image file."
        );
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(t.adminImageTooLarge);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAdditionalImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    if (additionalFilesRef.current) additionalFilesRef.current.value = "";
  }

  function removeAdditionalImage(index: number) {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readImageFile(file);
  }

  function resetAddForm() {
    setEditingArtworkId(null);
    setNewTitle("");
    setNewDesc("");
    setNewMedium("leather");
    setCustomMediumInput("");
    setNewCategory("school");
    setNewDimensions("");
    setPreviewImage(null);
    setAdditionalImages([]);
    setFileName("");
    setShowNewCategory(false);
    setNewCategoryName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (additionalFilesRef.current) additionalFilesRef.current.value = "";
  }

  function openAddArtworkModal() {
    resetAddForm();
    setShowAddModal(true);
  }

  function openEditArtwork(work: (typeof works)[number]) {
    const title = work.customTitle || t.titles[work.id] || "";
    const description = work.customDesc || t.descriptions[work.id] || "";
    setEditingArtworkId(work.id);
    setNewTitle(title);
    setNewDesc(description);
    if (work.medium === "leather" || work.medium === "canvas" || work.medium === "wall") {
      setNewMedium(work.medium);
      setCustomMediumInput("");
    } else {
      setNewMedium("__custom__");
      setCustomMediumInput(work.medium);
    }
    setNewCategory(work.category);
    setNewDimensions(work.dimensions);
    setPreviewImage(work.src);
    setAdditionalImages(work.additionalImages ? [...work.additionalImages] : []);
    setFileName("");
    setShowNewCategory(false);
    setNewCategoryName("");
    setShowAddModal(true);
  }

  function handleDeleteArtwork(id: number) {
    if (!window.confirm(t.adminConfirmDelete)) return;
    deleteArtwork(id);
  }

  async function handleAddNewCategory() {
    const created = await addCustomCategory(newCategoryName);
    if (!created) {
      toast.error(
        language === "om"
          ? "Maqaa ramaddii galchi."
          : language === "am"
            ? "የዘርፉን ስም ያስገቡ።"
            : "Enter a category name."
      );
      return;
    }
    setNewCategory(created.id);
    setShowNewCategory(false);
    setNewCategoryName("");
  }

  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

  function openProfileEditor() {
    setProfileMenuOpen(false);
    setProfileTab("profile");
    setEditName(adminProfile.name);
    setEditRole(adminProfile.role);
    setEditEmail(adminProfile.email);
    setEditPhone(adminProfile.phone);
    setEditAvatar(adminProfile.avatar);
    setNewPassword("");
    setConfirmPassword("");
    setShowProfileModal(true);
  }

  function handleProfilePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "om"
          ? "Fayyadama suuraa qofa filadhu."
          : language === "am"
            ? "እባክዎ የሥዕል ፋይል ብቻ ይምረጡ።"
            : "Please select an image file."
      );
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(t.adminImageTooLarge);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setEditAvatar(dataUrl);
      // Immediately update profile avatar so it is saved and visible everywhere
      void updateAdminProfile({ avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await updateAdminProfile({
      name: editName,
      role: editRole,
      email: editEmail,
      phone: editPhone,
      avatar: editAvatar,
    });
    setShowProfileModal(false);
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword) {
      if (newPassword.length < 4) {
        toast.error(
          language === "om"
            ? "Jechi icchiitii yoo xiqqaate qubee 4 ta'uu qaba."
            : language === "am"
              ? "የይለፍ ቃል ቢያንስ 4 ፊደላት መሆን አለበት።"
              : "Password must be at least 4 characters."
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error(
          language === "om"
            ? "Jechi icchiitii lamaan wal hin simne!"
            : language === "am"
              ? "የይለፍ ቃሎች አይዛመዱም!"
              : "Passwords do not match!"
        );
        return;
      }
    }
    setIsSavingSettings(true);
    try {
      await updateAdminCredentials(editEmail, newPassword || undefined);
      setNewPassword("");
      setConfirmPassword("");
      setShowProfileModal(false);
    } catch (err) {
      console.error(err);
      toast.error(
        language === "om"
          ? "Qindaa'ina haaromsuun hin milkoofne."
          : "Failed to update settings"
      );
    } finally {
      setIsSavingSettings(false);
    }
  }

  function handleAddArtworkSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error(t.adminTitleRequired);
      return;
    }

    if (!previewImage) {
      toast.error(t.adminImageRequired);
      return;
    }

    const resolvedMedium =
      newMedium === "__custom__"
        ? (customMediumInput.trim() || "wall")
        : newMedium;

    const payload = {
      title: newTitle.trim(),
      description: newDesc.trim(),
      medium: resolvedMedium,
      category: newCategory,
      dimensions: newDimensions.trim() || "",
      imageSrc: previewImage,
      additionalImages,
    };

    if (editingArtworkId !== null) {
      void updateArtwork(editingArtworkId, payload);
    } else {
      void addCustomArtwork(payload);
    }

    resetAddForm();
    setShowAddModal(false);
    setCurrentView("artworks");
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone.includes(inquirySearch);
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredArtworks = works.filter((w) => {
    const matchesCat = artCategoryFilter === "all" || w.category === artCategoryFilter;
    const matchesMed = artMediumFilter === "all" || w.medium === artMediumFilter;
    return matchesCat && matchesMed;
  });

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const inProgressCount = inquiries.filter((i) => i.status === "in_progress").length;
  const completedCount = inquiries.filter((i) => i.status === "completed").length;
  const leatherCount = works.filter((w) => w.medium === "leather").length;
  const canvasCount = works.filter((w) => w.medium === "canvas").length;

  if (!isAdminLoggedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <img
          src={nagaaHero}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover animate-[login-drift_28s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(12,10,8,0.72)_0%,rgba(28,18,10,0.55)_45%,rgba(8,7,6,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative z-10 w-full max-w-lg px-5 py-12 sm:px-8">
          <div className="mb-10 text-center animate-[login-rise_0.9s_ease-out]">
            <h1 className="font-display text-[clamp(2.75rem,8vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
              Wel Come Nagaa
            </h1>
            <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
          </div>

          {loginError && (
            <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-950/50 px-4 py-3 text-center text-xs text-red-100 backdrop-blur-sm">
              {loginError}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-4 rounded-3xl border border-white/15 bg-black/35 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-[login-rise_1.1s_ease-out] sm:p-8"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-white/75">
                {t.adminEmailOrUser}
              </label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-white/10 text-sm text-white placeholder:text-white/40 focus:border-amber-400/60 focus:bg-white/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-white/75">
                {t.adminPassword}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-white/20 bg-white/10 pr-11 text-sm text-white placeholder:text-white/40 focus:border-amber-400/60 focus:bg-white/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="h-12 w-full rounded-2xl bg-amber-500 text-sm font-semibold text-stone-950 shadow-[0_12px_40px_-12px_rgba(245,158,11,0.75)] transition-all hover:bg-amber-400 hover:shadow-[0_16px_48px_-10px_rgba(245,158,11,0.9)]"
            >
              <Unlock className="mr-2 h-4 w-4" />
              {isLoggingIn ? "..." : t.adminLoginButton}
            </Button>

            {!isSupabaseConfigured && (
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickDemoLogin}
                className="h-11 w-full rounded-2xl border-white/25 bg-transparent text-sm text-white/90 hover:bg-white/10 hover:text-white"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                {t.adminQuickDemoLogin}
              </Button>
            )}
          </form>

          <div className="mt-8 text-center animate-[login-rise_1.3s_ease-out]">
            <Link
              to="/"
              className="text-xs tracking-wide text-white/55 transition-colors hover:text-amber-300"
            >
              ← {t.navHome}
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes login-rise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes login-drift {
            from { transform: scale(1.05) translate3d(0, 0, 0); }
            to { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#faf8f5] text-slate-900 md:flex-row">
      {/* Mobile topbar */}
      <div className="z-30 flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white">
            <Palette className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold">Nagaa Art</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — deep espresso, distinct from main canvas */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-60 shrink-0 flex-col justify-between border-r border-white/5 bg-[#1a1612] text-stone-100 transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-[#1a1612] shadow-sm shadow-amber-500/20">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-stone-50">Nagaa Art</h2>
                <p className="text-[11px] text-stone-400">Studio Admin</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            {(
              [
                { key: "overview" as const, icon: LayoutDashboard, label: t.adminOverview },
                { key: "artworks" as const, icon: Palette, label: t.adminArtworksTab, count: works.length },
                {
                  key: "inquiries" as const,
                  icon: Users,
                  label: t.adminInquiriesTab,
                  count: pendingCount || undefined,
                  alert: pendingCount > 0,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setCurrentView(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  currentView === item.key
                    ? "bg-amber-500 text-[#1a1612] shadow-sm shadow-amber-500/25"
                    : "text-stone-300 hover:bg-white/10 hover:text-stone-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {"count" in item && item.count != null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      currentView === item.key
                        ? "bg-[#1a1612]/15 text-[#1a1612]"
                        : "alert" in item && item.alert
                          ? "bg-amber-500 text-[#1a1612]"
                          : "bg-white/10 text-stone-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                openAddArtworkModal();
                setSidebarOpen(false);
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:text-amber-200"
            >
              <PlusCircle className="h-4 w-4" />
              {t.adminAddArtwork}
            </button>
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between px-1 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-amber-400" />
              {t.language}
            </span>
            <select
              aria-label={t.language}
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-stone-200 outline-none"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#1a1612] text-stone-100">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:gap-4 sm:px-8 sm:py-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold text-slate-900 sm:text-2xl">
              {currentView === "overview"
                ? t.adminTitle
                : currentView === "artworks"
                  ? t.adminArtworksTab
                  : t.adminInquiriesTab}
            </h1>
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block sm:text-sm">
              {currentView === "overview"
                ? t.adminSubtitle
                : currentView === "artworks"
                  ? `${works.length} · ${leatherCount} ${t.leather} · ${canvasCount} ${t.canvas}`
                  : `${inquiries.length} · ${pendingCount} ${t.adminStatusPending}`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className={`flex h-10 items-center gap-1.5 rounded-2xl border px-1.5 transition-all sm:pr-2 ${
                  profileMenuOpen
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                }`}
                title={adminProfile.name}
              >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-amber-600 text-[11px] font-bold text-white">
                  {adminProfile.avatar ? (
                    <img src={adminProfile.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </div>
                <ChevronDown
                  className={`hidden h-3.5 w-3.5 text-slate-500 transition-transform sm:block ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/10"
                >
                  <div className="border-b border-slate-100 px-3.5 py-2.5">
                    <p className="truncate text-xs font-bold text-slate-900">{adminProfile.name}</p>
                    <p className="truncate text-[10px] text-slate-500">{adminProfile.role}</p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={openProfileEditor}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-900"
                  >
                    <UserRound className="h-4 w-4 text-amber-600" />
                    {t.adminProfile}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      adminLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.adminLogout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-8">
          {currentView === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
                {[
                  {
                    label: t.adminArtworksTab,
                    value: works.length,
                    hint: `${leatherCount} ${t.leather} · ${canvasCount} ${t.canvas}`,
                    icon: Palette,
                    tone: "text-amber-700 bg-amber-50",
                  },
                  {
                    label: t.adminStatusPending,
                    value: pendingCount,
                    hint: language === "om" ? "Tarkaanfii barbaadu" : "Needs action",
                    icon: Clock,
                    tone: "text-amber-700 bg-amber-50",
                    valueClass: "text-amber-600",
                  },
                  {
                    label: t.adminStatusCompleted,
                    value: completedCount,
                    hint: `${inProgressCount} ${t.adminStatusInProgress}`,
                    icon: CheckCircle2,
                    tone: "text-emerald-700 bg-emerald-50",
                    valueClass: "text-emerald-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] sm:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.tone}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className={`mt-3 font-display text-3xl font-bold ${stat.valueClass ?? "text-slate-900"}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">{stat.hint}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-slate-900">{t.adminArtworksTab}</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentView("artworks")}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    {t.adminSeeAll} →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {works.slice(0, 8).map((work) => (
                    <div key={work.id} className="overflow-hidden rounded-2xl bg-[#faf8f5]">
                      <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                        <img src={work.src} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="p-2.5">
                        <p className="truncate font-display text-xs font-bold text-slate-900">
                          {work.customTitle || t.titles[work.id] || `Artwork #${work.id + 1}`}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {work.medium === "leather" ? t.leather : t.canvas}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === "artworks" && (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setArtCategoryFilter(cat)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        artCategoryFilter === cat
                          ? "bg-amber-600 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-amber-50"
                      }`}
                    >
                      {categoryLabel(cat)}
                    </button>
                  ))}
                </div>

                <div className="flex shrink-0 gap-1.5">
                  {(["all", "leather", "canvas"] as const).map((med) => (
                    <button
                      key={med}
                      type="button"
                      onClick={() => setArtMediumFilter(med)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        artMediumFilter === med
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {med === "all" ? t.all : med === "leather" ? t.leather : t.canvas}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredArtworks.map((work) => {
                  const title = work.customTitle || t.titles[work.id] || `Artwork #${work.id + 1}`;
                  const isLeather = work.medium === "leather";

                  return (
                    <div
                      key={work.id}
                      className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                        <img
                          src={work.src}
                          alt={title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur ${
                              isLeather
                                ? "bg-amber-100/95 text-amber-800"
                                : "bg-white/95 text-slate-700"
                            }`}
                          >
                            {isLeather ? t.leather : t.canvas}
                          </span>
                          <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-slate-700 backdrop-blur">
                            {categoryLabel(work.category)}
                          </span>
                          {work.additionalImages && work.additionalImages.length > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur">
                              <Images className="h-3 w-3" />
                              +{work.additionalImages.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="truncate font-display text-sm font-bold text-slate-900">{title}</h4>
                          <span className="shrink-0 text-[10px] text-slate-400">{work.dimensions}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {work.customDesc || t.descriptions[work.id] || ""}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditArtwork(work)}
                            className="h-9 flex-1 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-600" />
                            <span>{t.adminEditArtwork}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArtwork(work.id)}
                            className="h-9 w-9 rounded-xl border border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors flex items-center justify-center shrink-0 active:scale-95 shadow-sm"
                            title={t.adminDelete}
                            aria-label={t.adminDelete}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === "inquiries" && (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder={t.adminSearchClients}
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="h-10 rounded-2xl border-slate-200 bg-white pl-9 text-sm"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto">
                  {(
                    [
                      { key: "all", label: t.adminStatusAll, count: inquiries.length },
                      { key: "pending", label: t.adminStatusPending, count: pendingCount },
                      { key: "in_progress", label: t.adminStatusInProgress, count: inProgressCount },
                      { key: "completed", label: t.adminStatusCompleted, count: completedCount },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStatusFilter(st.key)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        statusFilter === st.key
                          ? "bg-amber-600 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {st.label} ({st.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.15)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs text-slate-700">
                    <thead className="border-b border-slate-200/80 bg-[#faf8f5] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th scope="col" className="w-12 px-4 py-3.5 text-center">#</th>
                        <th scope="col" className="px-4 py-3.5">
                          {language === "om" ? "Maamila & Bilbila" : language === "am" ? "ደንበኛ እና ስልክ" : "Client & Phone"}
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          {language === "om" ? "Guyyaa" : language === "am" ? "ቀን" : "Date"}
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          {language === "om" ? "Ramaddii & Meeshaa" : language === "am" ? "ዘርፍ እና ዓይነት" : "Category & Medium"}
                        </th>
                        <th scope="col" className="min-w-[240px] px-4 py-3.5">
                          {language === "om" ? "Ibsa Ajajaa" : language === "am" ? "የትዕዛዝ መግለጫ" : "Order Message"}
                        </th>
                        <th scope="col" className="w-36 px-4 py-3.5">
                          {language === "om" ? "Haala" : language === "am" ? "ሁኔታ" : "Status"}
                        </th>
                        <th scope="col" className="w-24 px-4 py-3.5 text-right">
                          {language === "om" ? "Tarkaanfii" : language === "am" ? "እርምጃ" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInquiries.map((inq, idx) => {
                        const isPending = inq.status === "pending";
                        const isInProgress = inq.status === "in_progress";

                        return (
                          <tr key={inq.id} className="transition-colors hover:bg-amber-50/40">
                            <td className="px-4 py-3.5 text-center font-mono text-[11px] font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="font-display text-sm font-bold text-slate-900">{inq.name}</p>
                              <a
                                href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                              >
                                <Phone className="h-3 w-3" />
                                {inq.phone}
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {inq.date}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-800">
                                  {categoryLabel(inq.category)}
                                </Badge>
                                <Badge variant="secondary" className="bg-slate-100 text-[10px] text-slate-700">
                                  {inq.medium === "leather"
                                    ? t.leather
                                    : inq.medium === "canvas"
                                      ? t.canvas
                                      : "Leather & Canvas"}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="line-clamp-2 max-w-sm text-xs leading-relaxed text-slate-600" title={inq.message}>
                                {inq.message}
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <select
                                aria-label="Change Status"
                                value={inq.status}
                                onChange={(e) =>
                                  updateInquiryStatus(
                                    inq.id,
                                    e.target.value as "pending" | "in_progress" | "completed"
                                  )
                                }
                                className={`rounded-xl border px-2.5 py-1 text-xs font-semibold outline-none transition-colors ${
                                  isPending
                                    ? "border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500"
                                    : isInProgress
                                      ? "border-sky-300 bg-sky-50 text-sky-900 focus:border-sky-500"
                                      : "border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500"
                                }`}
                              >
                                <option value="pending">{t.adminStatusPending}</option>
                                <option value="in_progress">{t.adminStatusInProgress}</option>
                                <option value="completed">{t.adminStatusCompleted}</option>
                              </select>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <a
                                  href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition-colors hover:bg-amber-100"
                                  title={t.adminActionCall}
                                  aria-label={t.adminActionCall}
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => deleteInquiry(inq.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                                  title={t.adminDelete}
                                  aria-label={t.adminDelete}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredInquiries.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <p className="text-sm text-slate-500">{t.adminNoInquiries}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Artwork Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {isEditingArtwork ? t.adminEditArtwork : t.adminAddArtwork}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{t.adminUploadHint}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                className="h-8 w-8 text-slate-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddArtworkSubmit} className="mt-5 space-y-4">
              {/* Image upload first — primary action */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.adminPrimaryImage} *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                    isDragging
                      ? "border-amber-500 bg-amber-50"
                      : previewImage
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-slate-200 bg-[#faf8f5] hover:border-amber-400 hover:bg-amber-50/50"
                  }`}
                >
                  {previewImage ? (
                    <div className="w-full space-y-3">
                      <div className="mx-auto h-40 w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-sm">
                        <img src={previewImage} alt="Preview" className="h-full w-full object-contain" />
                      </div>
                      <p className="truncate text-xs font-medium text-slate-700">{fileName || "Image ready"}</p>
                      <p className="text-[11px] text-amber-700">{t.adminUploadFromComputer}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{t.adminDropImageHere}</p>
                      <p className="mt-1 text-xs text-slate-500">{t.adminUploadFromComputer}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Photos Section */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      {t.adminAdditionalImages}
                    </label>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {language === "om"
                        ? "Suuraalee dabalataa (angle adda addaa, fakkii dabalataa) yoo qabaatte asitti dabaladhu. Yeroo namoonni website irrati cuqaasan ni mul'atu."
                        : language === "am"
                          ? "ተጨማሪ ሥዕሎች (የተለያዩ አቅጣጫዎች፣ ዝርዝሮች) ካሉ እዚህ ይጨምሩ። በድረ-ገጹ ላይ ሲጫኑ ይታያሉ።"
                          : "Upload multiple extra photos (angles, close-ups) that will appear in the gallery lightbox when clicked."}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => additionalFilesRef.current?.click()}
                    className="h-8 shrink-0 rounded-xl border-amber-300 bg-white text-xs font-semibold text-amber-800 hover:bg-amber-50"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {t.adminAddMoreImages}
                  </Button>
                </div>

                <input
                  ref={additionalFilesRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAdditionalImagesUpload}
                  className="hidden"
                />

                {additionalImages.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {additionalImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="group relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] font-bold text-white">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow transition-all hover:bg-red-700 hover:scale-110"
                          title="Haqi / Delete"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] italic text-slate-400">
                    {language === "om"
                      ? "Suuraan dabalataa hin jiru (filannoodha)."
                      : language === "am"
                        ? "ምንም ተጨማሪ ሥዕል አልተመረጠም (አማራጭ ነው)።"
                        : "No additional photos yet (optional)."}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.adminNewArtworkTitle} *
                </label>
                <Input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Fkn: Haadha Jaalalaa"
                  className="h-10 rounded-2xl border-slate-200 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminNewArtworkMedium} *
                  </label>
                  <select
                    value={newMedium}
                    onChange={(e) => {
                      setNewMedium(e.target.value);
                      if (e.target.value !== "__custom__") {
                        setCustomMediumInput("");
                      }
                    }}
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="leather">{t.leather}</option>
                    <option value="canvas">{t.canvas}</option>
                    <option value="wall">
                      {language === "om"
                        ? "Fakkii Girgijjaa (Painting on Wall)"
                        : language === "am"
                          ? "የግድግዳ ሥዕል (Painting on Wall)"
                          : "Painting on Wall (Mural)"}
                    </option>
                    <option value="__custom__">
                      {language === "om"
                        ? "+ Medium Biraa Galchi (Custom Medium)..."
                        : language === "am"
                          ? "+ ሌላ ዓይነት ጻፍ (Custom Medium)..."
                          : "+ Add Custom Medium..."}
                    </option>
                  </select>

                  {newMedium === "__custom__" && (
                    <div className="mt-2">
                      <Input
                        type="text"
                        required
                        value={customMediumInput}
                        onChange={(e) => setCustomMediumInput(e.target.value)}
                        placeholder={
                          language === "om"
                            ? "Fkn: Wood carving, Glass, Dhagaa..."
                            : language === "am"
                              ? "ምሳሌ፡ Wood carving, Glass..."
                              : "e.g. Wood carving, Glass..."
                        }
                        className="h-10 rounded-2xl border-amber-300 bg-amber-50/50 text-sm focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminNewArtworkCategory} *
                  </label>
                  <select
                    value={showNewCategory ? "__new__" : newCategory}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setShowNewCategory(true);
                      } else {
                        setShowNewCategory(false);
                        setNewCategory(e.target.value);
                      }
                    }}
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-amber-500"
                  >
                    {selectableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabel(cat)}
                      </option>
                    ))}
                    <option value="__new__">{t.adminAddNewCategory}</option>
                  </select>
                </div>
              </div>

              {showNewCategory && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
                  <label className="mb-1.5 block text-xs font-semibold text-amber-900">
                    {t.adminNewCategoryName}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder={t.adminNewCategoryPlaceholder}
                      className="h-10 rounded-2xl border-amber-200 bg-white text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="h-10 shrink-0 rounded-2xl bg-amber-600 px-4 text-sm text-white hover:bg-amber-700"
                    >
                      <PlusCircle className="mr-1 h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t.adminNewArtworkDesc}
                </label>
                <Textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ibsa suuraa..."
                  className="rounded-2xl border-slate-200 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className="h-10 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 text-sm transition-all active:scale-95 shadow-xs"
                >
                  {t.adminCancel}
                </button>
                <Button
                  type="submit"
                  className="h-10 rounded-2xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  {isEditingArtwork ? (
                    <>
                      <Pencil className="mr-1.5 h-4 w-4" />
                      {t.adminSaveChanges}
                    </>
                  ) : (
                    <>
                      <ImagePlus className="mr-1.5 h-4 w-4" />
                      {t.adminAddArtwork}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {profileTab === "profile" ? t.adminEditProfile : (language === "om" ? "Qindaa'ina & Password" : language === "am" ? "ቅንብሮች እና የይለፍ ቃል" : "Settings & Security")}
                </h3>
                <p className="text-xs text-slate-500">{adminProfile.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileModal(false)}
                className="h-8 w-8 text-slate-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/70 px-6">
              <button
                type="button"
                onClick={() => setProfileTab("profile")}
                className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-colors ${
                  profileTab === "profile"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="h-4 w-4" />
                <span>{language === "om" ? "Profaayilii" : language === "am" ? "መገለጫ" : "Profile"}</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileTab("settings")}
                className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-colors ${
                  profileTab === "settings"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{language === "om" ? "Qindaa'ina (Settings)" : language === "am" ? "ቅንብሮች (Settings)" : "Settings"}</span>
              </button>
            </div>

            {profileTab === "profile" ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 p-6">
                <div className="flex flex-col items-center gap-3">
                  <input
                    ref={profilePhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => profilePhotoRef.current?.click()}
                    className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-amber-600 text-lg font-bold text-white shadow-md shadow-amber-600/25"
                    title={t.adminProfilePhoto}
                  >
                    {editAvatar ? (
                      <img src={editAvatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      getProfileInitials(editName || adminProfile.name)
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </span>
                  </button>
                  <p className="text-[11px] text-slate-500">{t.adminProfilePhoto}</p>
                  {editAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditAvatar("");
                        void updateAdminProfile({ avatar: "" });
                      }}
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700"
                    >
                      {t.adminDelete}
                    </button>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminProfileName}
                  </label>
                  <Input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-10 rounded-2xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminProfileRole}
                  </label>
                  <Input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder="Master Artist"
                    className="h-10 rounded-2xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminProfilePhone}
                  </label>
                  <Input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="h-10 rounded-2xl border-slate-200 text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="h-10 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 text-sm transition-all active:scale-95 shadow-xs"
                  >
                    {t.adminCancel}
                  </button>
                  <Button
                    type="submit"
                    className="h-10 rounded-2xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    {t.adminSaveChanges}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveSettings} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {t.adminProfileEmail} *
                  </label>
                  <Input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-10 rounded-2xl border-slate-200 text-sm"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    {language === "om"
                      ? "Imeelii haaraa database fi login keetiif fayyadami."
                      : "Email used for admin login and inquiries."}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {language === "om" ? "Jecha Icchiitii Haaraa (New Password)" : language === "am" ? "አዲስ የይለፍ ቃል (New Password)" : "New Password"}
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 rounded-2xl border-slate-200 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {language === "om" ? "Jecha Icchiitii Mirkaneessi (Confirm Password)" : language === "am" ? "የይለፍ ቃል አረጋግጥ (Confirm Password)" : "Confirm Password"}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 rounded-2xl border-slate-200 text-sm"
                  />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] leading-relaxed text-amber-900">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>
                      {language === "om"
                        ? "Odeeffannoo Eegumsaa"
                        : language === "am"
                          ? "የደህንነት መረጃ"
                          : "Security Information"}
                    </span>
                  </div>
                  <p className="mt-1">
                    {language === "om"
                      ? "Jijjiiramni kun gara database fi sirna login keetiitti kallattiin galmaa'a."
                      : "These credential changes are saved directly to the database and your login session."}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="h-10 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 text-sm transition-all active:scale-95 shadow-xs"
                  >
                    {t.adminCancel}
                  </button>
                  <Button
                    type="submit"
                    disabled={isSavingSettings}
                    className="h-10 rounded-2xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                    {isSavingSettings ? "Saving..." : (language === "om" ? "Qindaa'ina Galchi" : language === "am" ? "ቅንብር አስቀምጥ" : "Save Settings")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
