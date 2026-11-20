/**
 * ManaModavalasa - Dynamic Document SEO & Indexing Infrastructure
 * Production Domain: https://manamodavalasa.vercel.app
 * 
 * Provides client-side dynamic management of:
 * - document.title
 * - document.documentElement.lang
 * - Canonical link (<link rel="canonical">)
 * - Multilingual alternates (<link rel="alternate" hreflang="...">)
 * - OpenGraph & Twitter Card metadata tags
 */

export const BASE_PRODUCTION_URL = 'https://manamodavalasa.vercel.app';

export const ROUTE_SEO_CATALOG = {
    '/': {
        title: {
            en: 'ManaModavalasa | Verified Rural Digital Village Portal',
            te: 'మన మోదవలస | అధికారిక గ్రామీణ డిజిటల్ పోర్టల్'
        },
        description: {
            en: 'ManaModavalasa is a verified digital village information portal engineered for Modavalasa Gram Panchayat (Denkada Mandal, Vizianagaram District). Access verified welfare schemes, 24x7 emergency contacts, PHC doctor timings, school directories, and civic facilities.',
            te: 'మోదవలస గ్రామ పంచాయతీ (డెంకాడ మండలం, విజయనగరం జిల్లా) అధికారిక సమాచార పోర్టల్. సంక్షేమ పథకాలు, అత్యవసర నంబర్లు, ప్రాథమిక ఆరోగ్య కేంద్రం సమయాలు, పాఠశాలల వివరాలు మరియు సచివాలయ సేవలు.'
        }
    },
    '/schemes': {
        title: {
            en: 'Welfare Schemes Registry | ManaModavalasa',
            te: 'ప్రభుత్వ సంక్షేమ పథకాలు | మన మోదవలస'
        },
        description: {
            en: 'Comprehensive directory of verified central and Andhra Pradesh state welfare schemes available for Modavalasa residents with complete eligibility criteria, required documents, and application steps.',
            te: 'మోదవలస గ్రామ ప్రజల కోసం కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ సంక్షేమ పథకాలు, అర్హత ప్రమాణాలు, అవసరమైన పత్రాలు మరియు దరఖాస్తు విధానం.'
        }
    },
    '/contacts': {
        title: {
            en: 'Emergency & Civic Contact Directory | ManaModavalasa',
            te: 'అత్యవసర & సచివాలయ ఫోన్ నంబర్లు | మన మోదవలస'
        },
        description: {
            en: 'Authoritative directory of verified emergency helplines, Grama Sachivalayam administrative functionaries, PHC medical officers, police, electricity, and water service contacts serving Modavalasa.',
            te: 'మోదవలస గ్రామ పంచాయతీ, సచివాలయ సిబ్బంది, ఆసుపత్రి, పోలీస్, విద్యుత్, తాగునీరు మరియు అత్యవసర సేవల అధికారిక ఫోన్ నంబర్ల డైరెక్టరీ.'
        }
    },
    '/announcements': {
        title: {
            en: 'Public Notices & Announcements | ManaModavalasa',
            te: 'గ్రామ పంచాయతీ ప్రకటనలు | మన మోదవలస'
        },
        description: {
            en: 'Official public notifications, Grama Sabha announcements, agricultural advisories, immunization schedules, and civic service alerts from Modavalasa Gram Panchayat.',
            te: 'మోదవలస గ్రామ పంచాయతీ అధికారిక ప్రకటనలు, గ్రామ సభ నోటీసులు, వ్యవసాయ సమాచారం మరియు ముఖ్యమైన పౌర హెచ్చరికలు.'
        }
    },
    '/healthcare': {
        title: {
            en: 'Healthcare Facilities & Doctor Timings | ManaModavalasa',
            te: 'వైద్య ఆరోగ్య సేవలు & వేళలు | మన మోదవలస'
        },
        description: {
            en: 'Verified healthcare facilities, Primary Health Center (PHC) outpatient timings, doctor duty rosters, 108/104 ambulance services, and village ASHA worker contacts.',
            te: 'మోదవలస పరిసర ప్రాంతాల ప్రాథమిక ఆరోగ్య కేంద్రం (PHC), డాక్టర్ల సమయాలు, 108/104 అంబులెన్స్ సేవలు మరియు ఆశా కార్యకర్తల సమాచారం.'
        }
    },
    '/education': {
        title: {
            en: 'Schools & Educational Directory | ManaModavalasa',
            te: 'పాఠశాలలు & విద్యా సదుపాయాలు | మన మోదవలస'
        },
        description: {
            en: 'Directory of primary and secondary schools, Anganwadi centers, scholarship schemes, admission guidelines, and educational infrastructure in and around Modavalasa.',
            te: 'మోదవలస గ్రామ ప్రాథమిక, ఉన్నత పాఠశాలలు, అంగన్‌వాడీ కేంద్రాలు, విద్యా పథకాలు మరియు విద్యా వనరుల సమగ్ర వివరాలు.'
        }
    },
    '/businesses': {
        title: {
            en: 'Local Businesses & Rural Enterprise Directory | ManaModavalasa',
            te: 'స్థానిక వ్యాపారాలు & సేవలు | మన మోదవలస'
        },
        description: {
            en: 'Verified community registry of local retail stores, agricultural input suppliers, skilled artisans, mechanics, and essential service providers operating in Modavalasa.',
            te: 'మోదవలస గ్రామ దుకాణాలు, ఎరువులు-విత్తనాల కేంద్రాలు, వృత్తి కళాకారులు, మెకానిక్‌లు మరియు స్థానిక సేవా కేంద్రాల డైరెక్టరీ.'
        }
    },
    '/village': {
        title: {
            en: 'Village Profile & Governance Infrastructure | ManaModavalasa',
            te: 'గ్రామ పరిపాలన & జనాభా వివరాలు | మన మోదవలస'
        },
        description: {
            en: 'Official demographic, administrative, and infrastructure profile of Modavalasa village (Census Village Code 583218, Postal PIN 531162, Denkada Mandal, Vizianagaram District).',
            te: 'మోదవలస గ్రామ జనాభా గణాంకాలు, పంచాయతీ పాలన, భౌగోళిక సరిహద్దులు మరియు మౌలిక వసతుల అధికారిక వివరాలు (సెన్సస్ కోడ్ 583218, పిన్ 531162).'
        }
    },
    '/about': {
        title: {
            en: 'About the Initiative & Open Civic Architecture | ManaModavalasa',
            te: 'పోర్టల్ గురించి & సాంకేతిక వివరాలు | మన మోదవలస'
        },
        description: {
            en: 'Background, objectives, open civic technology architecture, community survey methodology, and engineering provenance of the ManaModavalasa rural information platform.',
            te: 'మన మోదవలస డిజిటల్ వ్యవస్థ లక్ష్యాలు, రూపకల్పన నేపథ్యం, ప్రజా సర్వే పద్ధతులు మరియు ఓపెన్ సివిక్ సాంకేతిక వివరాలు.'
        }
    },
    '/feedback': {
        title: {
            en: 'Citizen Grievance & Public Feedback Portal | ManaModavalasa',
            te: 'సమస్యల నమోదు & సలహాలు | మన మోదవలస'
        },
        description: {
            en: 'Submit public infrastructure grievances, sanitation concerns, civic suggestions, or service queries directly to Modavalasa Gram Panchayat authorities with instant reference tracking.',
            te: 'గ్రామ సమస్యలు, పారిశుధ్యం, తాగునీటి సరఫరా మరియు పౌర సేవలపై మీ ఫిర్యాదులు లేదా సలహాలను గ్రామ పంచాయతీకి నమోదు చేసి ట్రాక్ చేయండి.'
        }
    },
    '/search': {
        title: {
            en: 'Universal Village Search | ManaModavalasa',
            te: 'సమగ్ర సమాచార శోధన | మన మోదవలస'
        },
        description: {
            en: 'Quickly search across verified government welfare schemes, emergency phone numbers, healthcare facilities, schools, and business listings in Modavalasa.',
            te: 'మోదవలస గ్రామ సంక్షేమ పథకాలు, అత్యవసర ఫోన్ నంబర్లు, ఆసుపత్రులు, పాఠశాలలు మరియు స్థానిక సేవల వివరాలను వేగంగా శోధించండి.'
        }
    },
    '/survey': {
        title: {
            en: 'Household Needs Assessment Survey | ManaModavalasa',
            te: 'గ్రామ ప్రజా అవసరాల సర్వే | మన మోదవలస'
        },
        description: {
            en: 'Participate in the confidential Modavalasa community assessment survey to identify household welfare coverage, civic infrastructure gaps, and village development priorities.',
            te: 'మోదవలస గ్రామ సంక్షేమ పథకాల విస్తరణ, తాగునీరు, పారిశుధ్యం మరియు మౌలిక వసతుల అవసరాల గుర్తింపు కోసం నిర్వహించే ప్రజా సర్వే.'
        }
    },
    '/dashboard': {
        title: {
            en: 'Civic Analytics & Impact Dashboard | ManaModavalasa',
            te: 'గ్రామ ప్రగతి & సర్వే ఫలితాలు | మన మోదవలస'
        },
        description: {
            en: 'Public transparency dashboard displaying verified household survey metrics, welfare scheme saturation indicators, and civic priorities for Modavalasa Gram Panchayat.',
            te: 'మోదవలస గ్రామ సర్వే ఫలితాలు, సంక్షేమ పథకాల స్థితి, జనాభా వివరాలు మరియు అభివృద్ధి ప్రాధాన్యతలను తెలిపే పారదర్శక డాష్‌బోర్డ్.'
        }
    }
};

/**
 * Normalizes any pathname into a clean canonical relative path.
 * Strips trailing slashes except for root '/'.
 */
export function normalizeCanonicalPath(pathname) {
    if (!pathname || pathname === '/') return '/';
    return pathname.replace(/\/+$/, '');
}

/**
 * Computes canonical, alternate hreflang, and x-default URLs for any route pathname.
 */
export function buildCanonicalUrls(pathname) {
    const cleanPath = normalizeCanonicalPath(pathname);
    const basePath = cleanPath === '/' ? '/' : cleanPath;
    
    return {
        canonical: `${BASE_PRODUCTION_URL}${basePath}`,
        en: `${BASE_PRODUCTION_URL}${basePath}?lang=en`,
        te: `${BASE_PRODUCTION_URL}${basePath}?lang=te`,
        xDefault: `${BASE_PRODUCTION_URL}${basePath}`
    };
}

/**
 * Resolves title and description for a given pathname and language.
 */
export function resolveRouteMetadata(pathname, lang = 'en') {
    const cleanPath = normalizeCanonicalPath(pathname);
    const activeLang = lang === 'te' ? 'te' : 'en';

    // Direct match
    if (ROUTE_SEO_CATALOG[cleanPath]) {
        return {
            title: ROUTE_SEO_CATALOG[cleanPath].title[activeLang],
            description: ROUTE_SEO_CATALOG[cleanPath].description[activeLang]
        };
    }

    // Prefix match for dynamic routes
    if (cleanPath.startsWith('/schemes/')) {
        return {
            title: activeLang === 'te' 
                ? 'పథకం వివరాలు | మన మోదవలస' 
                : 'Scheme Details | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/schemes'].description[activeLang]
        };
    }

    if (cleanPath.startsWith('/announcements/')) {
        return {
            title: activeLang === 'te' 
                ? 'ప్రకటన వివరాలు | మన మోదవలస' 
                : 'Announcement Details | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/announcements'].description[activeLang]
        };
    }

    if (cleanPath.startsWith('/contacts/')) {
        return {
            title: activeLang === 'te'
                ? 'అత్యవసర & సచివాలయ ఫోన్ నంబర్లు | మన మోదవలస'
                : 'Emergency & Civic Contact Directory | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/contacts'].description[activeLang]
        };
    }

    if (cleanPath.startsWith('/healthcare/')) {
        return {
            title: activeLang === 'te'
                ? 'వైద్య ఆరోగ్య సేవలు | మన మోదవలస'
                : 'Healthcare Facilities & Doctor Timings | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/healthcare'].description[activeLang]
        };
    }

    if (cleanPath.startsWith('/education/')) {
        return {
            title: activeLang === 'te'
                ? 'పాఠశాలలు & విద్యా సదుపాయాలు | మన మోదవలస'
                : 'Schools & Educational Directory | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/education'].description[activeLang]
        };
    }

    if (cleanPath.startsWith('/businesses/')) {
        return {
            title: activeLang === 'te'
                ? 'స్థానిక వ్యాపారాలు & సేవలు | మన మోదవలస'
                : 'Local Businesses Directory | ManaModavalasa',
            description: ROUTE_SEO_CATALOG['/businesses'].description[activeLang]
        };
    }

    // Fallback to home metadata
    return {
        title: ROUTE_SEO_CATALOG['/'].title[activeLang],
        description: ROUTE_SEO_CATALOG['/'].description[activeLang]
    };
}

/**
 * Updates DOM head elements dynamically to match current route, language, and content.
 * Safe for client-side execution in React lifecycle.
 */
export function updateDocumentSEO({
    pathname,
    lang = 'en',
    customTitle = null,
    customDescription = null,
    customImage = null
}) {
    if (typeof document === 'undefined') return;

    const activeLang = lang === 'te' ? 'te' : 'en';
    const metadata = resolveRouteMetadata(pathname, activeLang);
    const urls = buildCanonicalUrls(pathname);

    // 1. Resolve Document Title
    let finalTitle = metadata.title;
    if (customTitle) {
        const brand = activeLang === 'te' ? 'మన మోదవలస' : 'ManaModavalasa';
        finalTitle = customTitle.includes(brand) ? customTitle : `${customTitle} | ${brand}`;
    }
    document.title = finalTitle;

    // 2. Resolve HTML lang attribute
    document.documentElement.lang = activeLang;

    // 3. Resolve Meta Description
    const finalDescription = customDescription || metadata.description;
    setOrCreateMetaTag('name', 'description', finalDescription);

    // 4. Update Canonical Link
    setOrCreateLinkTag('canonical', urls.canonical, 'canonical-link');

    // 5. Update Multilingual Alternates
    setOrCreateLinkTag('alternate', urls.en, 'hreflang-en', 'en');
    setOrCreateLinkTag('alternate', urls.te, 'hreflang-te', 'te');
    setOrCreateLinkTag('alternate', urls.xDefault, 'hreflang-default', 'x-default');

    // 6. Update OpenGraph Tags
    setOrCreateMetaTag('property', 'og:title', finalTitle);
    setOrCreateMetaTag('property', 'og:description', finalDescription);
    setOrCreateMetaTag('property', 'og:url', urls.canonical);
    setOrCreateMetaTag('property', 'og:locale', activeLang === 'te' ? 'te_IN' : 'en_IN');
    if (customImage) {
        setOrCreateMetaTag('property', 'og:image', customImage);
    }

    // 7. Update Twitter Card Tags
    setOrCreateMetaTag('name', 'twitter:title', finalTitle);
    setOrCreateMetaTag('name', 'twitter:description', finalDescription);
    setOrCreateMetaTag('name', 'twitter:url', urls.canonical);
    if (customImage) {
        setOrCreateMetaTag('name', 'twitter:image', customImage);
    }
}

function setOrCreateLinkTag(rel, href, id, hreflang = null) {
    let el = id ? document.getElementById(id) : null;
    if (!el && hreflang) {
        el = document.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`);
    } else if (!el) {
        el = document.querySelector(`link[rel="${rel}"]`);
    }

    if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (id) el.id = id;
        document.head.appendChild(el);
    }

    el.href = href;
    if (hreflang) {
        el.hreflang = hreflang;
    }
}

function setOrCreateMetaTag(attributeName, attributeValue, content) {
    let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}
