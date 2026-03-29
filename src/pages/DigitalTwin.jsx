import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComputerDesktopIcon, CubeTransparentIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import InputPanel from '../components/simulation/InputPanel';
import ResultsPanel from '../components/simulation/ResultsPanel';
import FarmScene from '../components/3d/FarmScene';
import VoiceControl from '../components/voice/VoiceControl';
import Timeline from '../components/simulation/Timeline';
import { useFarmStore } from '../store/useFarmStore';
import { useLanguage } from '../context/LanguageContext';

import { useLocation } from 'react-router-dom';

const DigitalTwin = () => {
    const { farmConfig, updateConfig, simState, resetFarm, advanceDay, toggleSimulation } = useFarmStore();
    const { t } = useLanguage();
    const location = useLocation();
    const [show3D, setShow3D] = useState(location.state?.open3d || false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    // Initial Sync local state with global store
    const [localInputs, setLocalInputs] = useState(farmConfig);

    // Continuous Simulation Loop
    React.useEffect(() => {
        let interval;
        if (show3D && simState.isPlaying) {
            interval = setInterval(() => {
                advanceDay();
            }, 3000); // 3 seconds = 1 day
        }
        return () => clearInterval(interval);
    }, [show3D, simState.isPlaying, advanceDay]);

    const runSimulation = () => {
        setLoading(true);
        setResults(null);
        resetFarm(); // Reset simulation state

        // Sync store
        Object.keys(localInputs).forEach(key => updateConfig(key, localInputs[key]));

        setTimeout(() => {
            const baseYield = Math.floor(Math.random() * (95 - 60) + 60);

            setResults({
                revenue: Math.floor(baseYield * 500 + Math.random() * 5000),
                yield: baseYield,
                area: localInputs.area || 10,
                unit: localInputs.unit || 'acres',
                risks: {
                    pest: Math.floor(Math.random() * 40),
                    weather: Math.floor(Math.random() * 30)
                },
                tips: [
                    { icon: '💧', text: 'Consider drip irrigation to save 30% more water' },
                    { icon: '🗓️', text: 'Best planting window: Next 2 weeks' },
                    { icon: '🌿', text: 'Add organic mulch to improve soil moisture' },
                ]
            });
            setLoading(false);
        }, 2500);
    };

    return (
        <div className="h-[calc(100vh-6rem)] pb-4 md:pb-0 relative">
            <AnimatePresence mode="wait">
                {!show3D ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="text-center mb-6 hidden md:block">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-bold shadow-sm">
                                <ComputerDesktopIcon className="w-5 h-5" /> {t('digitalTwinSimulator')}
                            </div>
                            <h1 className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{t('simulateYourFarm')} <span className="text-green-600">{t('farm')}</span> {t('simulateYourFarmSuffix')}</h1>
                            <p className="text-gray-500 text-sm">{t('selectInputs')}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100%-6rem)]">
                            <div className="w-full lg:w-5/12 h-full">
                                <InputPanel inputs={localInputs} setInputs={setLocalInputs} onRun={runSimulation} />
                            </div>
                            <div className="w-full lg:w-7/12 h-full relative">
                                <ResultsPanel results={results} loading={loading} />
                                {/* trigger for 3D */}
                                {results && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-6 right-6"
                                    >
                                        <button
                                            onClick={() => setShow3D(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 animate-bounce cursor-pointer z-10 hover:scale-105 transition-transform"
                                        >
                                            <CubeTransparentIcon className="w-6 h-6" /> {t('watch3D')}
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="3d-scene"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-20 w-full h-full"
                    >
                        <FarmScene />
                        <VoiceControl />
                        <Timeline />

                        <button
                            onClick={() => setShow3D(false)}
                            className="absolute top-4 left-4 md:left-[280px] z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-all"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>

                        {/* Simulation Controls */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 pointer-events-auto">
                            <button
                                onClick={toggleSimulation}
                                className={`px-8 py-3 rounded-full font-bold border-2 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur text-white ${!!simState.isPlaying ? 'bg-red-500/40 border-red-400' : 'bg-green-500/40 border-green-400'}`}
                            >
                                <span className="text-2xl drop-shadow">{!!simState.isPlaying ? '⏸' : '▶'}</span>
                                <span className="drop-shadow">{!!simState.isPlaying ? t('pauseSimulation') : t('startSimulation')}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DigitalTwin;
