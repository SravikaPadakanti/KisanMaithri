import React, { useMemo } from 'react';
import { useFarmStore } from '../../store/useFarmStore';
import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
    CurrencyRupeeIcon,
    BanknotesIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const MarketInsights = ({ yieldQuintals }) => {
    const { getFinancials } = useFarmStore();

    const financials = useMemo(() => getFinancials(yieldQuintals), [yieldQuintals, getFinancials]);
    const { revenue, totalCost, profit, roi, pricePerQuintal, trend } = financials;

    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    const TrendIcon = trend === 'up' ? ArrowTrendingUpIcon : trend === 'down' ? ArrowTrendingDownIcon : MinusIcon;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mt-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <PresentationChartLineIcon className="w-6 h-6 text-purple-500" />
                Market Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Revenue */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium block mb-1">Total Revenue</span>
                    <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1">
                        <CurrencyRupeeIcon className="w-5 h-5" />
                        {revenue.toLocaleString()}
                    </p>
                </div>

                {/* Profit */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium block mb-1">Net Profit</span>
                    <p className={`text-2xl font-black flex items-center gap-1 ${profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        <CurrencyRupeeIcon className="w-5 h-5" />
                        {profit.toLocaleString()}
                    </p>
                </div>

                {/* ROI */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium block mb-1">ROI</span>
                    <p className={`text-2xl font-black ${roi >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>
                        {roi.toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white dark:bg-gray-600 shadow-sm ${trendColor}`}>
                        <TrendIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Market Price</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">₹{pricePerQuintal}/quintal</p>
                    </div>
                </div>

                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${trend === 'up' ? 'bg-green-100 text-green-700 border-green-200' :
                        trend === 'down' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                        {trend === 'up' ? 'High Demand' : trend === 'down' ? 'Low Demand' : 'Stable'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                        {trend === 'up' ? 'Sell now for best profit' : 'Consider holding stock'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MarketInsights;
