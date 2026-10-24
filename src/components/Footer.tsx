import { Link } from "@tanstack/react-router";
import { Palette, Phone, Mail, MapPin } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";

export function Footer() {
  const { t } = usePortfolio();

  return (
    <footer className="border-t border-border/50 bg-card/20 py-10 sm:py-12 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 pb-8 border-b border-border/40">
          {/* Brand info */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm shadow-primary/10">
                <Palette className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Nagaa Art
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md sm:max-w-xs text-muted-foreground/85">
              {t.intro}
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.navWorks}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/works" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.navWorks}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.navAbout}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.navContact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.filterByCategoryTitle}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/works" search={{ category: "wallpainting" } as any} className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.categories.wallpainting}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "school" } as any} className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.categories.school}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "hospital" } as any} className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.categories.hospital}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "personal" } as any} className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.categories.personal}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "hotel" } as any} className="hover:text-primary transition-colors inline-block py-0.5">
                  {t.categories.hotel}
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct contact */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 pt-2 sm:pt-0">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.navContact}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <a href="tel:+251917362405" className="hover:text-primary transition-colors">
                  +251 917 362 405
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <a href="mailto:nagaaabboomaa@gmail.com" className="hover:text-primary transition-colors break-all">
                  nagaaabboomaa@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>{t.city}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-2 text-center text-xs">
          <p>© {new Date().getFullYear()} Nagaa Abboomaa — Nagaa Art. All rights reserved.</p>
          <Link
            to="/admin"
            className="text-[11px] text-muted-foreground/45 transition-colors hover:text-primary hover:underline underline-offset-4"
          >
            nagaa
          </Link>
        </div>
      </div>
    </footer>
  );
}
