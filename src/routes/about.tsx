import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePortfolio } from "@/hooks/use-portfolio";
import nagaaHero from "@/assets/nagaa_hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Nagaa Abboomaa — Portrait & Heritage Artist" },
      {
        name: "description",
        content:
          "Learn about Nagaa Abboomaa, a master portrait artist in Addis Ababa handcrafting bespoke artworks on leather and canvas preserving Oromo heritage.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = usePortfolio();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="relative border-b border-border/40 bg-card/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
                {t.navAbout}
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t.aboutTitle}
              </h1>
              <p className="mt-3 text-base text-primary font-medium sm:text-lg">
                {t.aboutSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Narrative & Studio Showcase */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Image Frame */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src={nagaaHero}
                      alt="Nagaa Abboomaa in his studio"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 border-t border-border/50 bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">
                          Nagaa Abboomaa
                        </p>
                        <p className="text-xs text-muted-foreground">{t.profession}</p>
                      </div>
                      <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                        Finfinnee
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Philosophy Details */}
              <div className="space-y-6 lg:col-span-7">
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t.heroTitlePrefix}{" "}
                  <span className="gold-gradient-text italic font-serif">
                    {t.heroTitleAccent}
                  </span>
                </h2>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t.bio}
                </p>

                {/* Cultural Quote Banner */}
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur">
                  <p className="font-display text-lg italic text-foreground sm:text-xl">
                    {t.quote}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">
                    — Nagaa Abboomaa
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {t.verifiedArtist}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t.artisanPledge}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Award className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {t.statsYears}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t.statsArtworks} · {t.statsHandcrafted}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground font-semibold">
                    <Link to="/contact">
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t.order}
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link to="/works">
                      {t.browse}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 3-Step Process */}
        <section className="border-t border-border/40 bg-card/20 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-3 border-primary/40 text-primary">
                {t.navProcess}
              </Badge>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {t.processTitle}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {t.processSubtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {t.steps.map((stepItem, idx) => (
                <div
                  key={stepItem.num}
                  className="rounded-2xl border border-border/70 bg-card p-8 shadow-sm transition hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-bold text-primary/40">
                      {stepItem.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {idx === 0 ? (
                        <Sparkles className="h-5 w-5" />
                      ) : idx === 1 ? (
                        <Layers className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                    {stepItem.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stepItem.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
