import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Palette, Languages, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/hooks/use-portfolio";

export function Navbar() {
  const { language, changeLanguage, languages, t } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { to: "/", label: t.navHome },
    { to: "/works", label: t.navWorks },
    { to: "/about", label: t.navAbout },
    { to: "/contact", label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:bg-primary/20">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Nagaa Art
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              Nagaa Abboomaa · Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select-nav" className="sr-only">
              {t.language}
            </label>
            <div className="pointer-events-none absolute left-2.5 flex items-center text-primary">
              <Languages className="h-4 w-4" />
            </div>
            <select
              id="language-select-nav"
              aria-label={t.language}
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="h-9 cursor-pointer rounded-full border border-border/80 bg-card/80 py-1 pl-8 pr-7 text-xs font-medium text-foreground backdrop-blur focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value} className="bg-card text-foreground">
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Order CTA */}
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex rounded-full bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all"
          >
            <Link to="/contact">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t.order}
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/50 bg-background/95 px-4 pt-2 pb-5 backdrop-blur-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button asChild size="sm" className="mt-2 w-full rounded-xl bg-primary text-primary-foreground">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t.order}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
