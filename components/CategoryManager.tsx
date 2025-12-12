import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Wallet } from 'lucide-react';
import { Category } from '../types';
import { DEFAULT_CATEGORIES, CURRENCY_SYMBOL } from '../constants';

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onUpdateCategories, onClose }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [newCatBudget, setNewCatBudget] = useState('');

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: newCatName.trim(),
      color: newCatColor,
      budgetLimit: newCatBudget ? parseFloat(newCatBudget) : undefined,
      isDefault: false
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatBudget('');
    // Randomize next color slightly
    setNewCatColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? Expenses using this category will likely default to "Other" or look broken.')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default categories? Custom categories will be lost.')) {
      onUpdateCategories(DEFAULT_CATEGORIES);
    }
  };

  const handleUpdateBudget = (id: string, budgetStr: string) => {
    const updated = categories.map(c => {
      if (c.id === id) {
        return { ...c, budgetLimit: budgetStr ? parseFloat(budgetStr) : undefined };
      }
      return c;
    });
    onUpdateCategories(updated);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Categories</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add New */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">Create New</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name"
                  className="flex-1 bg-white dark:bg-gray-800 border-0 rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                 <div className="relative flex-1">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-xs">{CURRENCY_SYMBOL}</span>
                   </div>
                   <input 
                      type="number" 
                      value={newCatBudget}
                      onChange={(e) => setNewCatBudget(e.target.value)}
                      placeholder="Monthly Budget Limit (Optional)"
                      className="w-full bg-white dark:bg-gray-800 border-0 rounded-xl pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                   />
                 </div>
                 <button 
                  onClick={handleAdd}
                  disabled={!newCatName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Existing Categories</h3>
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
                  </div>
                  {!cat.isDefault && (
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Inline Budget Edit */}
                <div className="flex items-center gap-2 pl-7">
                  <Wallet className="w-3 h-3 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="Set Limit"
                    value={cat.budgetLimit || ''}
                    onChange={(e) => handleUpdateBudget(cat.id, e.target.value)}
                    className="bg-transparent border-b border-gray-200 dark:border-gray-700 text-xs py-1 px-1 w-24 focus:outline-none focus:border-indigo-500 dark:text-gray-300 placeholder:text-gray-400"
                  />
                  <span className="text-xs text-gray-400">monthly limit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <button 
            onClick={handleReset}
            className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium px-5 py-2 rounded-xl text-sm shadow-lg shadow-gray-200 dark:shadow-none hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryManager;
