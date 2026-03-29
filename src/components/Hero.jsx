import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, SparklesIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 p-8 md:p-16 text-center my-8 shadow-inner border border-white/40 dark:border-white/5">

            {/* Background Particles (Simplified) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                        className="absolute text-green-200 dark:text-green-800/30 text-4xl"
                        style={{
                            left: `${10 + i * 20}%`,
                            top: `${20 + i * 15}%`,
                        }}
                    >
                        🌾
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold mb-6 border border-green-200 dark:border-green-800">
                    <SparklesIcon className="w-4 h-4" /> {t('aiTechnology')}
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
                    {t('simulateFarm')} <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-200">
                        {t('beforeYouPlant')}
                    </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {t('heroDesc')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/digital-twin">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-full font-bold shadow-lg shadow-green-500/30 flex items-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5" /> {t('startSimulation')}
                        </motion.button>
                    </Link>

                    <Link to="/digital-twin" state={{ open3d: true }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white dark:bg-white/10 text-gray-700 dark:text-white rounded-full font-bold shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2 backdrop-blur-sm"
                        >
                            <CubeTransparentIcon className="w-6 h-6 text-blue-500" /> {t('watch3D')}
                        </motion.button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-8 md:gap-16 mt-16 text-center">
                    {[
                        { label: t('farmers'), value: '10K+' },
                        { label: t('accuracy'), value: '95%' },
                        { label: t('waterSaved'), value: '40%' },
                        { label: t('profitBoost'), value: '₹2Cr+' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
