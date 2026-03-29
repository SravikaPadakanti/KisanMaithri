import React from 'react';
import { motion } from 'framer-motion';

const Placeholder = ({ title, icon: Icon, description }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-green-100 to-orange-100 dark:from-green-900 dark:to-orange-900 shadow-xl"
            >
                <Icon className="w-24 h-24 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 mb-4"
            >
                {title}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-8"
            >
                {description || "This feature is currently under development. Stay tuned for updates!"}
            </motion.p>
            <div className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    Coming Soon
                </span>
            </div>
        </div>
    );
};

export default Placeholder;
