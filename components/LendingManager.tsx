import React, { useState } from 'react';
import { Debt } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { User, ArrowUpRight, ArrowDownLeft, CheckCircle2, Circle, Trash2, Plus, Calendar, AlertTriangle } from 'lucide-react';

interface LendingManagerProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, 'id' | 'isSettled'>) => void;
  onSettleDebt: (id: string) => void;
  onDeleteDebt: (id: string) => void;
}

const LendingManager: React.FC<LendingManagerProps> = ({ debts, onAddDebt, onSettleDebt, onDeleteDebt }) => {
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'lent' | 'borrowed'>('lent');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !amount) return;

    onAddDebt({
      personName,
      amount: parseFloat(amount),
      type,
      date,
    });

    setPersonName('');
    setAmount('');
  };

  const handleSafeSettle = (debt: Debt) => {
    // If it's already settled, we might just be toggling back, but usually settling is the big action.
    // If it is NOT settled, we ask for confirmation.
    if (!debt.isSettled) {
        const confirmSettle = window.confirm(`Mark this debt with ${debt.personName} as fully paid/settled?`);
        if (confirmSettle) {
            onSettleDebt(debt.id);
        }
    } else {
        // Un-settling might not need a confirm, or maybe it does. Let's keep it consistent.
        onSettleDebt(debt.id);
    }
  };

  const handleSafeDelete = (debt: Debt) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete the record for ${debt.personName}? This cannot be undone.`);
    if (confirmDelete) {
      onDeleteDebt(debt.id);
    }
  };

  const totalLent = debts.filter(d => d.type === 'lent' && !d.isSettled).reduce((sum, d) => sum + d.amount, 0);
  const totalBorrowed = debts.filter(d => d.type === 'borrowed' && !d.isSettled).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-3xl border border-green-100 dark:border-green-800/50">
           <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
             <ArrowUpRight className="w-5 h-5" />
             <span className="text-sm font-bold uppercase tracking-wider">You are Owed</span>
           </div>
           <div className="text-3xl font-extrabold text-green-700 dark:text-green-300">
             {CURRENCY_SYMBOL}{totalLent.toLocaleString()}
           </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border border-red-100 dark:border-red-800/50">
           <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
             <ArrowDownLeft className="w-5 h-5" />
             <span className="text-sm font-bold uppercase tracking-wider">You Owe</span>
           </div>
           <div className="text-3xl font-extrabold text-red-700 dark:text-red-300">
             {CURRENCY_SYMBOL}{totalBorrowed.toLocaleString()}
           </div>
        </div>
      </div>

      {/* Add New Debt Form */}
      <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" />
            Add Record
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Person Name"
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{CURRENCY_SYMBOL}</span>
                <input 
                  type="number" 
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
             </div>
          </div>
          
          <div className="flex gap-3">
             <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl flex-1">
               <button 
                type="button" 
                onClick={() => setType('lent')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'lent' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 I Lent
               </button>
               <button 
                type="button" 
                onClick={() => setType('borrowed')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === 'borrowed' ? 'bg-white dark:bg-gray-700 shadow text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 I Borrowed
               </button>
             </div>
             
             <button 
               type="submit" 
               className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-6 rounded-xl hover:opacity-90 transition-opacity"
             >
               Add
             </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4">
        {debts.length === 0 ? (
           <div className="text-center py-10 text-gray-400">No debts recorded.</div>
        ) : (
          debts.map((debt) => (
             <div key={debt.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${debt.isSettled ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleSafeSettle(debt)} 
                    className="text-gray-300 hover:text-indigo-500 transition-colors"
                    title={debt.isSettled ? "Mark as unpaid" : "Mark as settled"}
                  >
                    {debt.isSettled ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : <Circle className="w-7 h-7" />}
                  </button>
                  
                  <div>
                    <h4 className={`font-bold text-lg ${debt.isSettled ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{debt.personName}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      {debt.type === 'lent' ? <span className="text-green-500 font-medium">Owes you</span> : <span className="text-red-500 font-medium">You owe</span>}
                      <span>• {new Date(debt.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <span className={`font-bold text-lg ${debt.type === 'lent' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                     {CURRENCY_SYMBOL}{debt.amount.toLocaleString()}
                   </span>
                   <button onClick={() => handleSafeDelete(debt)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LendingManager;