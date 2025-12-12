import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar as CalendarIcon, Tag, Edit2, Type, ArrowRight } from 'lucide-react';
import { Expense, Category } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { suggestCategory } from '../services/geminiService';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  onManageCategories: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, categories, onManageCategories }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for keyboard navigation
  const descriptionRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[categories.length - 1].id);
    }
  }, [categories, categoryId]);

  const handleDescriptionChange = (text: string) => {
    const amountRegexEnd = /(\d+(?:\.\d{1,2})?)\s*$/;
    const matchEnd = text.match(amountRegexEnd);

    if (matchEnd) {
      const foundAmount = matchEnd[1];
      const foundDesc = text.replace(amountRegexEnd, '').trim();
      
      setDescription(foundDesc);
      setAmount(foundAmount);

      const lowerDesc = foundDesc.toLowerCase();
      const matchedCat = categories.find(c => lowerDesc.includes(c.name.toLowerCase()));
      if (matchedCat) {
        setCategoryId(matchedCat.id);
      }
      // Auto focus amount if we parsed it, or just to be ready
      amountRef.current?.focus();
    } else {
      setDescription(text);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Right Arrow is pressed and cursor is at end (or text is empty)
    if (e.key === 'ArrowRight') {
      const input = e.currentTarget;
      if (input.selectionStart === input.value.length) {
        e.preventDefault();
        amountRef.current?.focus();
      }
    }
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
    // Allow left arrow to go back to description if at start
    if (e.key === 'ArrowLeft') {
        const input = e.currentTarget;
        if (input.selectionStart === 0) {
            e.preventDefault();
            descriptionRef.current?.focus();
        }
    }
  };

  // Changed Event type to SyntheticEvent to accept both Form and Keyboard events
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setIsProcessing(true);
    let finalCategoryId = categoryId;

    if (navigator.onLine && description.length > 2) {
       const aiSuggestedId = await suggestCategory(description, parseFloat(amount), categories);
       if (aiSuggestedId) finalCategoryId = aiSuggestedId;
    }

    onAddExpense({
      description: description || 'Expense',
      amount: parseFloat(amount),
      date,
      categoryId: finalCategoryId,
    });

    setDescription('');
    setAmount('');
    setIsProcessing(false);
    
    // Focus back on description for rapid entry
    descriptionRef.current?.focus();
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white/50 dark:border-gray-700/50 p-6 mb-8 transition-all hover:shadow-2xl hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/20 group relative overflow-hidden">
      
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>

      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 relative z-10">
        <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
        </div>
        Quick Add
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Description Input */}
          <div className="flex-grow-[2] relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Type className="w-5 h-5 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
            </div>
            <input
              ref={descriptionRef}
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="What did you buy?"
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-0 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-400 text-gray-900 dark:text-white font-medium"
            />
          </div>

          {/* Amount Input */}
          <div className="flex-grow-[1] min-w-[140px] relative group/amount">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400 font-bold group-focus-within/amount:text-green-500 transition-colors text-lg">{CURRENCY_SYMBOL}</span>
            </div>
            <input
              ref={amountRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleAmountKeyDown}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-white dark:bg-gray-900 border-0 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl text-lg font-bold text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Date Picker */}
            <div className="relative group/date">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <CalendarIcon className="w-4 h-4 text-gray-400 group-focus-within/date:text-indigo-500" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-800/80 border-0 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              />
            </div>

            {/* Category Picker */}
            <div className="relative group/cat">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Tag className="w-4 h-4 text-gray-400 group-focus-within/cat:text-indigo-500" />
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800/80 border-0 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-1 flex items-center">
                 <button 
                  type="button" 
                  onClick={onManageCategories}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-indigo-500"
                  title="Edit Categories"
                 >
                   <Edit2 className="w-3 h-3" />
                 </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || !description || isProcessing}
              className="w-full py-3 bg-gray-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 dark:shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 sm:col-span-2 lg:col-span-1"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  Add <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;