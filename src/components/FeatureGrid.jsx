import React from 'react';
import { TrendingUp, Droplets, ShieldCheck, Coins, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const FeatureGrid = () => {
    const { t } = useLanguage();

    const features = [
        {
            title: t('predictYield'),
            description: t('predictYieldDesc'),
            icon: TrendingUp,
            color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        },
        {
            title: t('saveWater'),
            description: t('saveWaterDesc'),
            icon: Droplets,
            color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        },
        {
            title: t('preventLoss'),
            description: t('preventLossDesc'),
            icon: ShieldCheck,
            color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        },
        {
            title: t('improveProfit'),
            description: t('improveProfitDesc'),
            icon: Coins,
            color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        },
        {
            title: t('sustainableFarming'),
            description: t('sustainableFarmingDesc'),
            icon: Leaf,
            color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        },
    ];

    return (
        <div className="py-16">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {t('whyLoveBhoomi')} <span className="text-green-600">KisanMaithri</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {t('simpleTools')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeatureGrid;
