import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePortfolio } from "@/hooks/use-portfolio";
import { listSelectableCategories, type Category } from "@/lib/art-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Commission — Nagaa Art | Order Custom Artworks" },
      {
        name: "description",
        content:
          "Commission bespoke leather and canvas portraits for schools, hospitals, hotels, and personal collections from Nagaa Abboomaa.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, language, addInquiry, customCategories, categoryLabel } = usePortfolio();
  const formCategories = listSelectableCategories(customCategories);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("personal");
  const [formMedium, setFormMedium] = useState<"leather" | "canvas" | "both">("leather");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      toast.error(
        language === "om"
          ? "Mee maqaa fi bilbila keessan guutaa."
          : language === "am"
            ? "እባክዎ ስምዎን እና ስልክዎን ያስገቡ።"
            : "Please enter your name and phone number."
      );
      return;
    }

    setIsSubmitting(true);
    addInquiry({
      name: formName.trim(),
      phone: formPhone.trim(),
      category: formCategory,
      medium: formMedium,
      message: formMessage.trim(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t.formSuccess, {
        duration: 5000,
      });
      setFormName("");
      setFormPhone("");
      setFormMessage("");
    }, 700);
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
                {t.navContact}
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t.contactTitle}
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                {t.contactSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Direct channels and reassurance */}
              <div className="space-y-6 lg:col-span-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {t.phone} &amp; {t.telegram}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t.contactSubtitle}
                  </p>
                </div>

                {/* Direct Phone */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-primary/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t.phone}</p>
                        <a
                          href="tel:+251900000000"
                          className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors"
                        >
                          +251 900 000 000
                        </a>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="rounded-full text-xs self-start sm:self-auto">
                      <a href="tel:+251900000000">{t.quickDirectCall}</a>
                    </Button>
                  </div>
                </div>

                {/* Telegram / WhatsApp */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.telegram} / WhatsApp</p>
                      <a
                        href="https://t.me/nagaa_art"
                        target="_blank"
                        rel="noreferrer"
                        className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors"
                      >
                        @nagaa_art
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                      <a
                        href="mailto:nagaa.art@example.com"
                        className="font-semibold text-foreground hover:text-primary transition-colors break-all"
                      >
                        nagaa.art@example.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                      <p className="font-semibold text-foreground">{t.city}</p>
                    </div>
                  </div>
                </div>

                {/* Trust Pledge */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <span>{t.artisanPledge}</span>
                </div>
              </div>

              {/* Right Column: Commission Request Form */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:col-span-7 shadow-xl">
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {t.order}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.contactSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="form-name"
                        className="mb-1.5 block text-xs font-semibold text-foreground"
                      >
                        {t.formName} *
                      </label>
                      <Input
                        id="form-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Nagaa / Organization"
                        className="rounded-xl border-border/80 bg-background/60 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="form-phone"
                        className="mb-1.5 block text-xs font-semibold text-foreground"
                      >
                        {t.formPhone} *
                      </label>
                      <Input
                        id="form-phone"
                        type="text"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+251 9... / @username"
                        className="rounded-xl border-border/80 bg-background/60 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Project Category Selection */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-foreground">
                      {t.formCategory}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {formCategories.map((cat) => (
                          <label
                            key={cat}
                            className={`flex cursor-pointer items-center justify-center rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                              formCategory === cat
                                ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                                : "border-border/80 bg-background/40 text-muted-foreground hover:bg-background/80"
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              checked={formCategory === cat}
                              onChange={() => setFormCategory(cat)}
                              className="sr-only"
                            />
                            <span>{categoryLabel(cat)}</span>
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Medium Selection */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-foreground">
                      {t.formMedium}
                    </label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        { key: "leather" as const, label: t.formMediumLeather },
                        { key: "canvas" as const, label: t.formMediumCanvas },
                        { key: "both" as const, label: t.formMediumBoth },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className={`flex cursor-pointer items-center justify-center rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                            formMedium === item.key
                              ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                              : "border-border/80 bg-background/40 text-muted-foreground hover:bg-background/80"
                          }`}
                        >
                          <input
                            type="radio"
                            name="medium"
                            value={item.key}
                            checked={formMedium === item.key}
                            onChange={() => setFormMedium(item.key)}
                            className="sr-only"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="form-message"
                      className="mb-1.5 block text-xs font-semibold text-foreground"
                    >
                      {t.formMessage}
                    </label>
                    <Textarea
                      id="form-message"
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder={t.formMessagePlaceholder}
                      className="rounded-xl border-border/80 bg-background/60 focus:border-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] transition-all"
                  >
                    {isSubmitting ? (
                      t.formSending
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t.formSubmit}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
