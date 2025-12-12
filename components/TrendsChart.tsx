import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Expense } from '../types';
import { MONTH_NAMES, CURRENCY_SYMBOL, CURRENCY_LOCALE } from '../constants';
import { BarChart3 } from 'lucide-react';

interface TrendsChartProps {
  expenses: Expense[];
  currentDate: Date;
  onMonthClick: (date: Date) => void;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ expenses, currentDate, onMonthClick }) => {
  const data = useMemo(() => {
    // Generate the last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(d);
    }

    return months.map(date => {
      const monthKey = date.getMonth();
      const yearKey = date.getFullYear();
      
      const monthlyTotal = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === monthKey && expenseDate.getFullYear() === yearKey) {
          return sum + expense.amount;
        }
        return sum;
      }, 0);

      return {
        name: MONTH_NAMES[monthKey].substring(0, 3),
        fullName: `${MONTH_NAMES[monthKey]} ${yearKey}`,
        amount: monthlyTotal,
        date: date,
        isCurrent: date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
      };
    });
  }, [expenses, currentDate]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-700/50 p-6 mb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-gray-800 dark:text-white font-bold text-lg">Spending Trends</h3>
            <p className="text-xs text-gray-400 mt-0.5">Tap a bar to travel in time</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
               <span className="text-gray-600 dark:text-gray-300">Selected</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
               <span className="text-gray-400">History</span>
             </div>
        </div>
      </div>
      
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" strokeOpacity={0.4} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `${CURRENCY_SYMBOL}${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'var(--tooltip-cursor, #f8fafc)', radius: 8 }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: '#1f2937'
              }}
              formatter={(value: number) => [`${CURRENCY_SYMBOL}${value.toLocaleString(CURRENCY_LOCALE)}`, 'Total']}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: 600 }}
              itemStyle={{ color: '#1f2937' }}
            />
            <Bar 
              dataKey="amount" 
              radius={[8, 8, 8, 8]} 
              animationDuration={800}
              onClick={(data) => onMonthClick(data.date)}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isCurrent ? '#6366f1' : '#cbd5e1'} 
                  className={`transition-all duration-300 hover:opacity-80 ${!entry.isCurrent && 'dark:fill-gray-700'}`}
                  stroke={entry.isCurrent ? '#4f46e5' : 'transparent'}
                  strokeWidth={entry.isCurrent ? 2 : 0}
                /> 
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;