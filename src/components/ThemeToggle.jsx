import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../theme/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {theme === 'dark' ? (
                    <MoonIcon className="h-6 w-6" />
                ) : (
                    <SunIcon className="h-6 w-6 text-orange-400" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
