import { Link } from "@tanstack/react-router";
import { Palette, Phone, Mail, MapPin } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";

export function Footer() {
  const { t } = usePortfolio();

  return (
    <footer className="border-t border-border/50 bg-card/20 py-12 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-8 border-b border-border/40">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">Nagaa Art</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              {t.intro}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.navWorks}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/works" className="hover:text-primary transition-colors">
                  {t.navWorks}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  {t.navAbout}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  {t.navContact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.filterByCategoryTitle}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/works" search={{ category: "school" } as any} className="hover:text-primary transition-colors">
                  {t.categories.school}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "hospital" } as any} className="hover:text-primary transition-colors">
                  {t.categories.hospital}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "personal" } as any} className="hover:text-primary transition-colors">
                  {t.categories.personal}
                </Link>
              </li>
              <li>
                <Link to="/works" search={{ category: "hotel" } as any} className="hover:text-primary transition-colors">
                  {t.categories.hotel}
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              {t.navContact}
            </p>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="tel:+251900000000" className="hover:text-primary transition-colors">
                  +251 900 000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:nagaa.art@example.com" className="hover:text-primary transition-colors">
                  nagaa.art@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{t.city}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Nagaa Abboomaa — Nagaa Art. All rights reserved.</p>
          <p className="text-muted-foreground/80">{t.sample}</p>
        </div>
      </div>
    </footer>
  );
}
