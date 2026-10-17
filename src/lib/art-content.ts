export type Language = "om" | "en" | "am";
export type Filter = "all" | "leather" | "canvas" | "favorites";
export const languages: { value: Language; label: string }[] = [
  { value: "om", label: "Afaan Oromoo" }, { value: "en", label: "English" }, { value: "am", label: "አማርኛ" },
];
export function isLanguage(value: string | null): value is Language {
  return languages.some((language) => language.value === value);
}
export function filterWorks<T extends { id: number; medium: string }>(works: T[], filter: Filter, favorites: number[]) {
  return works.filter((work) => filter === "all" || (filter === "favorites" ? favorites.includes(work.id) : work.medium === filter));
}
export const translations = {
  om: {
    works: "Hojiiwwan", about: "Waa’ee", contact: "Quunnamtii", profession: "Ogeessa Suuraa Kaasuu",
    intro: "Fuula namootaa, aadaa fi seenaa keenya harkaan gogaa fi kanvaasii irratti kaasa.",
    order: "Ajaja Ergi", browse: "Hojii Ilaali", gallery: "Hojiiwwan Koo", all: "Hunda", leather: "Gogaa irratti", canvas: "Kanvaasii irratti", favorites: "Filatamoo",
    titles: ["Suuraa Gogaa Irratti", "Haadha Keenya", "Abbaa Gadaa", "Gammachuu"],
    aboutTitle: "Waa’ee Koo", bio: "Ani Nagaa Abboomaa, ogeessa suuraa kaasuuti. Suuraa namoota dhuunfaa, kennaa, fi hojii aadaa Oromoo calaqqisiisan ajajaan hojjedha. Suuraan kee yaadannoo bara baraa ta’a.",
    contactTitle: "Na Quunnamaa", phone: "Bilbila", email: "Imeelii", location: "Bakka", city: "Finfinnee, Itoophiyaa",
    sample: "Odeeffannoon quunnamtii fi suuraaleen hojii tokko tokko fakkeenya; odeeffannoo dhugaan ni bakka bu’u.",
    empty: "Hojii filatame hin jiru.", save: "Filatamootti dabali", unsave: "Filatamoo keessaa haqi", view: "Suuraa bal’inaan ilaali", previous: "Kan darbe", next: "Kan itti aanu", close: "Cufi", language: "Afaan",
  },
  en: {
    works: "Works", about: "About", contact: "Contact", profession: "Portrait Artist",
    intro: "I draw the faces, culture, and stories of our people by hand on leather and canvas.",
    order: "Get in touch", browse: "View works", gallery: "My Works", all: "All", leather: "On leather", canvas: "On canvas", favorites: "Favorites",
    titles: ["Portrait on Leather", "Our Mother", "Abbaa Gadaa", "Joy"],
    aboutTitle: "About Me", bio: "I’m Nagaa Abboomaa, a portrait artist. I create commissioned portraits, gifts, and artworks reflecting Oromo culture. Your portrait becomes a lasting memory.",
    contactTitle: "Contact Me", phone: "Phone", email: "Email", location: "Location", city: "Addis Ababa, Ethiopia",
    sample: "Contact details and some artworks are examples, pending replacement with verified information.",
    empty: "No favorite artworks yet.", save: "Add to favorites", unsave: "Remove from favorites", view: "Enlarge artwork", previous: "Previous artwork", next: "Next artwork", close: "Close", language: "Language",
  },
  am: {
    works: "ሥራዎች", about: "ስለ እኔ", contact: "ያግኙኝ", profession: "የሥዕል ባለሙያ",
    intro: "የሰዎችን ፊት፣ ባህላችንን እና ታሪካችንን በቆዳ እና በሸራ ላይ በእጄ እስላለሁ።",
    order: "ያግኙኝ", browse: "ሥራዎችን ይመልከቱ", gallery: "ሥራዎቼ", all: "ሁሉም", leather: "በቆዳ ላይ", canvas: "በሸራ ላይ", favorites: "ተወዳጆች",
    titles: ["በቆዳ ላይ የተሠራ ሥዕል", "እናታችን", "አባ ገዳ", "ደስታ"],
    aboutTitle: "ስለ እኔ", bio: "እኔ ናጋ አቦማ፣ የሥዕል ባለሙያ ነኝ። የግል ሥዕሎችን፣ ስጦታዎችን እና የኦሮሞን ባህል የሚያንጸባርቁ ሥራዎችን በትዕዛዝ እሠራለሁ። ሥዕልዎ ዘላቂ ትውስታ ይሆናል።",
    contactTitle: "ያግኙኝ", phone: "ስልክ", email: "ኢሜይል", location: "አድራሻ", city: "አዲስ አበባ፣ ኢትዮጵያ",
    sample: "የመገናኛ መረጃዎች እና አንዳንድ ሥዕሎች ምሳሌዎች ናቸው፤ በትክክለኛ መረጃ ይተካሉ።",
    empty: "እስካሁን የተመረጡ ሥዕሎች የሉም።", save: "ወደ ተወዳጆች ጨምር", unsave: "ከተወዳጆች አስወግድ", view: "ሥዕሉን አስፋ", previous: "ቀዳሚው ሥዕል", next: "ቀጣዩ ሥዕል", close: "ዝጋ", language: "ቋንቋ",
  },
};