import React from 'react';
import { motion } from 'framer-motion';
import {
    CurrencyRupeeIcon,
    ScaleIcon,
    ChartBarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import MarketInsights from './MarketInsights';
import { useLanguage } from '../../context/LanguageContext';

const ResultsPanel = ({ results, loading }) => {
    const { t } = useLanguage();

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 animate-pulse">{t('simulating')}</p>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center justify-center min-h-[300px] text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">{t('noData')}</h3>
                <p className="text-sm text-gray-500 mt-2">{t('configureInputs')}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full"
        >
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-green-500" />
                {t('yieldProjections')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Yield Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 col-span-2">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('totalYield')}</span>
                        <ScaleIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {results.yield} <span className="text-sm font-medium text-gray-500">{t('perQuintal')}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        {t('basedOn')} {results.area} {t(results.unit)}
                    </p>
                </div>
            </div>

            <MarketInsights yieldQuintals={results.yield} />

            <div className="my-6 border-t border-gray-100 dark:border-gray-700"></div>

            {/* Risk Factors */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">{t('riskAssessment')}</h3>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('pestRisk')}</span>
                            <span className="text-xs font-bold text-red-500">{results.risks.pest}% {t('high')}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div
                                className="bg-red-500 h-1.5 rounded-full"
                                style={{ width: `${results.risks.pest}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('weatherRisk')}</span>
                            <span className="text-xs font-bold text-yellow-500">{results.risks.weather}% {t('moderate')}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div
                                className="bg-yellow-500 h-1.5 rounded-full"
                                style={{ width: `${results.risks.weather}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full py-3 bg-gray-900 dark:bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    {t('downloadReport')}
                </button>
            </div>
        </motion.div>
    );
};

export default ResultsPanel;
