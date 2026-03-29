import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DocumentArrowUpIcon, BeakerIcon, ArrowLeftIcon,
    ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon,
    InformationCircleIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://bhoomi-backend-7hlj.onrender.com';

const UI_TEXT = {
    en: {
        title: "Soil Report Reader",
        subtitle: "Upload your soil test report — AI reads and explains it for you",
        uploadTitle: "Upload Soil Test Report",
        uploadDesc: "Upload a photo of your soil report card or PDF from KVK / Agriculture Department",
        browse: "Upload Report (Photo or PDF)",
        analyze: "Read My Report",
        analyzing: "Reading report...",
        manualTitle: "Or Enter Values Manually",
        manualDesc: "Can't upload? Enter your soil report values below",
        manualAnalyze: "Analyze My Soil",
        ph: "pH",
        nitrogen: "Nitrogen (N) kg/ha",
        phosphorus: "Phosphorus (P) kg/ha",
        potassium: "Potassium (K) kg/ha",
        moisture: "Moisture %",
        healthScore: "Soil Health Score",
        suitable: "Suitable Crops",
        recommendations: "What To Do",
        alerts: "Warnings",
        fertilizer: "Fertilizer Schedule",
        basal: "Before Planting",
        top1: "21 Days After Planting",
        top2: "45-50 Days After Planting",
        extracted: "Values Found in Your Report",
        noResult: "No Analysis Yet",
        noResultDesc: "Upload your soil report or enter values manually to see personalized recommendations.",
        disclaimer: "Advisory only. Get your soil tested free at nearest KVK (toll-free 1800-180-1551).",
        tips: "Tips for uploading report",
        tip1: "Ensure text in the report is clearly visible",
        tip2: "Take photo in good lighting",
        tip3: "Make sure the entire report is in frame",
        tip4: "PDF files from KVK or Agriculture Dept work best",
    },
    hi: {
        title: "मृदा रिपोर्ट पाठक",
        subtitle: "अपनी मिट्टी परीक्षण रिपोर्ट अपलोड करें — AI आपके लिए पढ़ेगा और समझाएगा",
        uploadTitle: "मिट्टी परीक्षण रिपोर्ट अपलोड करें",
        uploadDesc: "KVK / कृषि विभाग से अपनी मिट्टी रिपोर्ट कार्ड की फोटो या PDF अपलोड करें",
        browse: "रिपोर्ट अपलोड करें (फोटो या PDF)",
        analyze: "मेरी रिपोर्ट पढ़ें",
        analyzing: "रिपोर्ट पढ़ी जा रही है...",
        manualTitle: "या मैन्युअल रूप से मान दर्ज करें",
        manualDesc: "अपलोड नहीं कर सकते? नीचे अपनी मिट्टी रिपोर्ट के मान दर्ज करें",
        manualAnalyze: "मेरी मिट्टी का विश्लेषण करें",
        ph: "pH",
        nitrogen: "नाइट्रोजन (N) kg/ha",
        phosphorus: "फॉस्फोरस (P) kg/ha",
        potassium: "पोटेशियम (K) kg/ha",
        moisture: "नमी %",
        healthScore: "मिट्टी स्वास्थ्य स्कोर",
        suitable: "उपयुक्त फसलें",
        recommendations: "क्या करना है",
        alerts: "चेतावनियाँ",
        fertilizer: "उर्वरक कार्यक्रम",
        basal: "रोपण से पहले",
        top1: "रोपण के 21 दिन बाद",
        top2: "रोपण के 45-50 दिन बाद",
        extracted: "आपकी रिपोर्ट में मिले मान",
        noResult: "अभी कोई विश्लेषण नहीं",
        noResultDesc: "व्यक्तिगत सिफारिशें देखने के लिए अपनी मिट्टी रिपोर्ट अपलोड करें या मैन्युअल रूप से मान दर्ज करें।",
        disclaimer: "केवल सलाहकारी। निकटतम KVK (टोल-फ्री 1800-180-1551) पर निःशुल्क मिट्टी परीक्षण करवाएं।",
        tips: "रिपोर्ट अपलोड करने के सुझाव",
        tip1: "रिपोर्ट में टेक्स्ट स्पष्ट दिखाई दे",
        tip2: "अच्छी रोशनी में फोटो लें",
        tip3: "पूरी रिपोर्ट फ्रेम में हो",
        tip4: "KVK या कृषि विभाग की PDF सबसे अच्छी तरह काम करती है",
    },
    te: {
        title: "నేల నివేదిక పాఠకుడు",
        subtitle: "మీ నేల పరీక్ష నివేదికను అప్‌లోడ్ చేయండి — AI మీ కోసం చదివి వివరిస్తుంది",
        uploadTitle: "నేల పరీక్ష నివేదికను అప్‌లోడ్ చేయండి",
        uploadDesc: "KVK / వ్యవసాయ శాఖ నుండి మీ నేల నివేదిక కార్డు ఫోటో లేదా PDF అప్‌లోడ్ చేయండి",
        browse: "నివేదికను అప్‌లోడ్ చేయండి (ఫోటో లేదా PDF)",
        analyze: "నా నివేదికను చదవండి",
        analyzing: "నివేదికను చదువుతోంది...",
        manualTitle: "లేదా మానవీయంగా విలువలు నమోదు చేయండి",
        manualDesc: "అప్‌లోడ్ చేయలేరా? మీ నేల నివేదిక విలువలను దిగువన నమోదు చేయండి",
        manualAnalyze: "నా నేలను విశ్లేషించండి",
        ph: "pH",
        nitrogen: "నత్రజని (N) kg/ha",
        phosphorus: "భాస్వరం (P) kg/ha",
        potassium: "పొటాషియం (K) kg/ha",
        moisture: "తేమ %",
        healthScore: "నేల ఆరోగ్య స్కోర్",
        suitable: "అనుకూలమైన పంటలు",
        recommendations: "ఏమి చేయాలి",
        alerts: "హెచ్చరికలు",
        fertilizer: "ఎరువుల షెడ్యూల్",
        basal: "నాటడానికి ముందు",
        top1: "నాటిన 21 రోజుల తర్వాత",
        top2: "నాటిన 45-50 రోజుల తర్వాత",
        extracted: "మీ నివేదికలో కనుగొన్న విలువలు",
        noResult: "ఇంకా విశ్లేషణ లేదు",
        noResultDesc: "వ్యక్తిగత సిఫార్సులు చూడడానికి మీ నేల నివేదికను అప్‌లోడ్ చేయండి లేదా మానవీయంగా విలువలు నమోదు చేయండి.",
        disclaimer: "సలహా మాత్రమే. సమీప KVK (టోల్-ఫ్రీ 1800-180-1551)లో ఉచిత నేల పరీక్ష చేయించుకోండి.",
        tips: "నివేదిక అప్‌లోడ్ చేయడానికి చిట్కాలు",
        tip1: "నివేదికలో టెక్స్ట్ స్పష్టంగా కనిపించాలి",
        tip2: "మంచి వెలుతురులో ఫోటో తీయండి",
        tip3: "మొత్తం నివేదిక ఫ్రేమ్‌లో ఉండాలి",
        tip4: "KVK లేదా వ్యవసాయ శాఖ PDF అత్యుత్తమంగా పనిచేస్తుంది",
    }
};

const ScoreRing = ({ score }) => {
    const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
    const r = 36; const circ = 2 * Math.PI * r;
    const pct = (score / 100) * circ;
    return (
        <div className="flex items-center gap-4">
            <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <motion.circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={`${circ}`} strokeDashoffset={circ}
                    animate={{ strokeDashoffset: circ - pct }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round" transform="rotate(-90 45 45)" />
                <text x="45" y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill={color}>{score}</text>
            </svg>
            <div>
                <div className="text-sm font-semibold text-gray-500">Score</div>
                <div className="text-lg font-bold" style={{ color }}>
                    {score >= 70 ? '🟢 Good' : score >= 40 ? '🟡 Moderate' : '🔴 Poor'}
                </div>
            </div>
        </div>
    );
};

const SoilReportUpload = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const tx = UI_TEXT[language] || UI_TEXT.en;

    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('upload'); // 'upload' or 'manual'
    const [manual, setManual] = useState({ N: 80, P: 40, K: 40, pH: 6.5, moisture: 60 });
    const [manualResult, setManualResult] = useState(null);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (f) { setFile(f); setResult(null); setError(''); }
    };

    const analyzeReport = async () => {
        if (!file) { setError('Please select a file first'); return; }
        setLoading(true); setError(''); setResult(null);
        const fd = new FormData();
        fd.append('report', file);
        fd.append('lang', language);
        try {
            const r = await fetch(`${BACKEND}/parse-soil-report`, { method: 'POST', body: fd });
            const d = await r.json();
            if (!d.success) {
                setError(d.message || 'Could not read report. Try entering values manually.');
            } else {
                setResult(d);
            }
        } catch {
            setError('Cannot connect to server. Try entering values manually below.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeManual = async () => {
        setLoading(true); setError(''); setManualResult(null);
        try {
            const r = await fetch(`${BACKEND}/soil-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...manual, lang: language })
            });
            setManualResult(await r.json());
        } catch {
            setError('Cannot connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const ResultCard = ({ data, extractedVals }) => (
        <div className="space-y-4">
            {extractedVals && Object.keys(extractedVals).length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200">
                    <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" /> {tx.extracted}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(extractedVals).map(([k, v]) => (
                            <div key={k} className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
                                <div className="text-xs text-gray-500">{k}</div>
                                <div className="text-sm font-bold text-green-700 dark:text-green-400">{v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.soil_health_score !== undefined && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">{tx.healthScore}</h4>
                    <ScoreRing score={data.soil_health_score} />
                </div>
            )}

            {data.alerts?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4" /> {tx.alerts}
                    </h4>
                    {data.alerts.map((a, i) => (
                        <div key={i} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm p-3 rounded-xl border border-red-200">{a}</div>
                    ))}
                </div>
            )}

            {data.recommendations?.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <ChartBarIcon className="w-4 h-4 text-green-500" /> {tx.recommendations}
                    </h4>
                    <ul className="space-y-2">
                        {data.recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                                {typeof r === 'object' ? r.action : r}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {data.suitable_crops?.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2">{tx.suitable}</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.suitable_crops.map((c, i) => (
                            <span key={i} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">{c}</span>
                        ))}
                    </div>
                </div>
            )}

            {data.fertilizer_schedule && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">{tx.fertilizer}</h4>
                    <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                        <div><span className="font-semibold">{tx.basal}:</span> {data.fertilizer_schedule.basal}</div>
                        <div><span className="font-semibold">{tx.top1}:</span> {data.fertilizer_schedule.top_dress_1}</div>
                        <div><span className="font-semibold">{tx.top2}:</span> {data.fertilizer_schedule.top_dress_2}</div>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">{tx.disclaimer}</p>
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <DocumentArrowUpIcon className="w-7 h-7 text-amber-500" />
                            {tx.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{tx.subtitle}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    <button onClick={() => setTab('upload')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'upload' ? 'bg-amber-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        📄 {tx.uploadTitle}
                    </button>
                    <button onClick={() => setTab('manual')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'manual' ? 'bg-amber-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        ✏️ {tx.manualTitle}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left panel */}
                    <div className="flex flex-col gap-4">
                        {tab === 'upload' ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DocumentArrowUpIcon className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-5">{tx.uploadDesc}</p>
                                    <label className="cursor-pointer inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95">
                                        {tx.browse}
                                        <input type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
                                    </label>
                                    {file && (
                                        <div className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                                            ✅ {file.name}
                                        </div>
                                    )}
                                    {file && (
                                        <button onClick={analyzeReport} disabled={loading} className="mt-4 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                                            {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <BeakerIcon className="w-5 h-5" />}
                                            {loading ? tx.analyzing : tx.analyze}
                                        </button>
                                    )}
                                </div>
                                {/* Tips */}
                                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100">
                                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1">
                                        <InformationCircleIcon className="w-4 h-4" /> {tx.tips}
                                    </h4>
                                    <ul className="space-y-1">
                                        {[tx.tip1, tx.tip2, tx.tip3, tx.tip4].map((t, i) => (
                                            <li key={i} className="text-xs text-amber-700 dark:text-amber-300">{i + 1}. {t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-500 mb-5">{tx.manualDesc}</p>
                                <div className="space-y-4">
                                    {[
                                        { key: 'pH', label: tx.ph, min: 3, max: 10, step: 0.1 },
                                        { key: 'N', label: tx.nitrogen, min: 0, max: 200, step: 1 },
                                        { key: 'P', label: tx.phosphorus, min: 0, max: 100, step: 1 },
                                        { key: 'K', label: tx.potassium, min: 0, max: 200, step: 1 },
                                        { key: 'moisture', label: tx.moisture, min: 0, max: 100, step: 1 },
                                    ].map(({ key, label, min, max, step }) => (
                                        <div key={key}>
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex justify-between mb-1">
                                                <span>{label}</span>
                                                <span className="text-amber-600 font-bold">{manual[key]}</span>
                                            </label>
                                            <input type="range" min={min} max={max} step={step} value={manual[key]}
                                                onChange={e => setManual(m => ({ ...m, [key]: parseFloat(e.target.value) }))}
                                                className="w-full accent-amber-500" />
                                        </div>
                                    ))}
                                    <button onClick={analyzeManual} disabled={loading} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                                        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <BeakerIcon className="w-5 h-5" />}
                                        {loading ? tx.analyzing : tx.manualAnalyze}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-start gap-3 text-sm">
                                <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div>
                        <AnimatePresence mode="wait">
                            {(result || manualResult) ? (
                                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[650px]">
                                    <ResultCard
                                        data={result || manualResult}
                                        extractedVals={result?.extracted_values}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-400">
                                    <DocumentArrowUpIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <h3 className="text-lg font-bold text-gray-400 mb-2">{tx.noResult}</h3>
                                    <p className="text-sm max-w-xs">{tx.noResultDesc}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoilReportUpload;