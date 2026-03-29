export const INTENTS = {
    SOW_SEEDS: 'SOW_SEEDS',
    WATER_FIELD: 'WATER_FIELD',
    ADD_FERTILIZER: 'ADD_FERTILIZER',
    HARVEST: 'HARVEST',
    PEST_CONTROL: 'PEST_CONTROL',
    SOIL_PREP: 'SOIL_PREP',
    UNKNOWN: 'UNKNOWN'
};

// Multilingual Dictionary
// Multilingual Dictionary
const KEYWORDS = {
    [INTENTS.SOW_SEEDS]: {
        en: ['sow', 'plant', 'seed', 'start', 'planting', 'grow', 'farming'],
        hi: ['बीज', 'बोना', 'बुवाई', 'लगाना', 'खेती', 'शुरू', 'beej', 'boya', 'buaai', 'lagaya', 'boye', 'bo'],
        te: ['విత్తనాలు', 'నాటడం', 'వేయండి', 'సాగు', 'మొదలు', 'vittanaalu', 'vesa', 'naatu', 'natandi', 'veyandi', 'vittanalu']
    },
    [INTENTS.WATER_FIELD]: {
        en: ['water', 'irrigate', 'sprinkle', 'wet', 'pour', 'hydration'],
        hi: ['पानी', 'सिंचाई', 'गीला', 'डालना', 'paani', 'sinchai', 'dalo', 'dalna', 'pani'],
        te: ['నీరు', 'తడి', 'నీళ్లు', 'పోయడం', 'neeru', 'thadi', 'poyandi', 'neellu', 'thadupu']
    },
    [INTENTS.ADD_FERTILIZER]: {
        en: ['fertilizer', 'manure', 'nutrient', 'compost', 'feed', 'urea', 'npk'],
        hi: ['खाद', 'उर्वरक', 'पोषक', 'khad', 'khaad', 'urvarak', 'dalo', 'daal'],
        te: ['ఎరువు', 'మందు', 'బలం', 'eruvu', 'mandu', 'balam', 'veyandi']
    },
    [INTENTS.HARVEST]: {
        en: ['harvest', 'collect', 'cut', 'yield', 'reap', 'gathering'],
        hi: ['कटाई', 'फसल', 'काटना', 'तोड़ना', 'katai', 'fasal', 'kaat', 'kato', 'todna'],
        te: ['కోత', 'పంట', 'తీయడం', 'kotha', 'panta', 'koyandi', 'koyyadam', 'theesu']
    },
    [INTENTS.PEST_CONTROL]: {
        en: ['pest', 'insect', 'spray', 'bug', 'worm', 'pesticide', 'protect', 'kill'],
        hi: ['कीटनाशक', 'दवा', 'स्प्रे', 'बचाव', 'कीट', 'keet', 'dawa', 'kitnashak', 'chidko', 'mar'],
        te: ['పురుగు', 'మందు', 'పిచికారీ', 'రక్షణ', 'purugu', 'mandu', 'kottandi', 'pichikari', 'champu']
    },
    [INTENTS.SOIL_PREP]: {
        en: ['till', 'plow', 'plough', 'prepare', 'dig', 'soil', 'earth'],
        hi: ['जुताई', 'खोदना', 'तैयार', 'मिट्टी', 'jutai', 'khod', 'taiyar', 'mitti'],
        te: ['దున్నడం', 'తవ్వడం', 'భూమి', 'మట్టి', 'dunnu', 'thovvu', 'matti', 'siddham']
    }
};

// Response Dictionary
const RESPONSES = {
    en: {
        [INTENTS.SOW_SEEDS]: "Sowing seeds. Growth started!",
        [INTENTS.WATER_FIELD]: "Irrigation enabled. Water level updated.",
        [INTENTS.ADD_FERTILIZER]: "Fertilizer applied. Soil health boosting.",
        [INTENTS.PEST_CONTROL]: "Pesticides sprayed. Crop is safe.",
        [INTENTS.HARVEST]: "Harvest complete! Profit added to account.",
        [INTENTS.SOIL_PREP]: "Soil tilled and ready for planting.",
        [INTENTS.UNKNOWN]: "Sorry, I didn't verify that command."
    },
    hi: {
        [INTENTS.SOW_SEEDS]: "बीज बो दिए गए हैं। विकास शुरू!",
        [INTENTS.WATER_FIELD]: "सिंचाई शुरू कर दी गई है।",
        [INTENTS.ADD_FERTILIZER]: "खाद डाल दी गई है। मिट्टी की सेहत सुधर रही है।",
        [INTENTS.PEST_CONTROL]: "कीटनाशक का छिड़काव किया गया। फसल सुरक्षित है।",
        [INTENTS.HARVEST]: "कटाई पूरी हुई! मुनाफा खाते में जोड़ दिया गया।",
        [INTENTS.SOIL_PREP]: "मिट्टी की जुताई हो गई है।",
        [INTENTS.UNKNOWN]: "क्षमा करें, मुझे समझ नहीं आया।"
    },
    te: {
        [INTENTS.SOW_SEEDS]: "విత్తనాలు నాటారు. పంట పెరుగుదల మొదలైంది!",
        [INTENTS.WATER_FIELD]: "నీరు పోయడం మొదలైంది.",
        [INTENTS.ADD_FERTILIZER]: "ఎరువు వేశారు. నేల బలం పెరుగుతోంది.",
        [INTENTS.PEST_CONTROL]: "పురుగు మందు పిచికారీ చేశారు. పంట సురక్షితం.",
        [INTENTS.HARVEST]: "పంట కోత పూర్తయింది! లాభం జమ చేయబడింది.",
        [INTENTS.SOIL_PREP]: "నేల దున్నడం పూర్తయింది.",
        [INTENTS.UNKNOWN]: "క్షమించండి, నాకు అర్థం కాలేదు."
    }
};

// Detect dominant language from text
const detectLanguage = (text) => {
    // Check for Devanagari range
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    // Check for Telugu range
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    // Default to English
    return 'en';
};

export const classifyIntent = (text) => {
    if (!text) return { intent: INTENTS.UNKNOWN, lang: 'en' };

    const lowerText = text.toLowerCase();
    const detectedLang = detectLanguage(text);

    // Search keywords across all languages, but prioritize detected one if possible
    // Actually, we can just search all since cross-contamination is low

    for (const [intent, langMap] of Object.entries(KEYWORDS)) {
        // Search in the detected language explicit list first
        const words = langMap[detectedLang] || [];
        if (words.some(word => lowerText.includes(word))) {
            return { intent, lang: detectedLang };
        }

        // Fallback: Check all other languages just in case user writes "pani" in English script
        for (const [langKey, langWords] of Object.entries(langMap)) {
            if (langWords.some(word => lowerText.includes(word))) {
                return { intent, lang: langKey === 'en' ? 'en' : langKey }; // Map romaji Hindi/Telugu back to their lang code if we want localized response? 
                // For now, if input is Roman script, we default response to English unless we build a complex Roman-to-Indic mapper.
                // Let's assume Roman script input gets English response for simplicity, 
                // UNLESS we explicitly detect it's a Hindi word like "paani".
            }
        }
    }

    return { intent: INTENTS.UNKNOWN, lang: detectedLang };
};

export const getActionFeedback = (intent, lang = 'en') => {
    // Return response in the requested language, fallback to English
    const intentResponses = RESPONSES[lang] || RESPONSES['en'];
    return intentResponses[intent] || intentResponses[INTENTS.UNKNOWN];
};
