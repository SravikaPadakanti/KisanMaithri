import React from 'react';
import { useFarmStore } from '../../store/useFarmStore';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

const Timeline = () => {
    const actions = useFarmStore((state) => state.actions);

    if (actions.length === 0) return null;

    return (
        <div className="absolute top-4 left-4 z-10 w-64 max-h-[50%] overflow-y-auto bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-2xl p-4 shadow-lg scrollbar-hide">
            <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400">
                <ClockIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Activity Log</span>
            </div>
            <div className="space-y-3">
                {actions.map((log, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3 text-sm relative"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                            {idx !== actions.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 -mb-2" />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Day {log.day}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-xs">{log.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
