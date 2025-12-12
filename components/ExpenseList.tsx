import React from 'react';
import { Trash2, ShoppingBag, X, Filter, Tag } from 'lucide-react';
import { Expense, Category } from '../types';
import { CURRENCY_SYMBOL, CURRENCY_LOCALE } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
  selectedCategory: string | null;
  onClearFilter: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories, onDelete, selectedCategory, onClearFilter }) => {
  
  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getCategoryDetails = (id: string) => {
    return categories.find(c => c.id === id) || { name: 'Unknown', color: '#9ca3af' };
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Filter Banner */}
      {selectedCategory && (
        <div className="bg-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-500/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Active Filter</p>
              <p className="font-semibold">{selectedCategory}</p>
            </div>
          </div>
          <button 
            onClick={onClearFilter}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full mb-4 shadow-sm">
            <ShoppingBag className="w-6 h-6 text-gray-300 dark:text-gray-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-bold text-lg">No expenses found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
            {selectedCategory 
              ? `No ${selectedCategory} expenses found.` 
              : "Your history is clean. Try adding 'Coffee 250' above!"}
          </p>
          {selectedCategory && (
            <button 
              onClick={onClearFilter}
              className="mt-6 px-4 py-2 bg-gray-900 dark:bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-black dark:hover:bg-indigo-700 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        sortedDates.map((date, dateIdx) => (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${dateIdx * 100}ms` }}>
            <h4 className="flex items-center gap-3 text-sm font-bold text-gray-400 dark:text-gray-500 mb-4 ml-2 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h4>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {groupedExpenses[date].map((expense, idx) => {
                const category = getCategoryDetails(expense.categoryId);
                return (
                  <div 
                    key={expense.id}
                    className={`group flex items-center justify-between p-5 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors ${idx !== groupedExpenses[date].length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 dark:shadow-none transform group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: category.color }}
                      >
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-[15px]">{expense.description}</p>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">{category.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <span className="font-bold text-gray-900 dark:text-white text-lg tabular-nums">
                        -{CURRENCY_SYMBOL}{expense.amount.toLocaleString(CURRENCY_LOCALE)}
                      </span>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
