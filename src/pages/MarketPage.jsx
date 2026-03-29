import React, { useState } from 'react';
import { useFarmStore } from '../store/useFarmStore';
import { useLanguage } from '../context/LanguageContext';
import {
    MagnifyingGlassIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
    CurrencyRupeeIcon,
    XMarkIcon,
    CalendarDaysIcon,
    BeakerIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const MarketPage = () => {
    const { marketPrices } = useFarmStore();
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);

    const crops = Object.entries(marketPrices).map(([key, data]) => ({
        id: key,
        name: t(key),
        ...data
    }));

    const filteredCrops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 pb-24 md:pb-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{t('marketTitle')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('marketDesc')}</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto mb-8 relative">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCrops.map((crop, index) => (
                    <CropCard
                        key={crop.name}
                        crop={crop}
                        index={index}
                        onViewAnalysis={() => setSelectedCrop(crop)}
                    />
                ))}

                {filteredCrops.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        {t('noCropsFound')} "{searchTerm}"
                    </div>
                )}
            </div>
            {/* Analysis Modal */}
            <AnimatePresence>
                {selectedCrop && (
                    <CropAnalysisModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const CropAnalysisModal = ({ crop, onClose }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                    </button>
                </div>

                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden flex items-center px-8">
                    <h2 className="text-3xl font-black text-white capitalize drop-shadow-md z-10">{crop.name} {t('analysis')}</h2>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                        <ChartBarIcon className="w-64 h-64 text-white" />
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Stats */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <CurrencyRupeeIcon className="w-5 h-5 text-green-500" /> {t('financials')}
                            </h3>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-green-700 dark:text-green-300">{t('expectedProfit')}</span>
                                    <span className="text-lg font-bold text-green-800 dark:text-green-100">
                                        ₹{((crop.pricePerQuintal * 20) - crop.costPerAcre).toLocaleString()}/{t('perAcre')}
                                    </span>
                                </div>
                                <div className="w-full bg-green-200 dark:bg-green-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[75%]" />
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <BeakerIcon className="w-5 h-5 text-blue-500" /> {t('conditions')}
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>Soil: Well-drained loamy soil</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                                    <span>Sunlight: 6-8 hours daily</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full" />
                                    <span>Water: Moderate irrigation</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Simulated Price Chart */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                            <CalendarDaysIcon className="w-5 h-5 text-purple-500" /> {t('priceTrend')}
                        </h3>
                        <div className="h-40 flex items-end justify-between gap-2 border-b border-l border-gray-200 dark:border-gray-700 p-2 relative">
                            {[40, 65, 50, 80, 55, 90].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-purple-500/50 rounded-t hover:bg-purple-500 transition-colors relative group cursor-pointer"
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{crop.pricePerQuintal + (h * 10)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            {t('close')}
                        </button>
                        <button className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all">
                            {t('simulate')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CropCard = ({ crop, index, onViewAnalysis }) => {
    const { t } = useLanguage();
    const isUp = crop.trend === 'up';
    const isDown = crop.trend === 'down';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-50 to-transparent dark:from-green-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold capitalize text-gray-900 dark:text-white">{crop.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{t('cost')}: ₹{crop.costPerAcre.toLocaleString()}/{t('perAcre')}</p>
                </div>
                <div className={`p-2 rounded-full ${isUp ? 'bg-green-100 text-green-600' : isDown ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {isUp ? <ArrowTrendingUpIcon className="w-5 h-5" /> : isDown ? <ArrowTrendingDownIcon className="w-5 h-5" /> : <MinusIcon className="w-5 h-5" />}
                </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                    <CurrencyRupeeIcon className="w-6 h-6 text-gray-400" />
                    {crop.pricePerQuintal.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 mb-1.5">/ {t('perQuintal')}</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
                <span className={`px-2 py-1 rounded-md ${isUp ? 'bg-green-50 text-green-700 border border-green-100' : isDown ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                    {isUp ? t('highDemand') : isDown ? t('lowDemand') : t('stable')}
                </span>
                {isUp && <span className="text-xs text-green-600 animate-pulse font-bold">{t('recommended')}</span>}
            </div>

            <button
                onClick={onViewAnalysis}
                className="w-full mt-4 py-2 rounded-lg bg-gray-900 dark:bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
            >
                {t('viewAnalysis')}
            </button>
        </motion.div>
    );
};

export default MarketPage;
