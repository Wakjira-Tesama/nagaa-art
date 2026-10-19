import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Heart,
  Expand,
  School,
  Hospital,
  User,
  Hotel,
  Layers,
  CheckCircle2,
  Phone,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePortfolio, type Artwork } from "@/hooks/use-portfolio";
import { type Category } from "@/lib/art-content";

import nagaaAsset from "@/assets/nagaa.jpg.asset.json";
import nagaaHero from "@/assets/nagaa_hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nagaa Abboomaa — Nagaa Art | Portraits & Oromo Fine Art" },
      {
        name: "description",
        content:
          "Explore Nagaa Abboomaa’s authentic portraits and cultural art on genuine leather and canvas for schools, hospitals, hotels, and personal collections.",
      },
      { property: "og:title", content: "Nagaa Abboomaa — Nagaa Art" },
      {
        property: "og:description",
        content:
          "Portraits and Oromo cultural fine art on stretched leather and canvas. Explore the gallery in Afaan Oromoo, English, and Amharic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(nagaaAsset.url.startsWith("https://")
        ? [
            { property: "og:image", content: nagaaAsset.url },
            { name: "twitter:image", content: nagaaAsset.url },
          ]
        : []),
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { t, works, favorites, toggleFavorite, categoryLabel } = usePortfolio();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const categoryIcons = {
    all: Sparkles,
    personal: User,
    hotel: Hotel,
    school: School,
    hospital: Hospital,
    other: Palette,
  } as const;

  const featuredWorks = works.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-spotlight absolute -top-40 left-1/2 h-[700px] w-full max-w-5xl -translate-x-1/2 opacity-70" />
        <div className="absolute top-1/3 -left-48 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-2/3 -right-48 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>{t.heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {t.heroTitlePrefix}{" "}
                <span className="gold-gradient-text block italic font-serif">
                  {t.heroTitleAccent}
                </span>
              </h1>

              {/* Subtitle / Intro */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t.intro}
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary px-7 py-5 sm:py-6 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all justify-center"
                >
                  <Link to="/contact" className="flex items-center justify-center gap-2">
                    {t.order}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border/80 bg-card/50 px-7 py-5 sm:py-6 text-sm sm:text-base font-medium text-foreground backdrop-blur hover:bg-card hover:border-primary/50 transition-all justify-center"
                >
                  <Link to="/works">{t.browse}</Link>
                </Button>
              </div>

              {/* Trust & Craft Stats */}
              <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-border/60 pt-6 sm:pt-8 text-center sm:text-left">
                <div>
                  <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">100+</p>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">{t.statsArtworks}</p>
                </div>
                <div>
                  <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">100%</p>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">{t.statsHandcrafted}</p>
                </div>
                <div>
                  <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">8+</p>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground">{t.statsYears}</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Artist in Studio */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/30 to-accent/20 blur-2xl opacity-50" />

                <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-2xl">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                    <img
                      src={nagaaHero}
                      alt="Nagaa Abboomaa in his art studio"
                      className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-background/80 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Palette className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            Nagaa Abboomaa
                            <ShieldCheck className="h-4 w-4 text-primary" />
                          </p>
                          <p className="text-xs text-muted-foreground">{t.profession}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/40 text-primary text-[11px]">
                        Finfinnee
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES OVERVIEW SECTION */}
        <section className="border-t border-border/40 bg-card/20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
                  {t.filterByCategoryTitle}
                </Badge>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t.gallery}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-xl">
                  {t.gallerySubtitle}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/works">
                  {t.viewAllWorks}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* 4 Major Category Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  key: "school" as Category,
                  icon: School,
                  count: works.filter((w) => w.category === "school").length,
                },
                {
                  key: "hospital" as Category,
                  icon: Hospital,
                  count: works.filter((w) => w.category === "hospital").length,
                },
                {
                  key: "personal" as Category,
                  icon: User,
                  count: works.filter((w) => w.category === "personal").length,
                },
                {
                  key: "hotel" as Category,
                  icon: Hotel,
                  count: works.filter((w) => w.category === "hotel").length,
                },
              ].map(({ key, icon: Icon, count }) => (
                <Link
                  key={key}
                  to="/works"
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {count} {count === 1 ? "Work" : "Works"}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {t.categories[key]}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {t.categoryDescriptions[key]}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary pt-3 border-t border-border/40">
                    <span>{t.browse}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED WORKS PREVIEW */}
        <section className="border-t border-border/40 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
                  {t.navWorks}
                </Badge>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t.gallery}
                </h2>
              </div>
              <Button asChild className="rounded-full bg-primary text-primary-foreground font-semibold">
                <Link to="/works">
                  {t.viewAllWorks} ({works.length})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredWorks.map((work) => {
                const isFav = favorites.includes(work.id);
                const title = work.customTitle || t.titles[work.id] || `Artwork #${work.id + 1}`;
                const isLeather = work.medium === "leather";

                return (
                  <article
                    key={work.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                      <img
                        src={work.src}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 motion-reduce:transition-none group-hover:scale-105"
                      />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md shadow ${
                            isLeather
                              ? "bg-amber-950/80 text-amber-200 border border-amber-500/30"
                              : "bg-stone-900/80 text-stone-200 border border-stone-500/30"
                          }`}
                        >
                          {isLeather ? t.leather : t.canvas}
                        </span>

                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => toggleFavorite(work.id)}
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

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="sm"
                          onClick={() => setSelectedArtwork(work)}
                          className="rounded-full bg-background/90 text-foreground backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                        >
                          <Expand className="mr-1.5 h-3.5 w-3.5" />
                          {t.view}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                        <Badge variant="outline" className="text-[10px] border-border/80 text-muted-foreground">
                          {categoryLabel(work.category)}
                        </Badge>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ARTIST PHILOSOPHY BANNER */}
        <section className="border-t border-border/40 bg-card/30 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
              {t.navAbout}
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t.aboutTitle}
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
              {t.bio}
            </p>

            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-8 max-w-2xl mx-auto">
              <p className="font-display text-lg italic text-foreground sm:text-xl">
                {t.quote}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">
                — Nagaa Abboomaa
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground font-semibold">
                <Link to="/about">
                  {t.aboutTitle}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/contact">
                  {t.order}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Dialog */}
      <Dialog.Root
        open={selectedArtwork !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedArtwork(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-in fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-2xl focus:outline-none animate-in zoom-in-95">
            {selectedArtwork && (
              <>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/50 pb-3">
                  <div>
                    <Dialog.Title className="font-display text-xl font-bold text-foreground">
                      {selectedArtwork.customTitle || t.titles[selectedArtwork.id]}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-primary font-medium">
                      {selectedArtwork.medium === "leather" ? t.leather : t.canvas} ·{" "}
                      {categoryLabel(selectedArtwork.category)}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </Dialog.Close>
                </div>

                <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-2">
                  <img
                    src={selectedArtwork.src}
                    alt={selectedArtwork.customTitle || t.titles[selectedArtwork.id]}
                    className="max-h-[55vh] w-full object-contain rounded-xl"
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-muted-foreground max-w-md">
                    {selectedArtwork.customDesc || t.descriptions[selectedArtwork.id]}
                  </p>
                  <Button asChild className="rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                    <Link to="/contact">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      {t.orderSimilar}
                    </Link>
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
