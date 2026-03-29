import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudArrowUpIcon, BeakerIcon, CheckCircleIcon,
    XCircleIcon, ArrowPathIcon, ArrowLeftIcon,
    ExclamationTriangleIcon, ShieldCheckIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://bhoomi-backend-7hlj.onrender.com';

const UI_TEXT = {
    en: {
        title: "Crop Health Analysis",
        subtitle: "AI-powered disease detection for your crops",
        uploadTitle: "Upload Crop Leaf Photo",
        uploadDesc: "Take a clear, close-up photo of the leaf in natural daylight. Make sure the leaf fills most of the frame.",
        browse: "Browse / Take Photo",
        retake: "Retake",
        analyze: "Analyze Disease",
        analyzing: "Analyzing...",
        noResult: "No Analysis Yet",
        noResultDesc: "Upload a clear leaf photo and click Analyze to see disease detection results.",
        detectedIssue: "Detected Condition",
        confidence: "Confidence",
        actions: "Recommended Actions",
        disclaimer: "Advisory only. Consult KVK toll-free 1800-180-1551 for critical decisions.",
        guardrailTitle: "Safety Check",
        simulationNote: "⚠️ Running in simulation mode — no trained model loaded. Results are illustrative only.",
        tipTitle: "Photo Tips for Best Results",
        tip1: "Use natural daylight (not indoor light)",
        tip2: "Hold phone 15-20cm from the leaf",
        tip3: "Keep the camera steady — no blur",
        tip4: "Leaf should fill most of the photo",
        lowConfidence: "Low confidence warning",
        cropDetected: "Crop",
        conditionFound: "Condition",
        modelUsed: "Model",
        compliant: "No banned chemicals detected",
        banned: "Banned chemical detected — see warning below",
    },
    hi: {
        title: "फसल स्वास्थ्य विश्लेषण",
        subtitle: "आपकी फसलों के लिए AI-आधारित रोग पहचान",
        uploadTitle: "फसल की पत्ती की फोटो अपलोड करें",
        uploadDesc: "प्राकृतिक रोशनी में पत्ती की स्पष्ट, करीबी फोटो लें। सुनिश्चित करें कि पत्ती फोटो के अधिकांश हिस्से में हो।",
        browse: "फोटो चुनें / लें",
        retake: "दोबारा लें",
        analyze: "रोग की जाँच करें",
        analyzing: "जाँच हो रही है...",
        noResult: "अभी कोई विश्लेषण नहीं",
        noResultDesc: "स्पष्ट पत्ती की फोटो अपलोड करें और रोग पहचान परिणाम देखने के लिए जाँच करें पर क्लिक करें।",
        detectedIssue: "पहचानी गई स्थिति",
        confidence: "विश्वास स्कोर",
        actions: "सुझाई गई कार्रवाइयाँ",
        disclaimer: "केवल सलाहकारी। गंभीर निर्णयों के लिए KVK टोल-फ्री 1800-180-1551 से परामर्श करें।",
        guardrailTitle: "सुरक्षा जाँच",
        simulationNote: "⚠️ सिमुलेशन मोड में चल रहा है — कोई प्रशिक्षित मॉडल लोड नहीं। परिणाम केवल उदाहरण हैं।",
        tipTitle: "सर्वोत्तम परिणाम के लिए फोटो टिप्स",
        tip1: "प्राकृतिक दिन की रोशनी का उपयोग करें",
        tip2: "फोन को पत्ती से 15-20 सेमी दूर रखें",
        tip3: "कैमरा स्थिर रखें — धुंधला न हो",
        tip4: "पत्ती फोटो के अधिकांश भाग में होनी चाहिए",
        lowConfidence: "कम विश्वास स्कोर चेतावनी",
        cropDetected: "फसल",
        conditionFound: "स्थिति",
        modelUsed: "मॉडल",
        compliant: "कोई प्रतिबंधित रसायन नहीं पाया गया",
        banned: "प्रतिबंधित रसायन पाया गया — नीचे चेतावनी देखें",
    },
    te: {
        title: "పంట ఆరోగ్య విశ్లేషణ",
        subtitle: "మీ పంటలకు AI-ఆధారిత వ్యాధి నిర్ధారణ",
        uploadTitle: "పంట ఆకు ఫోటో అప్‌లోడ్ చేయండి",
        uploadDesc: "సహజ వెలుతురులో ఆకు యొక్క స్పష్టమైన, క్లోజ్-అప్ ఫోటో తీయండి. ఆకు ఫ్రేమ్‌లో ఎక్కువ భాగం ఉండాలి.",
        browse: "ఫోటో చూడండి / తీయండి",
        retake: "మళ్ళీ తీయండి",
        analyze: "వ్యాధి విశ్లేషించండి",
        analyzing: "విశ్లేషిస్తోంది...",
        noResult: "ఇంకా విశ్లేషణ లేదు",
        noResultDesc: "స్పష్టమైన ఆకు ఫోటో అప్‌లోడ్ చేసి వ్యాధి నిర్ధారణ ఫలితాలు చూడటానికి విశ్లేషించు నొక్కండి.",
        detectedIssue: "గుర్తించిన స్థితి",
        confidence: "నమ్మకం స్కోర్",
        actions: "సూచించిన చర్యలు",
        disclaimer: "సలహా మాత్రమే. క్లిష్టమైన నిర్ణయాలకు KVK టోల్-ఫ్రీ 1800-180-1551 సంప్రదించండి.",
        guardrailTitle: "భద్రత తనిఖీ",
        simulationNote: "⚠️ సిమ్యులేషన్ మోడ్‌లో నడుస్తోంది — శిక్షణ పొందిన మోడల్ లోడ్ కాలేదు. ఫలితాలు ఉదాహరణ మాత్రమే.",
        tipTitle: "ఉత్తమ ఫలితాల కోసం ఫోటో చిట్కాలు",
        tip1: "సహజ పగటి వెలుతురు ఉపయోగించండి",
        tip2: "ఫోన్‌ను ఆకుకు 15-20 సెం.మీ దూరంలో పట్టుకోండి",
        tip3: "కెమెరా స్థిరంగా ఉంచండి — మసకగా ఉండకూడదు",
        tip4: "ఆకు ఫోటోలో ఎక్కువ భాగం ఆక్రమించాలి",
        lowConfidence: "తక్కువ నమ్మకం స్కోర్ హెచ్చరిక",
        cropDetected: "పంట",
        conditionFound: "స్థితి",
        modelUsed: "మోడల్",
        compliant: "నిషేధిత రసాయనాలు కనుగొనబడలేదు",
        banned: "నిషేధిత రసాయనం కనుగొనబడింది — దిగువ హెచ్చరిక చూడండి",
    }
};

const ConfidenceBar = ({ value }) => {
    const pct = Math.round(value * 100);
    const color = pct >= 75 ? 'bg-green-500' : pct >= 55 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
            <span className={`text-sm font-bold ${pct >= 75 ? 'text-green-600' : pct >= 55 ? 'text-yellow-600' : 'text-red-600'}`}>
                {pct}%
            </span>
        </div>
    );
};

const CropHealth = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const tx = UI_TEXT[language] || UI_TEXT.en;

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError('');
        }
    };

    const detectDisease = async () => {
        if (!image) { setError('Please select an image first'); return; }
        setLoading(true); setError(''); setResult(null);

        const formData = new FormData();
        formData.append('image', image);
        formData.append('lang', language);

        try {
            const response = await fetch(`${BACKEND}/detect`, { method: 'POST', body: formData });
            const data = await response.json();

            if (data.error === 'low_quality' || data.error === 'low_confidence') {
                setError(data.message + (data.suggestion ? '\n' + data.suggestion : ''));
            } else if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError('Could not connect to analysis server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const resetAnalysis = () => {
        setImage(null); setPreview(null); setResult(null); setError('');
    };

    const isHealthy = result && result.disease && result.disease.toLowerCase().includes('healthy');
    const hasBanned = result?.guardrails?.has_banned;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <BeakerIcon className="w-8 h-8 text-green-500" />
                            {tx.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{tx.subtitle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Upload Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            {!preview ? (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CloudArrowUpIcon className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{tx.uploadTitle}</h3>
                                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">{tx.uploadDesc}</p>
                                    <label className="cursor-pointer inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95">
                                        {tx.browse}
                                        <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <img src={preview} alt="Preview" className="max-h-64 w-auto rounded-xl shadow-md mx-auto mb-5 object-contain" />
                                    <div className="flex gap-3 justify-center flex-wrap">
                                        <button onClick={resetAnalysis} className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            {tx.retake}
                                        </button>
                                        <button onClick={detectDisease} disabled={loading} className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
                                            {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <BeakerIcon className="w-5 h-5" />}
                                            {loading ? tx.analyzing : tx.analyze}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Tips */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                                <InformationCircleIcon className="w-5 h-5" />
                                {tx.tipTitle}
                            </h4>
                            <ul className="space-y-1">
                                {[tx.tip1, tx.tip2, tx.tip3, tx.tip4].map((tip, i) => (
                                    <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                        <span className="text-blue-400 font-bold flex-shrink-0">{i + 1}.</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-start gap-3">
                                    <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm whitespace-pre-line">{error}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Results Panel */}
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[600px]">

                                {/* Simulation Warning */}
                                {result.note === 'SIMULATION_MODE' && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mb-4">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300">{tx.simulationNote}</p>
                                    </div>
                                )}

                                {/* Disease Result */}
                                <div className={`rounded-xl p-5 mb-5 ${isHealthy ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {isHealthy
                                            ? <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                            : <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />}
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{tx.detectedIssue}</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{result.disease}</div>
                                    <div className="text-xs text-gray-500 mb-1">{tx.confidence}</div>
                                    <ConfidenceBar value={result.confidence} />
                                </div>

                                {/* Low Confidence Warning */}
                                {result.low_confidence_warning && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                                        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                        {result.low_confidence_warning}
                                    </div>
                                )}

                                {/* Guardrail Warnings */}
                                {result.guardrails?.warnings?.length > 0 && (
                                    <div className={`rounded-xl p-4 mb-4 ${hasBanned ? 'bg-red-50 dark:bg-red-900/20 border border-red-300' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {hasBanned
                                                ? <XCircleIcon className="w-5 h-5 text-red-500" />
                                                : <ShieldCheckIcon className="w-5 h-5 text-blue-500" />}
                                            <span className="text-sm font-bold">{tx.guardrailTitle}</span>
                                        </div>
                                        {result.guardrails.warnings.map((w, i) => (
                                            <p key={i} className={`text-xs ${hasBanned ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'} mb-1`}>{w}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Recommendations */}
                                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-3">{tx.actions}</h3>
                                <ul className="space-y-2 mb-5">
                                    {result.recommendations?.map((rec, idx) => (
                                        <motion.li key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-green-600">{idx + 1}</span>
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Explanation */}
                                {result.explanation && (
                                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 mb-4">
                                        <div className="text-xs text-gray-500 space-y-1">
                                            {result.explanation.crop_detected && (
                                                <div><span className="font-semibold">{tx.cropDetected}:</span> {result.explanation.crop_detected}</div>
                                            )}
                                            {result.explanation.condition && result.explanation.condition !== 'Unknown' && (
                                                <div><span className="font-semibold">{tx.conditionFound}:</span> {result.explanation.condition}</div>
                                            )}
                                            {result.explanation.model && (
                                                <div><span className="font-semibold">{tx.modelUsed}:</span> {result.explanation.model}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Disclaimer */}
                                <p className="text-xs text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 pt-4">{tx.disclaimer}</p>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-400">
                                <BeakerIcon className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-gray-400 mb-2">{tx.noResult}</h3>
                                <p className="text-sm max-w-xs">{tx.noResultDesc}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CropHealth;