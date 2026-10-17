import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Facebook, MapPin } from "lucide-react";
import nagaa from "@/assets/nagaa.jpg.asset.json";
import art1 from "@/assets/art1.jpg";
import art2 from "@/assets/art2.jpg";
import art3 from "@/assets/art3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nagaa Abboomaa — Ogeessa Suuraa Kaasuu" },
      { name: "description", content: "Hojiiwwan suuraa Nagaa Abboomaa: suuraa harkaan kaafame gogaa fi kanvaasii irratti. Ajaja kee nuuf ergi." },
      { property: "og:title", content: "Nagaa Abboomaa — Nagaa Art" },
      { property: "og:description", content: "Suuraa harkaan kaafame gogaa fi kanvaasii irratti. Hojiiwwan ilaali, quunnamii argadhu." },
    ],
  }),
  component: Index,
});

const works = [
  { src: nagaa.url, title: "Suuraa Gogaa Irratti", note: "Gogaa fi muka aadaa" },
  { src: art1, title: "Haadha Keenya", note: "Gogaa irratti" },
  { src: art2, title: "Abbaa Gadaa", note: "Gogaa irratti" },
  { src: art3, title: "Gammachuu", note: "Kanvaasii irratti" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl italic text-primary">Nagaa Art</span>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#hojii" className="hover:text-primary">Hojiiwwan</a>
          <a href="#waa'ee" className="hover:text-primary">Waa'ee</a>
          <a href="#quunnamtii" className="hover:text-primary">Quunnamtii</a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Ogeessa Suuraa Kaasuu</p>
          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">Nagaa Abboomaa</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Fuula namootaa, aadaa fi seenaa keenya harkaan gogaa fi kanvaasii irratti kaasa.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#quunnamtii" className="rounded bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">Ajaja Ergi</a>
            <a href="#hojii" className="rounded border border-border px-6 py-3 transition hover:border-primary">Hojii Ilaali</a>
          </div>
        </div>
        <img src={nagaa.url} alt="Nagaa Abboomaa suuraa isaa waliin" className="w-full rounded shadow-2xl" />
      </section>

      <section id="hojii" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl">Hojiiwwan Koo</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {works.map((w) => (
            <figure key={w.title} className="group overflow-hidden rounded bg-card">
              <img src={w.src} alt={w.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="p-4">
                <p className="font-display text-lg">{w.title}</p>
                <p className="text-sm text-muted-foreground">{w.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="waa'ee" className="bg-card py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-4xl">Waa'ee Koo</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Ani Nagaa Abboomaa, ogeessa suuraa kaasuuti. Suuraa namoota dhuunfaa, kennaa, fi hojii aadaa
            Oromoo calaqqisiisan ajajaan hojjedha. Suuraan kee yaadannoo bara baraa ta'a.
          </p>
        </div>
      </section>

      <section id="quunnamtii" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl">Na Quunnamaa</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, label: "Bilbila", value: "+251 900 000 000", href: "tel:+251900000000" },
            { icon: Mail, label: "Imeelii", value: "nagaa.art@example.com", href: "mailto:nagaa.art@example.com" },
            { icon: Facebook, label: "Facebook", value: "Nagaa Abboomaa", href: "https://facebook.com" },
            { icon: MapPin, label: "Bakka", value: "Finfinnee, Itoophiyaa", href: undefined },
          ].map((c) => (
            <a key={c.label} href={c.href} className="rounded border border-border p-6 transition hover:border-primary">
              <c.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-1 break-all">{c.value}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nagaa Abboomaa — Nagaa Art
      </footer>
    </div>
  );
}
