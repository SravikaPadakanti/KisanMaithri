import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Sprout } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const InputPanel = ({ inputs, setInputs, onRun }) => {
    const { t } = useLanguage();

    const crops = [
        { id: 'wheat', name: t('wheat'), icon: '🌾' },
        { id: 'rice', name: t('rice'), icon: '🍚' },
        { id: 'maize', name: t('maize'), icon: '🌽' },
        { id: 'cotton', name: t('cotton'), icon: '☁️' },
        { id: 'chilli', name: t('chilli'), icon: '🌶️' },
        { id: 'tomato', name: t('tomato'), icon: '🍅' },
        { id: 'onion', name: t('onion'), icon: '🧅' },
        { id: 'carrot', name: t('carrot'), icon: '🥕' },
    ];

    const soils = [
        { id: 'alluvial', name: t('alluvial'), icon: '🏖️' },
        { id: 'black', name: t('blackSoil'), icon: '🖤' },
        { id: 'red', name: t('redSoil'), icon: '❤️' },
        { id: 'sandy', name: t('sandy'), icon: '🏜️' },
        { id: 'clay', name: t('clay'), icon: '🧱' },
        { id: 'loamy', name: t('loamy'), icon: '🌿' },
    ];

    const weathers = [
        { id: 'sunny', name: t('sunny'), icon: '☀️' },
        { id: 'cloudy', name: t('cloudy'), icon: '⛅' },
        { id: 'rainy', name: t('rainy'), icon: '🌧️' },
        { id: 'cold', name: t('cold'), icon: '❄️' },
    ];

    const handleChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 dark:border-white/10 h-full flex flex-col gap-8 overflow-y-auto">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🧑‍🌾</span>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Farm Inputs</h2>
            </div>

            {/* Crop Selection */}
            <div>
                <label
                    className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2"
                    data-voice={t('selectCrop')}
                >
                    <Sprout className="w-4 h-4" /> {t('selectCrop')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {crops.map((crop) => (
                        <button
                            key={crop.id}
                            onClick={() => handleChange('crop', crop.id)}
                            data-voice={crop.name}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${inputs.crop === crop.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-3xl">{crop.icon}</span>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{crop.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Farm Area */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                        📏 {t('farmArea')}
                    </label>
                    <input
                        type="number"
                        value={inputs.area}
                        onChange={(e) => handleChange('area', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-2xl border-transparent bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div className="w-1/3">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                        {t('unit')}
                    </label>
                    <select
                        value={inputs.unit}
                        onChange={(e) => handleChange('unit', e.target.value)}
                        className="w-full p-3 rounded-2xl border-transparent bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="acres">{t('acres')}</option>
                        <option value="hectares">{t('hectares')}</option>
                        <option value="yards">{t('yards')}</option>
                    </select>
                </div>
            </div>

            {/* Soil Type */}
            <div>
                <label
                    className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2"
                    data-voice={t('soilType')}
                >
                    ⛰️ {t('soilType')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {soils.map((soil) => (
                        <button
                            key={soil.id}
                            onClick={() => handleChange('soil', soil.id)}
                            data-voice={soil.name}
                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${inputs.soil === soil.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-2xl">{soil.icon}</span>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{soil.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Weather */}
            <div>
                <label
                    className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2"
                    data-voice={t('weatherForecast')}
                >
                    🌤️ {t('weatherForecast')}
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {weathers.map((weather) => (
                        <button
                            key={weather.id}
                            onClick={() => handleChange('weather', weather.id)}
                            data-voice={weather.name}
                            className={`min-w-[80px] p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${inputs.weather === weather.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-2xl">{weather.icon}</span>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{weather.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            💧 {t('waterAvailability')}
                        </label>
                        <span className="text-green-600 font-bold">{inputs.water}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={inputs.water}
                        onChange={(e) => handleChange('water', parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            🌿 {t('fertilizerAmount')}
                        </label>
                        <span className="text-green-600 font-bold">{inputs.fertilizer}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={inputs.fertilizer}
                        onChange={(e) => handleChange('fertilizer', parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            <motion.button
                onClick={onRun}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-voice={t('runSimulation')}
                className="w-full py-4 mt-auto bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all flex justify-center items-center gap-2"
            >
                <SparklesIcon className="w-6 h-6" /> {t('runSimulation')}
            </motion.button>
        </div>
    );
};

// Helper icon
const SparklesIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export default InputPanel;
