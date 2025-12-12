import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Mail, Smartphone, ArrowRight, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'gmail' | 'phone' | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
        onLogin({
            isLoggedIn: true,
            name: method === 'gmail' ? inputValue.split('@')[0] : 'User',
            email: method === 'gmail' ? inputValue : undefined
        });
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white dark:border-gray-700 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to SmartSpend</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
            Sign in to sync your expenses and never lose your data.
          </p>
        </div>

        {!method ? (
          <div className="space-y-3">
            <button 
              onClick={() => setMethod('gmail')}
              className="w-full py-3.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
            >
               <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
               <span className="text-gray-700 dark:text-white font-medium">Continue with Google</span>
            </button>
            <button 
              onClick={() => setMethod('phone')}
              className="w-full py-3.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
            >
               <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-500 transition-colors" />
               <span className="text-gray-700 dark:text-white font-medium">Continue with Phone</span>
            </button>
            
            <div className="mt-6 text-center">
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">Secured by Cloud Sync</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">
                    {method === 'gmail' ? 'Email Address' : 'Phone Number'}
                </label>
                <input 
                  type={method === 'gmail' ? 'email' : 'tel'} 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={method === 'gmail' ? 'you@example.com' : '+91 98765 43210'}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
             </div>
             <button 
               type="submit"
               disabled={!inputValue || loading}
               className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
             </button>
             <button 
               type="button"
               onClick={() => setMethod(null)}
               className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
             >
               Go back
             </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;