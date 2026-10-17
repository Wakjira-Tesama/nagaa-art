import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, Mail, Facebook, MapPin, Heart, Expand, ChevronLeft, ChevronRight, X, Languages } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { translations, languages, isLanguage, filterWorks, type Language, type Filter } from "@/lib/art-content";
import nagaa from "@/assets/nagaa.jpg.asset.json";
import art1 from "@/assets/art1.jpg";
import art2 from "@/assets/art2.jpg";
import art3 from "@/assets/art3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Nagaa Abboomaa — Nagaa Art | Portraits & Oromo Art" },
    { name: "description", content: "Explore Nagaa Abboomaa’s portraits on leather and canvas. View artworks and contact the artist in Afaan Oromoo, English, or Amharic." },
    { property: "og:title", content: "Nagaa Abboomaa — Nagaa Art" },
    { property: "og:description", content: "Portraits and Oromo art on leather and canvas. Explore the gallery in Afaan Oromoo, English, and Amharic." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ...(nagaa.url.startsWith("https://") ? [{ property: "og:image", content: nagaa.url }, { name: "twitter:image", content: nagaa.url }] : []),
  ] }),
  component: Index,
});
const works = [
  { id: 0, src: nagaa.url, medium: "leather" }, { id: 1, src: art1, medium: "leather" },
  { id: 2, src: art2, medium: "leather" }, { id: 3, src: art3, medium: "canvas" },
];
function Index() {
  const [language, setLanguage] = useState<Language>("om");
  const [filter, setFilter] = useState<Filter>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const t = translations[language];
  useEffect(() => {
    try { const saved = localStorage.getItem("nagaa-language"); if (isLanguage(saved)) setLanguage(saved); } catch { /* storage is optional */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function changeLanguage(value: string) {
    if (!isLanguage(value)) return;
    setLanguage(value);
    try { localStorage.setItem("nagaa-language", value); } catch { /* storage is optional */ }
  }
  function toggleFavorite(id: number) { setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  const visible = filterWorks(works, filter, favorites);
  const active = works.find((work) => work.id === selected);
  function step(direction: number) { if (selected !== null) setSelected((selected + direction + works.length) % works.length); }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6">
        <span className="font-display text-xl italic text-primary">Nagaa Art</span>
        <div className="flex flex-wrap items-center gap-5">
          <nav className="flex gap-5 text-sm text-muted-foreground">
            <a href="#hojii" className="hover:text-primary">{t.works}</a>
            <a href="#waa'ee" className="hover:text-primary">{t.about}</a>
            <a href="#quunnamtii" className="hover:text-primary">{t.contact}</a>
          </nav>
          <label className="flex items-center gap-2 text-primary"><Languages className="size-4" /><span className="sr-only">{t.language}</span>
            <select aria-label={t.language} value={language} onChange={(e) => changeLanguage(e.target.value)} className="max-w-40 rounded border border-border bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-4 text-sm uppercase text-primary">{t.profession}</p>
          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">{language === "am" ? "ናጋ አቦማ" : "Nagaa Abboomaa"}</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{t.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg"><a href="#quunnamtii">{t.order}</a></Button>
            <Button asChild size="lg" variant="outline"><a href="#hojii">{t.browse}</a></Button>
          </div>
        </div>
        <img src={nagaa.url} alt="Nagaa Abboomaa" className="w-full rounded shadow-2xl" />
      </section>
      <section id="hojii" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <h2 className="text-4xl">{t.gallery}</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.gallery}>
            {(["all", "leather", "canvas", "favorites"] as Filter[]).map((item) => <Button key={item} variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item === "favorites" && <Heart />}{t[item]}{item === "favorites" && ` (${favorites.length})`}</Button>)}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((work) => <figure key={work.id} className="group overflow-hidden rounded bg-card">
            <div className="relative">
              <Button variant="ghost" className="h-auto w-full overflow-hidden rounded-none p-0 hover:bg-transparent" onClick={() => setSelected(work.id)} aria-label={`${t.view}: ${t.titles[work.id]}`}>
                <img src={work.src} alt={t.titles[work.id]} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 motion-reduce:transition-none group-hover:scale-105" />
              </Button>
              <Button variant="secondary" size="icon" className="absolute right-3 top-3" onClick={() => toggleFavorite(work.id)} aria-label={favorites.includes(work.id) ? t.unsave : t.save} aria-pressed={favorites.includes(work.id)} title={favorites.includes(work.id) ? t.unsave : t.save}><Heart className={favorites.includes(work.id) ? "fill-primary text-primary" : ""} /></Button>
            </div>
            <figcaption className="flex items-center justify-between gap-2 p-4"><div><p className="font-display text-lg">{t.titles[work.id]}</p><p className="text-sm text-muted-foreground">{work.medium === "leather" ? t.leather : t.canvas}</p></div><Button variant="ghost" size="icon" onClick={() => setSelected(work.id)} aria-label={t.view} title={t.view}><Expand /></Button></figcaption>
          </figure>)}
        </div>
        {visible.length === 0 && <p className="border-y border-border py-16 text-center text-muted-foreground" role="status">{t.empty}</p>}
      </section>
      <section id="waa'ee" className="bg-card py-16"><div className="mx-auto max-w-3xl px-6 text-center"><h2 className="mb-6 text-4xl">{t.aboutTitle}</h2><p className="text-lg leading-relaxed text-muted-foreground">{t.bio}</p></div></section>
      <section id="quunnamtii" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl">{t.contactTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, label: t.phone, value: "+251 900 000 000", href: "tel:+251900000000" },
            { icon: Mail, label: t.email, value: "nagaa.art@example.com", href: "mailto:nagaa.art@example.com" },
            { icon: Facebook, label: "Facebook", value: "Nagaa Abboomaa", href: "https://facebook.com" },
            { icon: MapPin, label: t.location, value: t.city, href: undefined },
          ].map((c) => <div key={c.label} className="rounded border border-border p-6"><c.icon className="mb-3 h-6 w-6 text-primary" /><p className="text-sm text-muted-foreground">{c.label}</p>{c.href ? <a href={c.href} className="mt-1 block break-all hover:text-primary">{c.value}</a> : <p className="mt-1">{c.value}</p>}</div>)}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{t.sample}</p>
      </section>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Nagaa Abboomaa — Nagaa Art</footer>
      <Dialog.Root open={active !== undefined} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-background/95" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded border border-border bg-background p-4 sm:p-6" onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}>
            {active && <><div className="mb-4 flex items-center justify-between gap-4"><div><Dialog.Title className="font-display text-xl">{t.titles[active.id]}</Dialog.Title><Dialog.Description className="text-sm text-muted-foreground">{active.medium === "leather" ? t.leather : t.canvas}</Dialog.Description></div><Dialog.Close asChild><Button size="icon" variant="ghost" aria-label={t.close} title={t.close}><X /></Button></Dialog.Close></div>
              <img src={active.src} alt={t.titles[active.id]} className="max-h-[65dvh] w-full object-contain" />
              <div className="mt-4 flex items-center justify-between"><Button variant="outline" size="icon" onClick={() => step(-1)} aria-label={t.previous} title={t.previous}><ChevronLeft /></Button><span className="text-sm text-muted-foreground">{active.id + 1} / {works.length}</span><Button variant="outline" size="icon" onClick={() => step(1)} aria-label={t.next} title={t.next}><ChevronRight /></Button></div></>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
