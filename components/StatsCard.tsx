import React from 'react';
import { MonthlyStats } from '../types';
import { BrainCircuit, TrendingUp, Filter, AlertCircle, Wallet } from 'lucide-react';
import { CURRENCY_SYMBOL, CURRENCY_LOCALE } from '../constants';

interface StatsCardProps {
  stats: MonthlyStats;
  monthName: string;
  year: number;
  aiInsight: string | null;
  onGenerateInsight: () => void;
  isLoadingInsight: boolean;
  selectedCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  stats, 
  monthName, 
  year, 
  aiInsight, 
  onGenerateInsight,
  isLoadingInsight,
  selectedCategory,
  onCategoryClick
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      
      {/* Total Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/40 p-8 flex flex-col justify-between group border border-white dark:border-gray-800 transition-all duration-300 hover:shadow-2xl h-80">
        {/* Background Gradients - Animated */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 transition-all duration-700 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 animate-blob" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-80">
             {/* Icon with White Shade in Light Mode */}
             <div className="bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-0 p-2 rounded-xl transition-colors">
                <Wallet className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
             </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{monthName} {year}</span>
          </div>
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">
            <span className="text-3xl align-top opacity-50 mr-1 font-medium">{CURRENCY_SYMBOL}</span>
            {stats.total.toLocaleString(CURRENCY_LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Total Outflow</p>
        </div>

        <div className="relative z-10 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5 font-bold">Daily Average</div>
            <div className="text-lg font-bold text-gray-700 dark:text-gray-200">{CURRENCY_SYMBOL}{(stats.total / 30).toLocaleString(CURRENCY_LOCALE, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-green-50 dark:bg-gray-800 p-3 rounded-2xl border border-green-100 dark:border-gray-700 shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700/50 p-6 flex flex-col h-80 lg:col-span-1">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Breakdown</h3>
          {selectedCategory && (
             <span 
                onClick={() => onCategoryClick(selectedCategory)}
                className="cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-full animate-in zoom-in transition-colors"
             >
               <Filter className="w-3 h-3" /> 
               {selectedCategory} <span className="opacity-50 ml-1">×</span>
             </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {stats.byCategory.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 opacity-50" />
                  </div>
                  <span>No data yet</span>
               </div>
            ) : (
              <div className="space-y-3">
                {stats.byCategory.map((cat) => {
                  const percent = cat.budget ? Math.min((cat.value / cat.budget) * 100, 100) : 0;
                  const isOverBudget = cat.budget && cat.value > cat.budget;
                  
                  return (
                    <div key={cat.name} onClick={() => onCategoryClick(cat.name)} className="cursor-pointer group p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                           {CURRENCY_SYMBOL}{cat.value.toLocaleString()} 
                           {cat.budget && <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-1">/ {cat.budget/1000}k</span>}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isOverBudget ? 'bg-red-500' : 'bg-indigo-500'}`} 
                          style={{ width: cat.budget ? `${percent}%` : '5px', backgroundColor: cat.budget ? undefined : cat.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* AI Insights Card - Fixed Height for Stability */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/30 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/40 dark:shadow-none border border-white dark:border-gray-700/50 p-6 flex flex-col h-80 lg:col-span-1 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10 flex-shrink-0">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
               <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span>AI Coach</span>
          </h3>
          <button 
            onClick={onGenerateInsight}
            disabled={isLoadingInsight || stats.total === 0}
            className="text-xs font-bold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isLoadingInsight ? 'Thinking...' : 'Analyze'}
          </button>
        </div>
        
        <div className="flex-1 relative z-10 overflow-hidden">
          {aiInsight ? (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
               <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed animate-in fade-in duration-500 bg-white/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                 {aiInsight}
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 gap-3">
               <div className="w-16 h-16 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center animate-pulse">
                 <BrainCircuit className="w-8 h-8 text-indigo-200 dark:text-indigo-500/50" />
               </div>
               <p className="text-xs font-medium max-w-[220px]">Tap analyze to get smart spending tips based on your {monthName} data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;