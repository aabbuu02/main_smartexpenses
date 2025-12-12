import React, { useState, useMemo } from 'react';
import { Expense, Category } from '../types';
import { CURRENCY_SYMBOL, MONTH_NAMES } from '../constants';
import { X, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface CalendarViewProps {
  currentDate: Date;
  expenses: Expense[];
  categories: Category[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, expenses, categories }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday

  // Group expenses by exact date (YYYY-MM-DD)
  const expensesByDate = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.date] = acc[expense.date] || [];
      acc[expense.date].push(expense);
      return acc;
    }, {} as Record<string, Expense[]>);
  }, [expenses]);

  const renderDays = () => {
    const days = [];
    // Blanks for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`blank-${i}`} className="aspect-square"></div>);
    }

    // Actual Days
    for (let i = 1; i <= daysInMonth; i++) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(i).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      const dayExpenses = expensesByDate[dateKey] || [];
      const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      const hasExpense = dayExpenses.length > 0;

      days.push(
        <button 
          key={dateKey} 
          onClick={() => hasExpense && setSelectedDay(dateKey)}
          disabled={!hasExpense}
          className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300
            ${hasExpense ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer' : 'opacity-40 cursor-default'}
            ${selectedDay === dateKey ? 'ring-2 ring-indigo-500' : ''}
          `}
        >
          <span className={`text-sm font-medium ${hasExpense ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>{i}</span>
          {hasExpense && (
             <div className="flex gap-0.5 mt-1">
               {/* Show max 3 dots */}
               {dayExpenses.slice(0, Math.min(dayExpenses.length, 3)).map((_, idx) => (
                 <div key={idx} className="w-1 h-1 rounded-full bg-indigo-500"></div>
               ))}
             </div>
          )}
        </button>
      );
    }
    return days;
  };

  const getCategoryColor = (id: string) => categories.find(c => c.id === id)?.color || '#ccc';

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-700/50 p-6 relative">
      <div className="flex items-center gap-2 mb-6">
        <CalendarIcon className="w-5 h-5 text-indigo-500" />
        <h3 className="text-gray-800 dark:text-white font-bold text-lg">Monthly Calendar</h3>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Popover Modal for Selected Day */}
      {selectedDay && (
        <div className="absolute inset-0 z-10 bg-white dark:bg-gray-900 rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
             <div>
               <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                 {new Date(selectedDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
               </h4>
               <p className="text-xs text-gray-500">
                 {expensesByDate[selectedDay]?.length} Transactions
               </p>
             </div>
             <button onClick={() => setSelectedDay(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
               <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {expensesByDate[selectedDay]?.map(exp => (
              <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-8 rounded-full" style={{ backgroundColor: getCategoryColor(exp.categoryId) }}></div>
                   <div>
                     <p className="font-medium text-gray-800 dark:text-white text-sm">{exp.description}</p>
                     <p className="text-[10px] text-gray-400">
                       {categories.find(c => c.id === exp.categoryId)?.name}
                     </p>
                   </div>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white text-sm">
                   {CURRENCY_SYMBOL}{exp.amount}
                 </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Total</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {CURRENCY_SYMBOL}{expensesByDate[selectedDay]?.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
