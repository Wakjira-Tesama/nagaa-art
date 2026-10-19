import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Expand,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  School,
  Hospital,
  User,
  Hotel,
  Palette,
  Layers,
  ArrowRight,
  Filter as FilterIcon,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePortfolio, type Artwork } from "@/hooks/use-portfolio";
import {
  filterWorksByCategory,
  listSelectableCategories,
  isBuiltInCategory,
  type Category,
} from "@/lib/art-content";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Works & Gallery — Nagaa Art | Handcrafted Leather & Canvas" },
      {
        name: "description",
        content:
          "Browse Nagaa Abboomaa's handcrafted portraits and fine art categorized for schools, hospitals, hotels, and personal collections.",
      },
    ],
  }),
  component: WorksPage,
});

function WorksPage() {
  const { t, favorites, toggleFavorite, works, customCategories, categoryLabel } = usePortfolio();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<Category>("all");
  const [selected, setSelected] = useState<number | null>(null);

  const builtInIcons = {
    all: Sparkles,
    personal: User,
    hotel: Hotel,
    school: School,
    hospital: Hospital,
    other: Palette,
  } as const;

  function categoryIcon(cat: string) {
    return isBuiltInCategory(cat) ? builtInIcons[cat] : Layers;
  }

  const filterCategories: Category[] = ["all", ...listSelectableCategories(customCategories)];
  const visible = filterWorksByCategory(works, "all", categoryFilter, favorites);
  const active = works.find((work) => work.id === selected);

  function step(direction: number) {
    if (selected !== null) {
      const currentIndex = visible.findIndex((w) => w.id === selected);
      if (currentIndex !== -1 && visible.length > 0) {
        const nextIndex = (currentIndex + direction + visible.length) % visible.length;
        setSelected(visible[nextIndex].id);
      }
    }
  }

  function handleOrderSimilar(artwork: Artwork) {
    setSelected(null);
    navigate({
      to: "/contact",
      search: {
        medium: artwork.medium,
        category: artwork.category,
        artworkTitle: artwork.customTitle || t.titles[artwork.id] || "",
      } as any,
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="relative border-b border-border/40 bg-card/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
                {t.navWorks}
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t.gallery}
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {t.gallerySubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        {/* Filter Section */}
        <section className="border-b border-border/40 bg-card/25 py-3.5 sm:py-5 sticky top-[65px] z-30 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t.filterByCategoryTitle}
                </span>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[11px] font-semibold text-primary font-mono shrink-0">
                {visible.length} {visible.length === 1 ? "Artwork" : "Artworks"}
              </span>
            </div>

            {/* Category Filter Pills - Responsive horizontal scroll on mobile, flex-wrap on desktop */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {filterCategories.map((cat) => {
                  const Icon = categoryIcon(cat);
                  const isActive = categoryFilter === cat;
                  const count =
                    cat === "all"
                      ? works.length
                      : works.filter((w) => w.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`flex items-center gap-2 rounded-full px-3.5 sm:px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-bold scale-[1.02]"
                          : "border border-border/80 bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground hover:border-primary/40"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{categoryLabel(cat)}</span>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-primary-foreground text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
              })}
            </div>
          </div>
        </section>

        {/* Selected Category Description Banner */}
        {categoryFilter !== "all" && (
          <div className="border-b border-border/30 bg-primary/5 py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  {(() => {
                    const Icon = categoryIcon(categoryFilter);
                    return <Icon className="h-4 w-4" />;
                  })()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {categoryLabel(categoryFilter)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isBuiltInCategory(categoryFilter)
                      ? t.categoryDescriptions[categoryFilter]
                      : categoryLabel(categoryFilter)}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs shrink-0">
                <Link to="/contact">
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  {t.order}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((work) => {
                const isFav = favorites.includes(work.id);
                const title = work.customTitle || t.titles[work.id] || `Artwork #${work.id + 1}`;
                const description = work.customDesc || t.descriptions[work.id] || "";
                const isLeather = work.medium === "leather";

                return (
                  <article
                    key={work.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/30"
                  >
                    {/* Image Area - Clickable on mobile and desktop */}
                    <div
                      className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-muted cursor-pointer"
                      onClick={() => setSelected(work.id)}
                    >
                      <img
                        src={work.src}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 motion-reduce:transition-none group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow ${
                              isLeather
                                ? "bg-amber-950/80 text-amber-200 border border-amber-500/30"
                                : "bg-stone-900/80 text-stone-200 border border-stone-500/30"
                            }`}
                          >
                            {isLeather ? t.leather : t.canvas}
                          </span>
                          <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
                            {categoryLabel(work.category)}
                          </span>
                        </div>

                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(work.id);
                          }}
                          aria-label={isFav ? t.unsave : t.save}
                          aria-pressed={isFav}
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md hover:bg-background hover:scale-110 transition-all shadow"
                        >
                          <Heart
                            className={`h-3.5 w-3.5 transition-colors ${
                              isFav ? "fill-rose-500 text-rose-500" : "text-foreground"
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Quick view button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="sm"
                          onClick={() => setSelected(work.id)}
                          className="rounded-full bg-background/90 text-foreground backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                        >
                          <Expand className="mr-1.5 h-3.5 w-3.5" />
                          {t.view}
                        </Button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {work.dimensions}
                          </span>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
                        <button
                          type="button"
                          onClick={() => handleOrderSimilar(work)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          {t.orderSimilar}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => setSelected(work.id)}
                        >
                          <Expand className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Empty State */}
            {visible.length === 0 && (
              <div className="my-16 rounded-3xl border border-dashed border-border/80 p-12 text-center max-w-lg mx-auto">
                <Layers className="mx-auto h-12 w-12 text-muted-foreground/40 stroke-1" />
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  {t.empty}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.emptyHint}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCategoryFilter("all");
                    }}
                    className="rounded-full"
                  >
                    {t.viewAllWorks}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Commission CTA banner */}
        <section className="border-t border-border/40 bg-card/20 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {t.contactTitle}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              {t.contactSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground font-semibold">
                <Link to="/contact">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t.order}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="tel:+251900000000">{t.quickDirectCall}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Dialog */}
      <Dialog.Root
        open={active !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-in fade-in" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xl focus:outline-none animate-in zoom-in-95"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") step(1);
              if (e.key === "ArrowLeft") step(-1);
            }}
          >
            {active && (
              <>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/50 pb-3">
                  <div>
                    <Dialog.Title className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      {active.customTitle || t.titles[active.id]}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs sm:text-sm text-primary font-medium">
                      {active.medium === "leather" ? t.leather : t.canvas} · {categoryLabel(active.category)} ·{" "}
                      {active.dimensions} ({active.year})
                    </Dialog.Description>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => toggleFavorite(active.id)}
                      className="h-9 w-9 rounded-full"
                      aria-label={favorites.includes(active.id) ? t.unsave : t.save}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(active.id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-foreground"
                        }`}
                      />
                    </Button>
                    <Dialog.Close asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full"
                        aria-label={t.close}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>

                <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-2">
                  <img
                    src={active.src}
                    alt={active.customTitle || t.titles[active.id]}
                    className="max-h-[60vh] w-full object-contain rounded-xl"
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
                    {active.customDesc || t.descriptions[active.id]}
                  </p>
                  <Button
                    onClick={() => handleOrderSimilar(active)}
                    className="rounded-full bg-primary text-primary-foreground font-semibold shrink-0"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    {t.orderSimilar}
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => step(-1)}
                    aria-label={t.previous}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {t.previous}
                  </Button>

                  <span className="text-xs font-mono text-muted-foreground">
                    {visible.findIndex((w) => w.id === active.id) + 1} / {visible.length}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => step(1)}
                    aria-label={t.next}
                  >
                    {t.next}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
