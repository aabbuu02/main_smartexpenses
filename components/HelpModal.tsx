import React from 'react';
import { X, Sparkles, PieChart, Database, WifiOff, Users, ArrowRightLeft } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <h2 className="text-3xl font-bold text-white relative z-10">How It Works</h2>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Add Expenses Easily</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Type naturally in the "Quick Add" box. Try <strong>"Lunch 150"</strong> or <strong>"Taxi 300"</strong>. 
                Our AI automatically detects the description and amount. It even auto-selects the category if you are online!
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Manage Categories</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Tap the <strong>Edit icon</strong> inside the category dropdown to open the Category Manager. 
                You can create custom categories, set monthly budget limits, and change colors.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Track Debts (Lending)</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Switch to the <strong>Lending Tab</strong> to track money you lent to friends or borrowed from them.
                Mark them as "Settled" when the money is returned. It keeps your personal expenses separate from debts.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4. Visualize & Analyze</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                The <strong>Stats Card</strong> shows your monthly total and daily average. 
                Click "Analyze" to get a fun, AI-generated tip about your spending habits.
                Use the <strong>Charts</strong> to travel back in time to view previous months.
              </p>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <button 
            onClick={onClose}
            className="w-full bg-gray-900 dark:bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Got it, let's start!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;