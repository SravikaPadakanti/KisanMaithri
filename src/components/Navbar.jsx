import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, LanguageIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t, isVoiceEnabled, toggleVoice } = useLanguage();

    const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'मराठी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'اردو' }
];

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('digitalTwin'), path: '/digital-twin' },
        { name: t('marketInsights'), path: '/market' },
        { name: t('cropHealth'), path: '/crop-health' },
        { name: '🌱 Soil Advisor', path: '/soil-advisor' },
        { name: '📄 Soil Report Upload', path: '/soil-report-upload' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-3xl">🌾</span>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-emerald-200">
                        KisanMaithri
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-300 relative ${
                                location.pathname === link.path
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-green-500"
                                />
                            )}
                        </Link>
                    ))}

                    {/* Voice toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleVoice}
                        className={`p-2 rounded-full transition-colors ${
                            isVoiceEnabled
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        {isVoiceEnabled
                            ? <SpeakerWaveIcon className="w-5 h-5" />
                            : <SpeakerXMarkIcon className="w-5 h-5" />}
                    </motion.button>

                    {/* Language dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
                        >
                            <LanguageIcon className="w-5 h-5" />
                            <span className="uppercase font-bold text-sm">{language}</span>
                        </button>
                        <AnimatePresence>
                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors ${
                                                language === lang.code
                                                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                                                    : 'text-gray-600 dark:text-gray-300'
                                            }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <ThemeToggle />
                </div>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-200">
                        {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-lg font-medium ${
                                        location.pathname === link.path
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;