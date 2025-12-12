import { Category } from './types';

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_LOCALE = 'en-IN';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Dining', color: '#ef4444', isDefault: true },
  { id: 'cat_transport', name: 'Transportation', color: '#f97316', isDefault: true },
  { id: 'cat_utilities', name: 'Utilities', color: '#eab308', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#8b5cf6', isDefault: true },
  { id: 'cat_shopping', name: 'Shopping', color: '#ec4899', isDefault: true },
  { id: 'cat_health', name: 'Health', color: '#06b6d4', isDefault: true },
  { id: 'cat_housing', name: 'Housing', color: '#3b82f6', isDefault: true },
  { id: 'cat_other', name: 'Other', color: '#64748b', isDefault: true },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
