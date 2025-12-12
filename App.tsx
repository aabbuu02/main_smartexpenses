import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Calendar, ChevronLeft, ChevronRight, HelpCircle, Sun, Moon, Monitor, Download, TrendingUp, Users, PieChart as PieChartIcon } from 'lucide-react';
import { Expense, MonthlyStats, Category, Theme, Debt, User } from './types';
import { MONTH_NAMES } from './constants';
import { saveExpenses, loadExpenses, saveCategories, loadCategories, saveTheme, loadTheme, exportExpensesToCSV, saveDebts, loadDebts, saveUser, loadUser } from './services/storageService';
import { getMonthlyInsights } from './services/geminiService';
import ExpenseForm from './components/ExpenseForm';
import StatsCard from './components/StatsCard';
import ExpenseList from './components/ExpenseList';
import TrendsChart from './components/TrendsChart';
import CalendarView from './components/CalendarView';
import CategoryManager from './components/CategoryManager';
import HelpModal from './components/HelpModal';
import LendingManager from './components/LendingManager';
import AuthScreen from './components/AuthScreen';

const App: React.FC = () => {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);

  // --- Data State ---
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [theme, setTheme] = useState<Theme>('system');
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'expenses' | 'lending'>('expenses');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // Modals
  const [showCatManager, setShowCatManager] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // --- Initial Load ---
  useEffect(() => {
    // Load User First
    const storedUser = loadUser();
    if (storedUser && storedUser.isLoggedIn) {
        setUser(storedUser);
    }

    setExpenses(loadExpenses());
    setCategories(loadCategories());
    setDebts(loadDebts());
    setTheme(loadTheme());
  }, []);

  // --- Persistence ---
  useEffect(() => { if (user) saveUser(user); }, [user]);
  useEffect(() => { if (expenses.length > 0) saveExpenses(expenses); }, [expenses]);
  useEffect(() => { if (categories.length > 0) saveCategories(categories); }, [categories]);
  useEffect(() => { saveDebts(debts); }, [debts]);

  useEffect(() => {
    saveTheme(theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // --- Derived Data ---
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
  }, [expenses, selectedDate]);

  const displayedExpenses = useMemo(() => {
    if (!selectedCategory) return currentMonthExpenses;
    return currentMonthExpenses.filter(e => {
      const cat = categories.find(c => c.id === e.categoryId);
      return cat?.name === selectedCategory;
    });
  }, [currentMonthExpenses, selectedCategory, categories]);

  const monthlyStats: MonthlyStats = useMemo(() => {
    const total = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
      const cat = categories.find(c => c.id === e.categoryId);
      const name = cat ? cat.name : 'Unknown';
      acc[name] = (acc[name] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = Object.entries(categoryTotals).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return {
        name,
        value: Number(value),
        color: cat ? cat.color : '#cbd5e1',
        budget: cat ? cat.budgetLimit : undefined
      };
    }).sort((a, b) => b.value - a.value);

    return { total, byCategory };
  }, [currentMonthExpenses, categories]);

  // --- Handlers ---
  const handleLogin = (newUser: User) => {
    setUser(newUser);
  }

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = { ...newExpense, id: crypto.randomUUID() };
    setExpenses(prev => [expense, ...prev]);
    setAiInsight(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setAiInsight(null);
  };

  const handleAddDebt = (newDebt: Omit<Debt, 'id' | 'isSettled'>) => {
    const debt: Debt = { ...newDebt, id: crypto.randomUUID(), isSettled: false };
    setDebts(prev => [debt, ...prev]);
  };

  const handleSettleDebt = (id: string) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, isSettled: !d.isSettled } : d));
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
    setAiInsight(null);
    setSelectedCategory(null);
  };

  const generateInsight = async () => {
    setIsLoadingInsight(true);
    const monthName = MONTH_NAMES[selectedDate.getMonth()];
    const insight = await getMonthlyInsights(currentMonthExpenses, categories, monthName);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  // --- Auth Guard ---
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transform transition-transform hover:scale-105">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">SmartSpend</h1>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest ml-0.5">Daily Tracker</span>
                 {user.name && <span className="text-[10px] text-gray-400">• Hi, {user.name}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="hidden sm:flex items-center gap-2">
                <button 
                    onClick={() => exportExpensesToCSV(expenses, categories, `smartspend_history_${new Date().toISOString().split('T')[0]}.csv`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 transition-colors"
                    title="Export All History"
                >
                  <Download className="w-3.5 h-3.5" /> All
                </button>
                <button 
                    onClick={() => exportExpensesToCSV(currentMonthExpenses, categories, `smartspend_${MONTH_NAMES[selectedDate.getMonth()]}_${selectedDate.getFullYear()}.csv`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 transition-colors"
                    title={`Export ${MONTH_NAMES[selectedDate.getMonth()]} Data`}
                >
                  <Download className="w-3.5 h-3.5" /> Month
                </button>
             </div>

             <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
                <button onClick={() => setTheme('light')} className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}><Sun className="w-4 h-4" /></button>
                <button onClick={() => setTheme('system')} className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}><Monitor className="w-4 h-4" /></button>
                <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-gray-700 shadow text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}><Moon className="w-4 h-4" /></button>
             </div>

             <button onClick={() => setShowHelp(true)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
               <HelpCircle className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-xl mx-auto mt-6 px-4">
        <div className="bg-white/50 dark:bg-gray-800/50 p-1 rounded-2xl flex gap-1 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-sm">
           <button 
             onClick={() => setActiveTab('expenses')}
             className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'expenses' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
           >
             <PieChartIcon className="w-4 h-4" /> Expenses
           </button>
           <button 
             onClick={() => setActiveTab('lending')}
             className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'lending' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
           >
             <Users className="w-4 h-4" /> Lending
           </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {activeTab === 'expenses' ? (
          <>
            {/* Date Navigator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-md">
                <button onClick={() => handleMonthChange('prev')} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"><ChevronLeft className="w-4 h-4" /></button>
                <div className="px-6 flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-sm font-bold text-gray-800 dark:text-white leading-none">{MONTH_NAMES[selectedDate.getMonth()]}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{selectedDate.getFullYear()}</span>
                </div>
                <button onClick={() => handleMonthChange('next')} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <StatsCard 
              stats={monthlyStats}
              monthName={MONTH_NAMES[selectedDate.getMonth()]}
              year={selectedDate.getFullYear()}
              aiInsight={aiInsight}
              onGenerateInsight={generateInsight}
              isLoadingInsight={isLoadingInsight}
              selectedCategory={selectedCategory}
              onCategoryClick={(catName) => setSelectedCategory(prev => prev === catName ? null : catName)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="lg:sticky lg:top-24 space-y-8">
                  <ExpenseForm onAddExpense={handleAddExpense} categories={categories} onManageCategories={() => setShowCatManager(true)} />
                  <CalendarView currentDate={selectedDate} expenses={currentMonthExpenses} categories={categories} />
                  <TrendsChart expenses={expenses} currentDate={selectedDate} onMonthClick={(d) => { if (d.getMonth() !== selectedDate.getMonth()) { setSelectedDate(d); setAiInsight(null); setSelectedCategory(null); }}} />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    Transactions
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">{displayedExpenses.length}</span>
                  </h2>
                </div>
                <ExpenseList expenses={displayedExpenses} categories={categories} onDelete={handleDeleteExpense} selectedCategory={selectedCategory} onClearFilter={() => setSelectedCategory(null)} />
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <LendingManager 
               debts={debts} 
               onAddDebt={handleAddDebt} 
               onSettleDebt={handleSettleDebt} 
               onDeleteDebt={handleDeleteDebt} 
            />
          </div>
        )}

      </main>

      {/* Modals */}
      {showCatManager && <CategoryManager categories={categories} onUpdateCategories={setCategories} onClose={() => setShowCatManager(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default App;