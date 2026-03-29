import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import FloatingAssistant from './AiAssistant/FloatingAssistant';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Home page gets no navbar and no wrapper padding — full bleed layout
    if (isHome) {
        return (
            <div className="min-h-screen relative">
                {children}
                <FloatingAssistant />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
            >
                {children}
            </motion.main>
            <FloatingAssistant />
            <footer className="mt-auto py-8 text-center text-gray-500 text-sm">
                © 2026 KisanMaithri. Empowering farmers with AI.
            </footer>
        </div>
    );
};

export default Layout;