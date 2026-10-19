export type Language = "om" | "en" | "am";
export type Filter = "all" | "leather" | "canvas" | "favorites";
export type BuiltInCategory = "all" | "personal" | "hotel" | "school" | "hospital" | "other";
/** Built-in categories plus custom slugs created in admin. */
export type Category = BuiltInCategory | (string & {});

export interface CustomCategory {
  id: string;
  label: string;
}

export const languages: { value: Language; label: string; flag: string }[] = [
  { value: "om", label: "Afaan Oromoo", flag: "🌳" },
  { value: "en", label: "English", flag: "🌐" },
  { value: "am", label: "አማርኛ", flag: "🇪🇹" },
];

export const BUILTIN_CATEGORIES: BuiltInCategory[] = [
  "all",
  "personal",
  "hotel",
  "school",
  "hospital",
  "other",
];

export const categories: { value: BuiltInCategory }[] = BUILTIN_CATEGORIES.map((value) => ({
  value,
}));

export function isLanguage(value: string | null): value is Language {
  return languages.some((language) => language.value === value);
}

export function isBuiltInCategory(value: string): value is BuiltInCategory {
  return BUILTIN_CATEGORIES.includes(value as BuiltInCategory);
}

export function slugifyCategory(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `cat-${Date.now()}`;
}

export function getCategoryLabel(
  category: string,
  builtInLabels: Record<BuiltInCategory, string>,
  customCategories: CustomCategory[] = []
): string {
  if (isBuiltInCategory(category)) return builtInLabels[category];
  return customCategories.find((item) => item.id === category)?.label ?? category;
}

export function listSelectableCategories(
  customCategories: CustomCategory[] = []
): Category[] {
  const builtIn = BUILTIN_CATEGORIES.filter((c) => c !== "all");
  return [...builtIn, ...customCategories.map((c) => c.id)];
}

// Preserve existing filterWorks signature for 100% backward compatibility & tests
export function filterWorks<T extends { id: number; medium: string }>(
  works: T[],
  filter: Filter,
  favorites: number[]
) {
  return works.filter((work) =>
    filter === "all" || (filter === "favorites" ? favorites.includes(work.id) : work.medium === filter)
  );
}

// Advanced filter supporting both Medium and Category
export function filterWorksByCategory<
  T extends { id: number; medium: string; category: string }
>(
  works: T[],
  mediumFilter: Filter,
  categoryFilter: string,
  favorites: number[]
) {
  return works.filter((work) => {
    const matchesMedium =
      mediumFilter === "all" ||
      (mediumFilter === "favorites" ? favorites.includes(work.id) : work.medium === mediumFilter);

    const matchesCategory =
      categoryFilter === "all" || work.category === categoryFilter;

    return matchesMedium && matchesCategory;
  });
}

export interface TranslationSchema {
  navHome: string;
  navWorks: string;
  navProcess: string;
  navAbout: string;
  navContact: string;
  heroBadge: string;
  profession: string;
  heroTitlePrefix: string;
  heroTitleAccent: string;
  intro: string;
  order: string;
  browse: string;
  statsArtworks: string;
  statsHandcrafted: string;
  statsYears: string;
  gallery: string;
  gallerySubtitle: string;
  all: string;
  leather: string;
  canvas: string;
  favorites: string;
  titles: string[];
  descriptions: string[];
  categories: Record<BuiltInCategory, string>;
  categoryDescriptions: Record<BuiltInCategory, string>;
  mediumDetails: {
    leather: string;
    canvas: string;
  };
  empty: string;
  emptyHint: string;
  save: string;
  unsave: string;
  view: string;
  previous: string;
  next: string;
  close: string;
  language: string;
  orderSimilar: string;
  processTitle: string;
  processSubtitle: string;
  steps: {
    num: string;
    title: string;
    desc: string;
  }[];
  aboutTitle: string;
  aboutSubtitle: string;
  bio: string;
  quote: string;
  artisanPledge: string;
  contactTitle: string;
  contactSubtitle: string;
  phone: string;
  email: string;
  location: string;
  city: string;
  telegram: string;
  sample: string;
  formName: string;
  formPhone: string;
  formMedium: string;
  formMediumLeather: string;
  formMediumCanvas: string;
  formMediumBoth: string;
  formCategory: string;
  formMessage: string;
  formMessagePlaceholder: string;
  formSubmit: string;
  formSending: string;
  formSuccess: string;
  quickDirectCall: string;
  verifiedArtist: string;
  filterByCategoryTitle: string;
  filterByMediumTitle: string;
  viewAllWorks: string;
  // Admin Portal
  navAdmin: string;
  adminTitle: string;
  adminSubtitle: string;
  adminLoginTitle: string;
  adminLoginSubtitle: string;
  adminEmailOrUser: string;
  adminPassword: string;
  adminLoginButton: string;
  adminLogout: string;
  adminArtworksTab: string;
  adminInquiriesTab: string;
  adminAddArtwork: string;
  adminNewArtworkTitle: string;
  adminNewArtworkMedium: string;
  adminNewArtworkCategory: string;
  adminNewArtworkDimensions: string;
  adminNewArtworkImage: string;
  adminNewArtworkDesc: string;
  adminUploadHint: string;
  adminArtworkAdded: string;
  adminArtworkDeleted: string;
  adminInquiryStatusUpdated: string;
  adminInquiryDeleted: string;
  adminQuickDemoLogin: string;
  adminSearchClients: string;
  adminFilterStatus: string;
  adminStatusPending: string;
  adminStatusInProgress: string;
  adminStatusCompleted: string;
  adminStatusAll: string;
  adminNoInquiries: string;
  adminActionCall: string;
  adminEditArtwork: string;
  adminArtworkUpdated: string;
  adminConfirmDelete: string;
  adminSaveChanges: string;
  adminCancel: string;
  adminDelete: string;
  adminOverview: string;
  adminSeeAll: string;
  adminAddNewCategory: string;
  adminNewCategoryName: string;
  adminNewCategoryPlaceholder: string;
  adminCategoryAdded: string;
  adminUploadFromComputer: string;
  adminOrPasteUrl: string;
  adminDropImageHere: string;
  adminImageTooLarge: string;
  adminImageRequired: string;
  adminTitleRequired: string;
  adminProfile: string;
  adminEditProfile: string;
  adminProfileName: string;
  adminProfileRole: string;
  adminProfileEmail: string;
  adminProfilePhone: string;
  adminProfilePhoto: string;
  adminProfileUpdated: string;
  // Compatibility
  works: string;
  about: string;
  contact: string;
}

export const translations: Record<Language, TranslationSchema> = {
  om: {
    navHome: "Fuula Duraa",
    navWorks: "Hojiiwwan",
    navProcess: "Adeemsa",
    navAbout: "Waa’ee",
    navContact: "Quunnamtii",
    heroBadge: "Ogeessa Suuraa & Aadaa Oromoo",
    profession: "Ogeessa Suuraa Gogaa & Kanvaasii",
    heroTitlePrefix: "Aadaa fi Seenaa Keenya",
    heroTitleAccent: "Harkaan Bocuu",
    intro: "Fuula namootaa, aadaa fi seenaa ummata keenyaa gogaa loonii fi kanvaasii qulqulluu irratti harkaan nan kaasa. Suuraan kee yaadannoo bara baraa fi dhalootatti darbu ta’a.",
    order: "Suuraa Ajajadhu",
    browse: "Hojiiwwan Ilaali",
    statsArtworks: "Hojiiwwan 100+",
    statsHandcrafted: "100% Harkaan",
    statsYears: "Muuxannoo Waggaa 8+",
    gallery: "Galarii Hojiiwwan Koo",
    gallerySubtitle: "Hojiiwwan gogaa loonii aadaa fi kanvaasii irratti ramaddii adda addaatiin qoodaman.",
    all: "Hunda",
    leather: "Gogaa irratti",
    canvas: "Kanvaasii irratti",
    favorites: "Filatamoo",
    titles: [
      "Suuraa Gogaa Aadaa - Dr. Alii Birraa",
      "Suuraa Gogaa Aadaa - Haacaaluu Hundeessaa",
      "Suuraa Hooggansa & Seenaa Gogaa Irratti",
      "Fakkii Gamoo Dizaayinii Ammayyaa (School Mural)",
      "Ayyaana Irreechaa & Odaa Guddaa",
      "Mural Aadaa Bunaa (Elora Coffee)",
      "Mural Hidha Haaromsaa & Uumama Bareedaa",
      "Fakkii Aartii Kaaffee Ammayyaa",
      "Suuraa Kanvaasii - Haacaaluu Hundeessaa",
      "Shammarree Oromoo & Ilillii Malkaa",
      "Suuraa Jaarsa Biyyaa & Hayyuu",
      "Suuraa Dhuunfaa Qalama & Halluutiin",
      "Mural Barnootaa - Jijjiirama Ilma Namaa",
      "Mural Daldalaa - Olii Men's Salon",
      "Fakkii Bineensota Bosonaa & Saavaanaa",
    ],
    descriptions: [
      "Suuraa seena-qabeessa artiistii kabajamaa Dr. Alii Birraa gitaara waliin gogaa loonii fi muka dhiheetiin qophaa'e.",
      "Suuraa seena-qabeessa Haacaaluu Hundeessaa gogaa loonii qulqulluu muka aadaatiin hidhame irratti harkaan kan bocame.",
      "Suuraa hayyuu fi hoogganaa gogaa aadaa fi muka qulqulluun galma mootummaa fi waajjiraalee gurguddoof qophaa'e.",
      "Mural ammayyaa halluuwwan miidhagoon gamoo mana barumsaa fi dhaabbilee dhaloota haaraa kakaasuuf kan hojjetame.",
      "Ayyaana Irreechaa malkaa irratti, Odaa guddaa fi sirna aadaa Oromoo boonsaa galma hoteelaa fi aadaaf kan bocame.",
      "Dizaayinii aadaa fi ammayyaa buna Oromoo galma bunaa fi manneen keessummaa miidhagsuuf kan bocame.",
      "Fakkii uumama bishaanii, bidiiruu fi gaarreen nagaa fi tasgabbii buufata fayyaa fi hospitaalaaf kennu.",
      "Mural ammayyaa bareedina dubaraa, daraaraa fi muka bunaa bakkeewwan bashannanaa fi hoteelaaf kan hojjetame.",
      "Suuraa artist Haacaaluu Hundeessaa kanvaasii qulqulluu irratti halluu zayitii warqee fi fakkii ifaa qabuun harkaan kan bocame.",
      "Shammarree aadaa Oromoo marga fi ilillii jiidhaa qabattee malkaatti eebbiftu mana barumsaa fi aadaaf kan bocame.",
      "Suuraa kabajamaa abbootii fi hayyoota biyyaa eebba, nagaa fi araara buufata fayyaa fi manneen maatiitiif kennu.",
      "Suuraa dhuunfaa qulqulluu qalamaa fi halluu addaatiin bifa ammayyaawaa ta'een harkaan kan bocame.",
      "Fakkii barnootaa seenaa fi jijjiirama dhala namaa mana barumsaatiif gadi fageenyaan kan bocame.",
      "Mural aartii fi beekamtii daldalaa 'Olii Men's Salon' harkoota hedduu meeshaalee rifeensaa qabataniin miidhage.",
      "Fakkii qulqulluu bineensota bosonaa (Leenca, Arba, fi Qeeerrensa) naannoo saavaanaa fi tasgabbii fayyaatiif kan qophaa'e.",
    ],
    categories: {
      all: "Hunda",
      personal: "Dhuunfaa & Maatii",
      hotel: "Hoteela & Galma",
      school: "Mana Barumsaa",
      hospital: "Hospitaala & Fayyaa",
      other: "Aadaa & Biroo",
    },
    categoryDescriptions: {
      all: "Hojiiwwan gogaa fi kanvaasii ramaddii hunda asitti ilaalaa.",
      personal: "Suuraa maatii, abbaa fi haadha, fi kennaa jaalalaa gogaa fi kanvaasii irratti.",
      hotel: "Hojiiwwan galma hoteelaa, kutaa keessummootaa fi manneen nyaataa miidhagsan.",
      school: "Suuraalee seenaa, seera aadaa fi hayyoota manneen barnootaatiif qophaa'an.",
      hospital: "Suuraalee nagaa, fayyaa, fi jaalala haadhaa hospitaalaaf qophaa'an.",
      other: "Hojiiwwan aadaa Oromoo fi kennaalee addaa kanneen biroo.",
    },
    mediumDetails: {
      leather: "Gogaa loonii qulqulluu muka aadaatiin hidhame",
      canvas: "Kanvaasii qulqulluu fi halluu zayitii",
    },
    empty: "Hojii filatame hin jiru.",
    emptyHint: "Ramaddii ykn gosa kan biraa filadhaa, yookiin suuraaleen jaallattan onnee tuquun asitti walitti qabadhaa.",
    save: "Filatamootti dabali",
    unsave: "Filatamoo keessaa haqi",
    view: "Suuraa bal’inaan ilaali",
    previous: "Kan darbe",
    next: "Kan itti aanu",
    close: "Cufi",
    language: "Afaan",
    orderSimilar: "Waan Akkanaa Ajajadhu",
    processTitle: "Adeemsa Hojii Keenyaa",
    processSubtitle: "Suuraa keessan irraa kaasee hanga gogaa fi kanvaasii irratti harkaan qophaa'utti safara sadii salphaa.",
    steps: [
      {
        num: "01",
        title: "Suuraa Filadhaa",
        desc: "Suuraa qulqullina qabu nuuf ergaa; gogaa loonii ykn kanvaasii irratti akka ta'u filadhaa.",
      },
      {
        num: "02",
        title: "Qophii Gogaa & Muka",
        desc: "Gogaan loonii qulqulluun qophaa'ee mukatti hidhama, ykn kanvaasiin sadarkaa olaanaa qophaa'a.",
      },
      {
        num: "03",
        title: "Harkaan Boca & Simannaa",
        desc: "Halluu zayitii qulqulluun harkaan bocamee xumuramee bakka jirtanitti nageenyaan isin bira ga'a.",
      },
    ],
    aboutTitle: "Waa’ee Nagaa Abboomaa",
    aboutSubtitle: "Ogeessa Suuraa Gogaa & Kanvaasii",
    bio: "Ani Nagaa Abboomaa, ogeessa suuraa kaasuuti. Suuraa namoota dhuunfaa, manneen barnootaa, hospitaala, hoteelota, fi hojii aadaa Oromoo calaqqisiisan ajajaan hojjedha. Fuula maatii fi seenaa ummata keenyaa gogaa fi kanvaasii irratti harkaan nan boka.",
    quote: "«Suuraan gogaa irratti bocame yeroo darbuun hin dulloomu; dhalootaa dhalootatti seenaa fi jaalala maatii tursa.»",
    artisanPledge: "Hojiin hundi 100% harkaan kan qophaa'u fi qulqullina dhalootaaf turu qaba.",
    contactTitle: "Na Quunnamaa & Ajaja Ergaa",
    contactSubtitle: "Suuraa keessan ykn kan dhaabbata keessanii (Mana Barumsaa, Hospitaala, Hoteela, Dhuunfaa) gogaa fi kanvaasii irratti hojjechiisuuf amma na quunnamaa.",
    phone: "Bilbila",
    email: "Imeelii",
    location: "Bakka",
    city: "Finfinnee, Itoophiyaa",
    telegram: "Telegram",
    sample: "Odeeffannoon quunnamtii fi suuraaleen hojii tokko tokko fakkeenya; odeeffannoo dhugaan ni bakka bu’u.",
    formName: "Maqaa Guutuu / Dhaabbataa",
    formPhone: "Lakkoofsa Bilbilaa / Telegram",
    formMedium: "Gosa Qophii Barbaaddan",
    formMediumLeather: "Gogaa Loonii Irratti (Leather Portrait)",
    formMediumCanvas: "Kanvaasii Irratti (Canvas Painting)",
    formMediumBoth: "Lamaan Isaayyuu / Gorsa Barbaada",
    formCategory: "Ramaddii Hojichaa",
    formMessage: "Ibsa Suuraa / Yaada Keessan",
    formMessagePlaceholder: "Fkn: Hoteela / Mana barumsaa / Dhuunfaa keenyaaf suuraa gogaa irratti hojjechiisuun barbaada...",
    formSubmit: "Ajaja / Ergaa Ergi",
    formSending: "Ergamaa jira...",
    formSuccess: "Galatoomaa! Gaaffiin keessan milkaa'inaan ergameera. Dafee isin quunnama.",
    quickDirectCall: "Amma Bilbilaa",
    verifiedArtist: "Ogeessa Qulqullina Mirkanaa'e",
    filterByCategoryTitle: "Ramaddiidhaan Filadhu",
    filterByMediumTitle: "Gosa Meeshaatiin",
    viewAllWorks: "Hojiiwwan Hunda Ilaali",
    // Admin Portal
    navAdmin: "Admin",
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Istuudiyoo Nagaa Art bulchuu, suuraalee dabaluu, fi ajajoota maamiltootaa to'achuuf.",
    adminLoginTitle: "Seensa Admin (Admin Login)",
    adminLoginSubtitle: "Istuudiyoo Nagaa Art bulchuuf asitti seenaa.",
    adminEmailOrUser: "Imeelii / Maqaa Admin",
    adminPassword: "Jecha Icchiitii (Password)",
    adminLoginButton: "Seeni",
    adminLogout: "Bahi",
    adminArtworksTab: "Suuraalee & Hojiiwwan",
    adminInquiriesTab: "Ajaja Maamiltootaa",
    adminAddArtwork: "Suuraa Haaraa Dabali",
    adminNewArtworkTitle: "Mata Duree Suuraa",
    adminNewArtworkMedium: "Gosa Meeshaa",
    adminNewArtworkCategory: "Ramaddii Hojii",
    adminNewArtworkDimensions: "Hojjaa fi Bal'ina (Fkn: 60 × 80 cm)",
    adminNewArtworkImage: "Suuraa Ol-fe'i (Image File / URL)",
    adminNewArtworkDesc: "Ibsa Gabaabaa Suurichaa",
    adminUploadHint: "Suuraa kompiitara keessan irraa filadhaa ykn teessoo (URL) isaa galchaa",
    adminArtworkAdded: "Suuraan haaraan milkaa'inaan dabalameera!",
    adminArtworkDeleted: "Suuraan filatame haqameera.",
    adminInquiryStatusUpdated: "Haalli ajajichaa jijjiirameera.",
    adminInquiryDeleted: "Ajajni haqameera.",
    adminQuickDemoLogin: "Seensa Salphaa (Demo Login)",
    adminSearchClients: "Maqaa maamilaatiin ykn bilbilaan barbaada...",
    adminFilterStatus: "Haala Ajajaatiin",
    adminStatusPending: "Eeggachaa",
    adminStatusInProgress: "Hojjetamaa Jira",
    adminStatusCompleted: "Xumurame",
    adminStatusAll: "Hunda",
    adminNoInquiries: "Ajajni haaraan hin jiru.",
    adminActionCall: "Bilbilaa",
    adminEditArtwork: "Hojii Fooyyessi",
    adminArtworkUpdated: "Hojiin milkaa'inaan fooyya'eera!",
    adminConfirmDelete: "Hojii kana haqachuu barbaadduu?",
    adminSaveChanges: "Jijjiirama Olkaa'i",
    adminCancel: "Dhiisi",
    adminDelete: "Haqi",
    adminOverview: "Cuunfaa",
    adminSeeAll: "Hunda Ilaali",
    adminAddNewCategory: "+ Ramaddii Haaraa Dabali",
    adminNewCategoryName: "Maqaa Ramaddii Haaraa",
    adminNewCategoryPlaceholder: "Fkn: Cafe, Salon, Office...",
    adminCategoryAdded: "Ramaddiin haaraan dabalameera!",
    adminUploadFromComputer: "Suuraa Kompiitara Irraa Filadhu",
    adminOrPasteUrl: "Yookiin URL galchi",
    adminDropImageHere: "Suuraa asitti harkisi ykn cuqaasi",
    adminImageTooLarge: "Suuraan kun guddaadha. MB 2 gadi fayyadami.",
    adminImageRequired: "Suuraa ol-fe'i ykn URL galchi.",
    adminTitleRequired: "Mata duree suuraa galchi.",
    adminProfile: "Profaayilii",
    adminEditProfile: "Profaayilii Fooyyessi",
    adminProfileName: "Maqaa Guutuu",
    adminProfileRole: "Sadarkaa / Ogummaa",
    adminProfileEmail: "Imeelii",
    adminProfilePhone: "Bilbila",
    adminProfilePhoto: "Suuraa Profaayilii",
    adminProfileUpdated: "Profaayiliin milkaa'inaan fooyya'eera!",
    // Compatibility
    works: "Hojiiwwan",
    about: "Waa’ee",
    contact: "Quunnamtii",
  },
  en: {
    navHome: "Home",
    navWorks: "Works",
    navProcess: "Process",
    navAbout: "About",
    navContact: "Contact",
    heroBadge: "Oromo Heritage & Fine Art",
    profession: "Leather & Canvas Portrait Artist",
    heroTitlePrefix: "Preserving Heritage & Stories",
    heroTitleAccent: "Handcrafted on Leather",
    intro: "I handcraft meaningful portraits, cultural history, and timeless faces onto authentic stretched leather and primed canvas. A commissioned artwork that becomes an enduring family and institutional heirloom.",
    order: "Commission a Portrait",
    browse: "Explore Works",
    statsArtworks: "100+ Artworks",
    statsHandcrafted: "100% Handcrafted",
    statsYears: "8+ Years Craft",
    gallery: "Curated Portfolio",
    gallerySubtitle: "Handcrafted portraiture and fine art categorized for schools, hospitals, hotels, and personal collections.",
    all: "All Works",
    leather: "On Leather",
    canvas: "On Canvas",
    favorites: "Favorites",
    titles: [
      "Cultural Leather Portrait - Dr. Ali Birra",
      "Cultural Leather Portrait - Hachalu Hundessa",
      "Executive Heritage Leather Commission",
      "Modern School & Campus Mural",
      "Irreecha Gathering Under the Sacred Odaa",
      "Elora Coffee Culinary Lounge Mural",
      "Dam & Scenic Nature Landscape Mural",
      "Modern Botanical Cafe Mural",
      "Fine Art Canvas Portrait - Hachalu Hundessa",
      "Oromo Maiden with Ililli by Sacred Waters",
      "The Venerable Elder & Statesman",
      "Detailed Expression Commission Portrait",
      "Human Evolution Educational Campus Mural",
      "Olii Men's Salon Signature Brand Mural",
      "African Wildlife Safari & Savanna Landscape",
    ],
    descriptions: [
      "A legendary tribute to beloved music icon Dr. Ali Birra with his acoustic guitar hand-painted on stretched raw leather with handcrafted timber frame.",
      "An iconic hand-painted tribute to legendary artist Hachalu Hundessa on natural raw stretched cowhide bound with handcrafted timber frame.",
      "A formal dignitary portrait hand-painted on stretched raw cowhide designed for executive halls and diplomatic offices.",
      "A vibrant exterior architectural mural with dynamic geometric contours and colors inspiring modern students and institutions.",
      "A breathtaking large-scale mural capturing the Irreecha thanksgiving festival by the river under the ancestral Odaa tree for hotels and halls.",
      "A sophisticated coffee culture mural uniting traditional coffee heritage with contemporary cafe aesthetics.",
      "An expansive panoramic landscape depicting clean water, navigation, and green hills providing peace and serenity for healthcare facilities.",
      "A contemporary cafe statement mural pairing bold botanical coffee florals and stylized portrait aesthetics.",
      "Masterful oil and acrylic canvas portrait of Hachalu Hundessa painted with warm golden and magenta atmospheric tones.",
      "A symbolic cultural mural celebrating the pure spirit of young Oromo women offering fresh green ililli grass at the sacred spring.",
      "A dignified oil portrait of a respected community elder symbolizing wisdom, guidance, and peaceful healing.",
      "A hyper-detailed color pencil and fine ink commissioned portrait rendered with striking character and warmth.",
      "A comprehensive educational scientific mural illustrating human evolution designed for schools and biology departments.",
      "An energetic commercial statement mural created for 'Olii Men's Salon' featuring dynamic hands wielding grooming tools.",
      "A rich fine art canvas depicting majestic African wildlife (Lion, Elephant, and Tiger) in the golden sunlit savanna.",
    ],
    categories: {
      all: "All Categories",
      personal: "Personal & Family",
      hotel: "Hotel & Lounge",
      school: "School & Heritage",
      hospital: "Hospital & Healthcare",
      other: "Cultural & Other",
    },
    categoryDescriptions: {
      all: "Browse all leather and canvas artworks across every category.",
      personal: "Cherished portraits of parents, loved ones, and generational family heirlooms.",
      hotel: "Statement cultural artworks for luxury hotel lobbies, VIP suites, and restaurants.",
      school: "Educational, historical, and cultural leadership art for schools and academies.",
      hospital: "Peaceful, uplifting artworks promoting maternal care, life, and healing environments.",
      other: "Special cultural commissions and unique bespoke artisan pieces.",
    },
    mediumDetails: {
      leather: "Natural cowhide stretched on timber branch frame",
      canvas: "Fine linen canvas with archival oil colors",
    },
    empty: "No artworks match your selected filters.",
    emptyHint: "Try selecting another category or medium, or add favorites to view them here.",
    save: "Add to favorites",
    unsave: "Remove from favorites",
    view: "Enlarge artwork",
    previous: "Previous artwork",
    next: "Next artwork",
    close: "Close",
    language: "Language",
    orderSimilar: "Commission Similar Artwork",
    processTitle: "The Craftsmanship Process",
    processSubtitle: "From your cherished photograph to an heirloom artwork in three clear steps.",
    steps: [
      {
        num: "01",
        title: "Share Your Photo",
        desc: "Send a clear photo of your loved one or describe the cultural portrait concept you envision.",
      },
      {
        num: "02",
        title: "Leather & Timber Prep",
        desc: "Genuine cowhide is treated, stretched, and bound with hemp twine onto rustic timber frames.",
      },
      {
        num: "03",
        title: "Hand Painting & Delivery",
        desc: "Drawn and painted meticulously with lasting pigments, then packaged safely for doorstep delivery.",
      },
    ],
    aboutTitle: "About Nagaa Abboomaa",
    aboutSubtitle: "Master Portrait Artist & Cultural Custodian",
    bio: "I’m Nagaa Abboomaa, a portrait artist based in Addis Ababa. I create commissioned portraits, gifts, and cultural artworks for families, schools, hospitals, and hotels reflecting Ethiopian and Oromo heritage.",
    quote: "“A portrait drawn on leather doesn’t fade with time; it carries the story, honour, and love of family forever.”",
    artisanPledge: "Every piece is 100% handcrafted with archival natural materials and meticulous care.",
    contactTitle: "Get in Touch & Order",
    contactSubtitle: "Ready to commission a bespoke leather or canvas portrait for your home, school, hospital, or hotel? Reach out directly today.",
    phone: "Phone",
    email: "Email",
    location: "Location",
    city: "Addis Ababa, Ethiopia",
    telegram: "Telegram",
    sample: "Contact details and some artworks are examples, pending replacement with verified information.",
    formName: "Your Full Name / Organization",
    formPhone: "Phone Number / Telegram",
    formMedium: "Preferred Medium",
    formMediumLeather: "On Leather (Hand-stretched cowhide)",
    formMediumCanvas: "On Canvas (Oil painting)",
    formMediumBoth: "Either / Need consultation",
    formCategory: "Project Category",
    formMessage: "Artwork Details & Special Notes",
    formMessagePlaceholder: "E.g. I’d like a cultural centerpiece on stretched leather for our hotel lobby...",
    formSubmit: "Send Commission Request",
    formSending: "Sending...",
    formSuccess: "Thank you! Your inquiry has been sent successfully. I will get back to you promptly.",
    quickDirectCall: "Call Now",
    verifiedArtist: "Verified Master Artisan",
    filterByCategoryTitle: "Filter by Category",
    filterByMediumTitle: "Filter by Medium",
    viewAllWorks: "View All Artworks",
    // Admin Portal
    navAdmin: "Admin",
    adminTitle: "Admin Studio Dashboard",
    adminSubtitle: "Manage Nagaa Art portfolio, add new artworks, and control client commission requests.",
    adminLoginTitle: "Admin Portal Login",
    adminLoginSubtitle: "Sign in to access your studio management console.",
    adminEmailOrUser: "Email or Admin Username",
    adminPassword: "Password",
    adminLoginButton: "Sign In",
    adminLogout: "Log Out",
    adminArtworksTab: "Artworks & Gallery",
    adminInquiriesTab: "Client Orders & Registrations",
    adminAddArtwork: "Add New Artwork",
    adminNewArtworkTitle: "Artwork Title",
    adminNewArtworkMedium: "Medium",
    adminNewArtworkCategory: "Category",
    adminNewArtworkDimensions: "Dimensions (e.g. 60 × 80 cm)",
    adminNewArtworkImage: "Upload Image / Image URL",
    adminNewArtworkDesc: "Brief Description & Story",
    adminUploadHint: "Select an image file from your device or provide a direct image URL",
    adminArtworkAdded: "New artwork has been successfully added to your portfolio!",
    adminArtworkDeleted: "Artwork has been deleted.",
    adminInquiryStatusUpdated: "Client inquiry status updated.",
    adminInquiryDeleted: "Inquiry record deleted.",
    adminQuickDemoLogin: "Quick Demo Sign-In",
    adminSearchClients: "Search by client name or phone...",
    adminFilterStatus: "Filter by Status",
    adminStatusPending: "Pending",
    adminStatusInProgress: "In Progress",
    adminStatusCompleted: "Completed",
    adminStatusAll: "All Statuses",
    adminNoInquiries: "No client commission requests yet.",
    adminActionCall: "Call Client",
    adminEditArtwork: "Edit Artwork",
    adminArtworkUpdated: "Artwork updated successfully!",
    adminConfirmDelete: "Are you sure you want to delete this artwork?",
    adminSaveChanges: "Save Changes",
    adminCancel: "Cancel",
    adminDelete: "Delete",
    adminOverview: "Overview",
    adminSeeAll: "See all",
    adminAddNewCategory: "+ Add New Category",
    adminNewCategoryName: "New Category Name",
    adminNewCategoryPlaceholder: "e.g. Cafe, Salon, Office...",
    adminCategoryAdded: "New category added!",
    adminUploadFromComputer: "Choose Image from Computer",
    adminOrPasteUrl: "Or paste an image URL",
    adminDropImageHere: "Drop image here or click to browse",
    adminImageTooLarge: "Image is too large. Please use under 2 MB.",
    adminImageRequired: "Please upload an image or enter a URL.",
    adminTitleRequired: "Please enter an artwork title.",
    adminProfile: "Profile",
    adminEditProfile: "Edit Profile",
    adminProfileName: "Full Name",
    adminProfileRole: "Role / Title",
    adminProfileEmail: "Email",
    adminProfilePhone: "Phone",
    adminProfilePhoto: "Profile Photo",
    adminProfileUpdated: "Profile updated successfully!",
    // Compatibility
    works: "Works",
    about: "About",
    contact: "Contact",
  },
  am: {
    navHome: "መነሻ",
    navWorks: "ሥራዎች",
    navProcess: "የሥራ ሂደት",
    navAbout: "ስለ እኔ",
    navContact: "ያግኙኝ",
    heroBadge: "የኦሮሞ ባህል እና የጥበብ ሥራ",
    profession: "የቆዳ እና የሸራ ሥዕል ባለሙያ",
    heroTitlePrefix: "ባህላችንን እና ታሪካችንን",
    heroTitleAccent: "በቆዳ ላይ በእጅ መሳል",
    intro: "የሰዎችን ፊት፣ ባህላችንን እና ታሪካችንን በቆዳ እና በሸራ ላይ በእጄ እስላለሁ። ሥዕልዎ ለትውልድ የሚተላለፍ ዘላቂ የቤተሰብ እና የተቋም ትውስታ ይሆናል።",
    order: "ሥዕል ይዘዙ",
    browse: "ሥራዎችን ይመልከቱ",
    statsArtworks: "100+ ሥራዎች",
    statsHandcrafted: "100% በእጅ የተሰራ",
    statsYears: "8+ ዓመታት ልምድ",
    gallery: "የተመረጡ ሥራዎቼ",
    gallerySubtitle: "ለትምህርት ቤቶች፣ ለሆስፒታሎች፣ ለሆቴሎች እና ለግል ስብስቦች የተዘጋጁ ባህላዊ የቆዳ እና የሸራ ሥራዎች።",
    all: "ሁሉም",
    leather: "በቆዳ ላይ",
    canvas: "በሸራ ላይ",
    favorites: "ተወዳጆች",
    titles: [
      "የባህል ቆዳ ሥዕል - ዶ/ር አሊ ቢራ",
      "የባህል ቆዳ ሥዕል - ሃጫሉ ሁንዴሳ",
      "የአመራር እና ክብር የቆዳ ላይ ሥዕል",
      "ዘመናዊ የትምህርት ቤት ግድግዳ ሥዕል (Mural)",
      "የኢሬቻ በዓል እና የታላቁ ኦዳ ዛፍ ግድግዳ ሥዕል",
      "የኤሎራ ቡና አዳራሽ ግድግዳ ሥዕል",
      "ታላቁ ህዳሴ ግድብ እና የተፈጥሮ ውበት ግድግዳ ሥዕል",
      "ዘመናዊ የካፌ ጥበባዊ ግድግዳ ሥዕል",
      "የሸራ ላይ ሥዕል - ሃጫሉ ሁንዴሳ",
      "የኦሮሞ ወጣት ሴት እና የኢሊሊ አደይ አበባ",
      "የተከበሩ የአገር ሽማግሌ ገጽታ",
      "የግል ገጽታ ሥዕል በቀለም እና በብዕር",
      "የትምህርት ግድግዳ ሥዕል - የሰው ልጅ አመጣጥ",
      "የንግድ ድርጅት ግድግዳ ሥዕል - ኦሊ የወንዶች ሳሎን",
      "የዱር አራዊት እና የተፈጥሮ ውበት ሥዕል",
    ],
    descriptions: [
      "የተከበረው ድምጻዊ ዶክተር አሊ ቢራ ከጊታሩ ጋር በተወጠረ የተፈጥሮ ቆዳ እና በእንጨት ፍሬም ላይ በእጅ የተሳለ ውብ ሥዕል።",
      "በተወጠረ የተፈጥሮ ቆዳ እና በእንጨት ፍሬም ላይ በእጅ የተሳለ ታዋቂው የሃጫሉ ሁንዴሳ ሥዕል።",
      "ለከፍተኛ ተቋማት እና ቢሮዎች በተወጠረ የተፈጥሮ ቆዳ እና በእንጨት ፍሬም ላይ በእጅ የተሳለ የክብር ሥዕል።",
      "ለትምህርት ቤቶች እና ለተቋማት አነቃቂ የሆነ ዘመናዊ ደማቅ የቀለማት ቅንብር ያለው የህንጻ ግድግዳ ሥዕል።",
      "የኢሬቻ የምስጋና በዓልን በወንዝ ዳርቻ እና በታላቁ ኦዳ ዛፍ ስር ለሆቴሎች እና ለባህል አዳራሾች የተሳለ ድንቅ ግድግዳ ሥዕል።",
      "የቡና ባህላችንን እና ዘመናዊ የካፌ ድባብን የሚያስተሳስር ማራኪ የቡና አዳራሽ ግድግዳ ሥዕል።",
      "ሰላማዊ የውሃ፣ የተራራ እና የተፈጥሮ ውበትን ለሆስፒታሎች እና ለጤና ተቋማት ዘና የሚያደርግ ግድግዳ ሥዕል።",
      "የተፈጥሮ አበባዎችን፣ የቡና ፍሬዎችን እና ዘመናዊ ውበትን ለሆቴሎች እና መዝናኛዎች የሚያሳይ ግድግዳ ሥዕል።",
      "በሸራ ላይ በዘይት እና አክሪሊክ ቀለማት በወርቃማ ድምቀት በእጅ የተሳለ የሃጫሉ ሁንዴሳ ውብ ሥዕል።",
      "የኦሮሞን ባህላዊ የምስጋና ስነ-ስርዓት በወንዝ ዳርቻ የሚያሳይ ለትምህርት ቤቶች እና ለባህል ማዕከላት የተሳለ ሥዕል።",
      "ጥበብን፣ ሰላምን እና ፈውስን ለሆስፒታሎች እና ለቤተሰብ የሚያበረክት የተከበረ የአገር ሽማግሌ ሥዕል።",
      "በቀለም እርሳስ እና በልዩ ቀለም የተሳለ ግልጽ እና ውብ የሆነ የግል ገጽታ ሥዕል።",
      "ለትምህርት ቤቶች እና ለሳይንስ ክፍሎች የተዘጋጀ የሰው ልጅን አመጣጥ እና እድገት የሚያሳይ አጋዥ ሥዕል።",
      "ለኦሊ የወንዶች ሳሎን የተሳለ ሳቢ እና ዘመናዊ የፀጉር ስራ መሳሪያዎችን የሚያሳይ ማስታወቂያ ግድግዳ ሥዕል።",
      "አንበሳ፣ ዝሆን እና ነብርን በሰፊው የተፈጥሮ ሳቫና ውስጥ የሚያሳይ ለሆስፒታሎች እና ለመዝናኛ የተሳለ ውብ ሥዕል።",
    ],
    categories: {
      all: "ሁሉም ዘርፎች",
      personal: "የግል እና የቤተሰብ",
      hotel: "ሆቴል እና ሎጅ",
      school: "ትምህርት ቤት",
      hospital: "ሆስፒታል እና ጤና",
      other: "ባህላዊ እና ሌሎች",
    },
    categoryDescriptions: {
      all: "በሁሉም ዘርፍ የተሰሩ የቆዳ እና የሸራ ሥራዎችን ይመልከቱ።",
      personal: "የወላጆች፣ የቤተሰብ እና የፍቅር ስጦታዎች በቆዳ እና በሸራ ላይ።",
      hotel: "ለሆቴል ሎቢ፣ ለእንግዳ ማረፊያ እና ለመስተንግዶ የሚሆኑ ድንቅ ሥራዎች።",
      school: "ለትምህርት ቤቶች እና ለባህል ማዕከላት የሚሆኑ የታሪክ እና የትምህርት ሥራዎች።",
      hospital: "ለሆስፒታሎች ሰላም፣ ፈውስ እና የእናትነት ፍቅርን የሚያሳዩ ሥራዎች።",
      other: "ልዩ የኦሮሞ ባህል እና ሌሎች የጥበብ ሥራዎች።",
    },
    mediumDetails: {
      leather: "በእንጨት ፍሬም የተወጠረ ተፈጥሯዊ የከብት ቆዳ",
      canvas: "ጥራት ያለው ሸራ እና የዘይት ቀለም",
    },
    empty: "በተመረጠው መስፈርት የሚገኝ ሥዕል የለም።",
    emptyHint: "እባክዎ ሌላ ዘርፍ ወይም ዓይነት ይምረጡ፣ ወይም የተወደዱ ሥዕሎችን እዚህ ይመልከቱ።",
    save: "ወደ ተወዳጆች ጨምር",
    unsave: "ከተወዳጆች አስወግድ",
    view: "ሥዕሉን አስፋ",
    previous: "ቀዳሚው ሥዕል",
    next: "ቀጣዩ ሥዕል",
    close: "ዝጋ",
    language: "ቋንቋ",
    orderSimilar: "ተመሳሳይ ሥዕል እዘዝ",
    processTitle: "የሥራችን ሂደት",
    processSubtitle: "ከፎቶዎ ጀምሮ በቆዳ እና በሸራ ላይ እስከሚዘጋጅ ድረስ በሦስት ቀላል ደረጃዎች።",
    steps: [
      {
        num: "01",
        title: "ፎቶ ይምረጡ",
        desc: "ጥራት ያለው ፎቶ ይላኩልን፤ በቆዳ ወይስ በሸራ ላይ እንዲሆን እንደሚፈልጉ ይወስኑ።",
      },
      {
        num: "02",
        title: "የቆዳ እና የእንጨት ዝግጅት",
        desc: "የከብት ቆዳ ተዘጋጅቶ በባህላዊ እንጨት ይታሰራል፣ ወይም ጥራት ያለው ሸራ ይዘጋጃል።",
      },
      {
        num: "03",
        title: "በእጅ መሳል እና ማድረስ",
        desc: "በዘይት ቀለም በጥንቃቄ በእጅ ተስሎ ባሉበት ቦታ በጥንቃቄ ይደርስዎታል።",
      },
    ],
    aboutTitle: "ስለ ናጋ አቦማ",
    aboutSubtitle: "የቆዳ እና የሸራ ሥዕል ባለሙያ",
    bio: "እኔ ናጋ አቦማ፣ የሥዕል ባለሙያ ነኝ። የግል ሥዕሎችን፣ ለትምህርት ቤቶች፣ ለሆስፒታሎች፣ ለሆቴሎች እና የባህል ሥራዎችን በትዕዛዝ እሠራለሁ።",
    quote: "«በቆዳ ላይ የተሳለ ሥዕል በጊዜ ሂደት አይጠፋም፤ የቤተሰብ ፍቅርን እና ታሪክን ለትውልድ ያቆያል።»",
    artisanPledge: "ሁሉም ሥራ 100% በእጅ የተሰራ እና ለረጅም ዘመናት የሚቆይ ጥራት ያለው ነው።",
    contactTitle: "ያግኙኝ እና ይዘዙ",
    contactSubtitle: "ለቤትዎ፣ ለትምህርት ቤት፣ ለሆስፒታል ወይም ለሆቴል በቆዳ ወይም በሸራ ላይ ለማሰራት ዛሬውኑ ያግኙኝ።",
    phone: "ስልክ",
    email: "ኢሜይል",
    location: "አድራሻ",
    city: "አዲስ አበባ፣ ኢትዮጵያ",
    telegram: "ቴሌግራም",
    sample: "የመገናኛ መረጃዎች እና አንዳንድ ሥዕሎች ምሳሌዎች ናቸው፤ በትክክለኛ መረጃ ይተካሉ።",
    formName: "ሙሉ ስም / የተቋም ስም",
    formPhone: "የስልክ ቁጥር / ቴሌግራም",
    formMedium: "የሥራው ዓይነት",
    formMediumLeather: "በቆዳ ላይ (Leather Portrait)",
    formMediumCanvas: "በሸራ ላይ (Canvas Painting)",
    formMediumBoth: "ሁለቱም / ምክር እፈልጋለሁ",
    formCategory: "የሥራው ዘርፍ",
    formMessage: "የሥዕሉ መግለጫ / ተጨማሪ ማስታወሻ",
    formMessagePlaceholder: "ለምሳሌ፡ ለሆቴል ሎቢ ወይም ለትምህርት ቤት የሚሆን በቆዳ ላይ የተሰራ ሥዕል...",
    formSubmit: "ትዕዛዝ / ጥያቄ ላክ",
    formSending: "በመላክ ላይ...",
    formSuccess: "እናመሰግናለን! ጥያቄዎ በተሳካ ሁኔታ ደርሷል። በፍጥነት እናገኝዎታለን።",
    quickDirectCall: "አሁን ይደውሉ",
    verifiedArtist: "የተረጋገጠ የጥበብ ባለሙያ",
    filterByCategoryTitle: "በዘርፍ ይምረጡ",
    filterByMediumTitle: "በዓይነት ይምረጡ",
    viewAllWorks: "ሁሉንም ሥራዎች ይመልከቱ",
    // Admin Portal
    navAdmin: "አስተዳዳሪ",
    adminTitle: "የአስተዳዳሪ ዳሽቦርድ",
    adminSubtitle: "የናጋ አርት ስራዎችን ለማስተዳደር፣ አዳዲስ ስራዎችን ለመጨመር እና የደንበኞችን ትዕዛዝ ለመቆጣጠር።",
    adminLoginTitle: "የአስተዳዳሪ መግቢያ (Admin Login)",
    adminLoginSubtitle: "የስራ መቆጣጠሪያ ዳሽቦርድ ለመድረስ እባክዎ ይግቡ።",
    adminEmailOrUser: "ኢሜይል ወይም የተጠቃሚ ስም",
    adminPassword: "የይለፍ ቃል (Password)",
    adminLoginButton: "ግባ",
    adminLogout: "ውጣ",
    adminArtworksTab: "ሥራዎች እና ጋለሪ",
    adminInquiriesTab: "የደንበኞች ትዕዛዝ",
    adminAddArtwork: "አዲስ ሥራ ጨምር",
    adminNewArtworkTitle: "የሥዕሉ ርዕስ",
    adminNewArtworkMedium: "የተሰራበት ዓይነት",
    adminNewArtworkCategory: "የሥራው ዘርፍ",
    adminNewArtworkDimensions: "መጠን (ለምሳሌ፡ 60 × 80 ሳ.ሜ)",
    adminNewArtworkImage: "ሥዕል ጫን (Image File / URL)",
    adminNewArtworkDesc: "አጭር መግለጫ",
    adminUploadHint: "ከመሳሪያዎ ላይ ሥዕል ይምረጡ ወይም የሥዕሉን አድራሻ (URL) ያስገቡ",
    adminArtworkAdded: "አዲሱ ሥዕል በተሳካ ሁኔታ ተጨምሯል!",
    adminArtworkDeleted: "ሥዕሉ ተሰርዟል።",
    adminInquiryStatusUpdated: "የትዕዛዙ ሁኔታ ተቀይሯል።",
    adminInquiryDeleted: "የትዕዛዝ መረጃው ተሰርዟል።",
    adminQuickDemoLogin: "ቀላል መግቢያ (Demo Sign-In)",
    adminSearchClients: "በደንበኛ ስም ወይም በስልክ ይፈልጉ...",
    adminFilterStatus: "በትዕዛዝ ሁኔታ",
    adminStatusPending: "በመጠባበቅ ላይ",
    adminStatusInProgress: "በመሰራት ላይ",
    adminStatusCompleted: "የተጠናቀቀ",
    adminStatusAll: "ሁሉም",
    adminNoInquiries: "እስካሁን ምንም የደንበኛ ትዕዛዝ የለም።",
    adminActionCall: "ለደንበኛ ደውል",
    adminEditArtwork: "ሥራውን አርትዕ",
    adminArtworkUpdated: "ሥራው በተሳካ ሁኔታ ተስተካክሏል!",
    adminConfirmDelete: "ይህን ሥራ መሰረዝ ይፈልጋሉ?",
    adminSaveChanges: "ለውጦችን መዝግብ",
    adminCancel: "ተው",
    adminDelete: "ሰርዝ",
    adminOverview: "አጠቃላይ እይታ",
    adminSeeAll: "ሁሉንም ይመልከቱ",
    adminAddNewCategory: "+ አዲስ ዘርፍ ጨምር",
    adminNewCategoryName: "የአዲሱ ዘርፍ ስም",
    adminNewCategoryPlaceholder: "ለምሳሌ፡ Cafe, Salon, Office...",
    adminCategoryAdded: "አዲሱ ዘርፍ ተጨምሯል!",
    adminUploadFromComputer: "ከኮምፒውተር ሥዕል ይምረጡ",
    adminOrPasteUrl: "ወይም የሥዕል URL ያስገቡ",
    adminDropImageHere: "ሥዕሉን እዚህ ይጎትቱ ወይም ይጫኑ",
    adminImageTooLarge: "ሥዕሉ በጣም ትልቅ ነው። ከ 2 MB በታች ይጠቀሙ።",
    adminImageRequired: "ሥዕል ይጫኑ ወይም URL ያስገቡ።",
    adminTitleRequired: "የሥዕሉን ርዕስ ያስገቡ።",
    adminProfile: "መገለጫ",
    adminEditProfile: "መገለጫ አርትዕ",
    adminProfileName: "ሙሉ ስም",
    adminProfileRole: "ማዕረግ / ሙያ",
    adminProfileEmail: "ኢሜይል",
    adminProfilePhone: "ስልክ",
    adminProfilePhoto: "የመገለጫ ፎቶ",
    adminProfileUpdated: "መገለጫው በተሳካ ሁኔታ ተስተካክሏል!",
    // Compatibility
    works: "ሥራዎች",
    about: "ስለ እኔ",
    contact: "ያግኙኝ",
  },
};