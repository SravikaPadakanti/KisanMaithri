import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Default to English, but try to read from local storage
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('app-language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
        // Set document language attribute for accessibility
        document.documentElement.lang = language;
    }, [language]);

    // Voice Guide State
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Speech Logic
    const speak = (text) => {
        if (!isVoiceEnabled || !text) return;

        // Cancel existing speech
        window.speechSynthesis.cancel();

        // Ensure we try to get voices if list is empty
        let currentVoices = voices;
        if (currentVoices.length === 0) {
            currentVoices = window.speechSynthesis.getVoices();
            setVoices(currentVoices);
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Simple, robust language mapping
        let targetLang = 'en-US';
        if (language === 'hi') targetLang = 'hi-IN';
        if (language === 'te') targetLang = 'te-IN';

        utterance.lang = targetLang;

        // Try to find a matching voice
        const voice = currentVoices.find(v => v.lang === targetLang);
        if (voice) {
            utterance.voice = voice;
        }

        // Adjust rate
        utterance.rate = 0.9;

        // Speak
        window.speechSynthesis.speak(utterance);
    };

    const toggleVoice = () => setIsVoiceEnabled(prev => !prev);

    const translations = {
        en: {
            // Navbar
            home: "Home",
            digitalTwin: "Digital Twin",
            marketInsights: "Market Insights",
            waterOptimizer: "Water Optimizer",
            cropHealth: "Crop Health",
            settings: "Settings",

            // Market Page
            marketTitle: "Market Insights",
            marketDesc: "Real-time prices and demand forecasts from local mandis.",
            searchPlaceholder: "Search for a crop (e.g., Wheat, Cotton)...",
            noCropsFound: "No crops found matching",
            cost: "Cost",
            perAcre: "acre",
            perQuintal: "quintal",
            highDemand: "High Demand",
            lowDemand: "Low Demand",
            stable: "Stable",
            recommended: "Recommended",
            viewAnalysis: "View Analysis",

            // Home
            watch3D: "Watch My Field in 3D",
            readyToTransform: "Ready to Transform Your Farm?",
            joinFarmers: "Join thousands of smart farmers using AI to grow better crops with less resources.",
            tryDigitalTwin: "Try Digital Twin Free",

            // Hero
            aiTechnology: "AI-Powered Digital Twin Technology",
            simulateFarm: "Simulate Your Farm",
            beforeYouPlant: "Before You Plant",
            heroDesc: "AI-powered digital twin for smarter farming decisions. See results before you invest.",
            startSimulation: "Start Simulation",
            farmers: "Farmers",
            accuracy: "Accuracy",
            waterSaved: "Water Saved",
            profitBoost: "Profit Boost",

            // Feature Grid
            whyLoveBhoomi: "Why Farmers Love",
            simpleTools: "Simple tools that deliver real results for your farm",
            predictYield: "Predict Yield",
            predictYieldDesc: "AI forecasts your harvest with 95% accuracy based on soil, weather & inputs.",
            saveWater: "Save Water",
            saveWaterDesc: "Smart irrigation recommendations to reduce water usage by up to 40%.",
            preventLoss: "Prevent Crop Loss",
            preventLossDesc: "Early warning system for pests, diseases & weather risks.",
            improveProfit: "Improve Profit",
            improveProfitDesc: "Optimize inputs and timing to maximize your returns per acre.",
            sustainableFarming: "Sustainable Farming",
            sustainableFarmingDesc: "Eco-friendly practices that protect your land for future generations.",

            // Digital Twin Page
            digitalTwinSimulator: "Digital Twin Simulator",
            simulateYourFarm: "Simulate Your",
            farm: "Farm",
            simulateYourFarmSuffix: "",
            selectInputs: "Select your inputs using the icons below. See results before you plant!",
            pauseSimulation: "Pause Simulation",

            // Input Panel
            yourFarmInputs: "Your Farm Inputs",
            selectCrop: "Select Crop",
            farmArea: "Farm Area",
            unit: "Unit",
            acres: "Acres",
            hectares: "Hectares",
            yards: "Yards",
            soilType: "Soil Type",
            alluvial: "Alluvial",
            blackSoil: "Black Soil",
            redSoil: "Red Soil",
            sandy: "Sandy",
            clay: "Clay",
            loamy: "Loamy",
            weatherForecast: "Weather Forecast",
            sunny: "Sunny",
            cloudy: "Cloudy",
            rainy: "Rainy",
            cold: "Cold",
            waterAvailability: "Water Availability",
            fertilizerAmount: "Fertilizer Amount",
            runSimulation: "Run Simulation",

            // Results Panel
            simulating: "Simulating crop cycle...",
            noData: "No Simulation Data",
            configureInputs: "Configure inputs and start the simulation to see projections.",
            yieldProjections: "Yield Projections",
            totalYield: "Total Yield",
            basedOn: "Based on",
            riskAssessment: "Risk Assessment",
            pestRisk: "Pest Risk",
            weatherRisk: "Weather Risk",
            high: "High",
            moderate: "Moderate",
            downloadReport: "Download Full Report",

            // Modal
            analysis: "Analysis",
            expectedProfit: "Expected Profit",
            conditions: "Conditions",
            priceTrend: "Price Trend (Last 6 Months)",
            close: "Close",
            simulate: "Simulate This Crop",
            financials: "Financials",

            // Crops
            wheat: "Wheat",
            rice: "Rice",
            maize: "Maize",
            cotton: "Cotton",
            sugarcane: "Sugarcane",
            tomato: "Tomato",
            onion: "Onion",
            potato: "Potato",
            carrot: "Carrot",
            brinjal: "Brinjal",
            okra: "Okra",
            cabbage: "Cabbage",
            cauliflower: "Cauliflower",
            spinach: "Spinach",
            bitter_gourd: "Bitter Gourd",
            bottle_gourd: "Bottle Gourd",
            chilli: "Chilli",
            turmeric: "Turmeric",
            cumin: "Cumin",
            coriander: "Coriander",
            black_pepper: "Black Pepper",
            cardamom: "Cardamom",
            mustard: "Mustard",
            chickpea: "Chickpea",
            lentil: "Lentil",
            moong_dal: "Moong Dal"
        },
        hi: {
            // Navbar
            home: "होम",
            digitalTwin: "डिजिटल ट्विन",
            marketInsights: "बाज़ार अंतर्दृष्टि",
            waterOptimizer: "जल अनुकूलक",
            cropHealth: "फसल स्वास्थ्य",
            settings: "सेटिंग्स",

            // Market Page
            marketTitle: "बाज़ार अंतर्दृष्टि",
            marketDesc: "स्थानीय मंडियों से वास्तविक समय की कीमतें और मांग पूर्वानुमान।",
            searchPlaceholder: "फसल खोजें (जैसे, गेहूं, कपास)...",
            noCropsFound: "कोई फसल नहीं मिली",
            cost: "लागत",
            perAcre: "एकड़",
            perQuintal: "क्विंटल",
            highDemand: "उच्च मांग",
            lowDemand: "कम मांग",
            stable: "स्थिर",
            recommended: "सिफारिश की गई",
            viewAnalysis: "विश्लेषण देखें",

            // Home
            watch3D: "मेरा खेत 3D में देखें",
            readyToTransform: "क्या आप अपने खेत को बदलने के लिए तैयार हैं?",
            joinFarmers: "हजारों स्मार्ट किसानों से जुड़ें जो कम संसाधनों के साथ बेहतर फसल उगाने के लिए AI का उपयोग कर रहे हैं।",
            tryDigitalTwin: "मुफ्त में डिजिटल ट्विन आज़माएं",

            // Hero
            aiTechnology: "AI-संचालित डिजिटल ट्विन तकनीक",
            simulateFarm: "अपने खेत का अनुकरण करें",
            beforeYouPlant: "रोपण से पहले",
            heroDesc: "स्मार्ट खेती के निर्णयों के लिए AI-संचालित डिजिटल ट्विन। निवेश करने से पहले परिणाम देखें।",
            startSimulation: "सिमुलेशन शुरू करें",
            farmers: "किसान",
            accuracy: "सटीकता",
            waterSaved: "जल बचत",
            profitBoost: "लाभ में वृद्धि",

            // Feature Grid
            whyLoveBhoomi: "किसान भूमि एआई को क्यों पसंद करते हैं",
            simpleTools: "सरल उपकरण जो आपके खेत के लिए वास्तविक परिणाम देते हैं",
            predictYield: "उपज का पूर्वानुमान",
            predictYieldDesc: "AI मिट्टी, मौसम और इनपुट के आधार पर आपकी फसल का 95% सटीकता के साथ पूर्वानुमान लगाता है।",
            saveWater: "पानी बचाएं",
            saveWaterDesc: "पानी के उपयोग को 40% तक कम करने के लिए स्मार्ट सिंचाई सिफारिशें।",
            preventLoss: "फसल हानि रोकें",
            preventLossDesc: "कीटों, बीमारियों और मौसम के जोखिमों के लिए प्रारंभिक चेतावनी प्रणाली।",
            improveProfit: "लाभ सुधारें",
            improveProfitDesc: "प्रति एकड़ अपनी वापसी को अधिकतम करने के लिए इनपुट और समय का अनुकूलन करें।",
            sustainableFarming: "टिकाऊ खेती",
            sustainableFarmingDesc: "पर्यावरण के अनुकूल प्रथाएं जो आने वाली पीढ़ियों के लिए आपकी भूमि की रक्षा करती हैं।",

            // Digital Twin Page
            digitalTwinSimulator: "डिजिटल ट्विन सिम्युलेटर",
            simulateYourFarm: "अपने",
            farm: "खेत",
            simulateYourFarmSuffix: "का अनुकरण करें",
            selectInputs: "नीचे दिए गए आइकन का उपयोग करके अपने इनपुट चुनें। रोपण से पहले परिणाम देखें!",
            pauseSimulation: "सिमुलेशन रोकें",

            // Input Panel
            yourFarmInputs: "आपके खेत के इनपुट",
            selectCrop: "फसल चुनें",
            farmArea: "खेत का क्षेत्रफल",
            unit: "इकाई",
            acres: "एकड़",
            hectares: "हेक्टेयर",
            yards: "गज",
            soilType: "मिट्टी का प्रकार",
            alluvial: "जलोढ़",
            blackSoil: "काली मिट्टी",
            redSoil: "लाल मिट्टी",
            sandy: "रेतीली",
            clay: "चिकनी",
            loamy: "दुमट",
            weatherForecast: "मौसम पूर्वानुमान",
            sunny: "धूप",
            cloudy: "बादल",
            rainy: "बारिश",
            cold: "सर्दी",
            waterAvailability: "जल उपलब्धता",
            fertilizerAmount: "उर्वरक मात्रा",
            runSimulation: "सिमुलेशन चलाएं",

            // Results Panel
            simulating: "फसल चक्र का अनुकरण किया जा रहा है...",
            noData: "कोई सिमुलेशन डेटा नहीं",
            configureInputs: "अनुमान देखने के लिए इनपुट कॉन्फ़िगर करें और सिमुलेशन शुरू करें।",
            yieldProjections: "उपज अनुमान",
            totalYield: "कुल उपज",
            basedOn: "आधारित",
            riskAssessment: "जोखिम मूल्यांकन",
            pestRisk: "कीट जोखिम",
            weatherRisk: "मौसम जोखिम",
            high: "उच्च",
            moderate: "मध्यम",
            downloadReport: "पूरी रिपोर्ट डाउनलोड करें",

            // Modal
            analysis: "विश्लेषण",
            expectedProfit: "अपेक्षित लाभ",
            conditions: "परिस्थितियां",
            priceTrend: "मूल्य रुझान (पिछले 6 महीने)",
            close: "बंद करें",
            simulate: "इस फसल का अनुकरण करें",
            financials: "वित्तीय",

            // Crops
            wheat: "गेहूं",
            rice: "चावल",
            maize: "मक्का",
            cotton: "कपास",
            sugarcane: "गन्ना",
            tomato: "टमाटर",
            onion: "प्याज़",
            potato: "आलू",
            carrot: "गाजर",
            brinjal: "बैंगन",
            okra: "भिंडी",
            cabbage: "पत्ता गोभी",
            cauliflower: "फूलगोभी",
            spinach: "पालक",
            bitter_gourd: "करेला",
            bottle_gourd: "लौकी",
            chilli: "मिर्च",
            turmeric: "हल्दी",
            cumin: "जीरा",
            coriander: "धनिया",
            black_pepper: "काली मिर्च",
            cardamom: "इलायची",
            mustard: "सरसों",
            chickpea: "चना",
            lentil: "मसूर",
            moong_dal: "मूंग दाल"
        },
        te: {
            // Navbar
            home: "హోమ్",
            digitalTwin: "డిజిటల్ ట్విన్",
            marketInsights: "మార్కెట్ అంతర్దృష్టులు",
            waterOptimizer: "నీటి ఆప్టిమైజర్",
            cropHealth: "పంట ఆరోగ్యం",
            settings: "సెట్టింగులు",

            // Market Page
            marketTitle: "మార్కెట్ అంతర్దృష్టులు",
            marketDesc: "స్థానిక మార్కెట్ల నుండి నిజ-సమయ ధరలు మరియు డిమాండ్ అంచనాలు.",
            searchPlaceholder: "పంట కోసం వెతకండి (ఉదా: గోధుమలు, పత్తి)...",
            noCropsFound: "సరిపోలే పంటలు కనుగొనబడలేదు",
            cost: "ఖర్చు",
            perAcre: "ఎకరా",
            perQuintal: "క్వింటాల్",
            highDemand: "అధిక డిమాండ్",
            lowDemand: "తక్కువ డిమాండ్",
            stable: "స్థిరంగా",
            recommended: "సిఫార్సు చేయబడింది",
            viewAnalysis: "విశ్లేషణ చూడండి",

            // Home
            watch3D: "నా పొలాన్ని 3D లో చూడండి",
            readyToTransform: "మీ వ్యవసాయాన్ని మార్చడానికి సిద్ధంగా ఉన్నారా?",
            joinFarmers: "తక్కువ వనరులతో మంచి పంటలు పండించడానికి AI ని ఉపయోగిస్తున్న వేలాది మంది తెలివైన రైతులతో చేరండి.",
            tryDigitalTwin: "డిజిటల్ ట్విన్ ఉచితంగా ప్రయత్నించండి",

            // Hero
            aiTechnology: "AI-ఆధారిత డిజిటల్ ట్విన్ టెక్నాలజీ",
            simulateFarm: "మీ పొలాన్ని అనుకరించండి",
            beforeYouPlant: "మీరు నాటడానికి ముందే",
            heroDesc: "తెలివైన వ్యవసాయ నిర్ణయాల కోసం AI-ఆధారిత డిజిటల్ ట్విన్. మీరు పెట్టుబడి పెట్టడానికి ముందే ఫలితాలను చూడండి.",
            startSimulation: "సిమ్యులేషన్ ప్రారంభించండి",
            farmers: "రైతులు",
            accuracy: "ఖచ్చితత్వం",
            waterSaved: "నీటి ఆదా",
            profitBoost: "లాభాల పెంపు",

            // Feature Grid
            whyLoveBhoomi: "రైతులు భూమి AI ని ఎందుకు ఇష్టపడుతున్నారు",
            simpleTools: "మీ పొలానికి నిజమైన ఫలితాలను అందించే సాధారణ సాధనాలు",
            predictYield: "దిగుబడి అంచనా",
            predictYieldDesc: "నేల, వాతావరణం & ఇన్‌పుట్‌ల ఆధారంగా AI మీ పంటను 95% ఖచ్చితత్వంతో అంచనా వేస్తుంది.",
            saveWater: "నీటిని ఆదా చేయండి",
            saveWaterDesc: "నీటి వినియోగాన్ని 40% వరకు తగ్గించడానికి స్మార్ట్ సాగునీటి సిఫార్సులు.",
            preventLoss: "పంట నష్టాన్ని నివారించండి",
            preventLossDesc: "తెగుళ్లు, వ్యాధులు & వాతావరణ ప్రమాదాల కోసం ముందస్తు హెచ్చరిక వ్యవస్థ.",
            improveProfit: "లాభాన్ని మెరుగుపరచండి",
            improveProfitDesc: "ఎకరానికి మీ రాబడిని పెంచుకోవడానికి ఇన్‌పుట్‌లు మరియు సమయాన్ని ఆప్టిమైజ్ చేయండి.",
            sustainableFarming: "స్థిరమైన వ్యవసాయం",
            sustainableFarmingDesc: "భావితరాలకు మీ భూమిని రక్షించే పర్యావరణ అనుకూల పద్ధతులు.",

            // Digital Twin Page
            digitalTwinSimulator: "డిజిటల్ ట్విన్ సిమ్యులేటర్",
            simulateYourFarm: "మీ",
            farm: "పొలాన్ని",
            simulateYourFarmSuffix: "అనుకరించండి",
            selectInputs: "క్రింద ఉన్న చిహ్నాలను ఉపయోగించి మీ ఇన్‌పుట్‌లను ఎంచుకోండి. నాటడానికి ముందే ఫలితాలను చూడండి!",
            pauseSimulation: "సిమ్యులేషన్ పాజ్ చేయండి",

            // Input Panel
            yourFarmInputs: "మీ వ్యవసాయ ఇన్‌పుట్‌లు",
            selectCrop: "పంటను ఎంచుకోండి",
            farmArea: "పొలం విస్తీర్ణం",
            unit: "యూనిట్",
            acres: "ఎకరాలు",
            hectares: "హెక్టార్లు",
            yards: "గజాలు",
            soilType: "నేల రకం",
            alluvial: "ఒండ్రు",
            blackSoil: "నల్ల రేగడి",
            redSoil: "ఎర్ర నేల",
            sandy: "ఇసుక",
            clay: "బంకమట్టి",
            loamy: "లోమీ",
            weatherForecast: "వాతావరణ సూచన",
            sunny: "ఎండ",
            cloudy: "మేావ",
            rainy: "వర్షం",
            cold: "చలి",
            waterAvailability: "నీటి లభ్యత",
            fertilizerAmount: "ఎరువుల మొత్తం",
            runSimulation: "సిమ్యులేషన్ రన్ చేయండి",

            // Results Panel
            simulating: "పంట చక్రం అనుకరణ జరుగుతోంది...",
            noData: "సిమ్యులేషన్ డేటా లేదు",
            configureInputs: "అంచనాలను చూడడానికి ఇన్‌పుట్‌లను కాన్ఫిగర్ చేయండి మరియు సిమ్యులేషన్‌ను ప్రారంభించండి.",
            yieldProjections: "దిగుబడి అంచనాలు",
            totalYield: "మొత్తం దిగుబడి",
            basedOn: "దీని ఆధారంగా",
            riskAssessment: "ప్రమాద అంచనా",
            pestRisk: "తెగులు ప్రమాదం",
            weatherRisk: "వాతావరణ ప్రమాదం",
            high: "అధికం",
            moderate: "మితమైన",
            downloadReport: "పూర్తి నివేదిక డౌన్‌లోడ్",

            // Modal
            analysis: "విశ్లేషణ",
            expectedProfit: "ఆశించిన లాభం",
            conditions: "పరిస్థితులు",
            priceTrend: "ధర ధోరణి (గత 6 నెలలు)",
            close: "మూసివేయి",
            simulate: "ఈ పంటను అనుకరించండి",
            financials: "ఆర్థిక అంశాలు",

            // Crops
            wheat: "గోధుమలు",
            rice: "వరి",
            maize: "మొక్కజొన్న",
            cotton: "పత్తి",
            sugarcane: "చెరకు",
            tomato: "టమోటా",
            onion: "ఉల్లిపాయ",
            potato: "బంగాళాదుంప",
            carrot: "కారెట్",
            brinjal: "వంకాయ",
            okra: "బెండకాయ",
            cabbage: "క్యాబేజీ",
            cauliflower: "కాలీఫ్లవర్",
            spinach: "పాలకూర",
            bitter_gourd: "కాకరకాయ",
            bottle_gourd: "సొరకాయ",
            chilli: "మిరప",
            turmeric: "పసుపు",
            cumin: "జీలకర్ర",
            coriander: "ధనియాలు",
            black_pepper: "మిరియాలు",
            cardamom: "యాలకులు",
            mustard: "ఆవాలు",
            chickpea: "శనగలు",
            lentil: "కందిపప్పు",
            moong_dal: "పెసర పప్పు"
        }
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isVoiceEnabled, toggleVoice, speak }}>
            {children}
            {/* Global Click Listener for Voice Guide */}
            {isVoiceEnabled && (
                <VoiceListener speak={speak} />
            )}
        </LanguageContext.Provider>
    );
};

// Helper component to handle global clicks
const VoiceListener = ({ speak }) => {
    useEffect(() => {
        const handleClick = (e) => {
            // Get the clicked element
            const target = e.target;

            // Find the closest element that has data-voice or is a semantic text element
            const element = target.closest('[data-voice], p, h1, h2, h3, h4, h5, h6, button, a, label, span, div');

            if (element) {
                // 1. Prioritize data-voice attribute (Best for controlled output)
                let text = element.getAttribute('data-voice');

                // 2. Fallback to aria-label
                if (!text) {
                    text = element.getAttribute('aria-label');
                }

                // 3. Fallback to innerText, but clean specifically for common icon ranges and emojis
                if (!text && element.innerText) {
                    // Regex to strip: 
                    // - Emojis
                    // - Common symbols used as icons
                    text = element.innerText
                        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Symbols & Pictographs
                        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
                        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map Symbols
                        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc Symbols (Weather, etc)
                        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
                        .trim();
                }

                // Filter out empty or too long text (avoid reading whole page containers)
                if (text && text.length < 200 && text.length > 0) {
                    speak(text);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [speak]);

    return null;
};
