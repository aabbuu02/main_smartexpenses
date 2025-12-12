import { Expense, Category, Theme, Debt, User } from '../types';
import { DEFAULT_CATEGORIES, CURRENCY_SYMBOL } from '../constants';

const EXPENSE_KEY = 'smartspend_expenses';
const CATEGORY_KEY = 'smartspend_categories';
const THEME_KEY = 'smartspend_theme';
const DEBT_KEY = 'smartspend_debts';
const USER_KEY = 'smartspend_user';

// --- Expenses ---
export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Failed to save expenses", error);
  }
};

export const loadExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(EXPENSE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

// --- Debts ---
export const saveDebts = (debts: Debt[]): void => {
  try {
    localStorage.setItem(DEBT_KEY, JSON.stringify(debts));
  } catch (error) {
    console.error("Failed to save debts", error);
  }
};

export const loadDebts = (): Debt[] => {
  try {
    const data = localStorage.getItem(DEBT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

// --- Categories ---
export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to save categories", error);
  }
};

export const loadCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(CATEGORY_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (error) {
    return DEFAULT_CATEGORIES;
  }
};

// --- Theme ---
export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): Theme => {
  return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
};

// --- User Session ---
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const loadUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

// --- Export ---
export const exportExpensesToCSV = (expenses: Expense[], categories: Category[], customFileName?: string) => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Currency'];
  
  const rows = expenses.map(e => {
    const catName = categories.find(c => c.id === e.categoryId)?.name || 'Unknown';
    // Escape quotes in description
    const desc = `"${e.description.replace(/"/g, '""')}"`;
    return [e.date, desc, catName, e.amount, CURRENCY_SYMBOL].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\n" 
    + rows.join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  
  const fileName = customFileName || `smartspend_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute("download", fileName);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};