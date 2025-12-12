export interface Category {
  id: string;
  name: string;
  color: string;
  budgetLimit?: number; // Monthly limit in currency
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
  categoryId: string; // Reference to Category.id
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  type: 'lent' | 'borrowed'; // 'lent' = they owe me, 'borrowed' = I owe them
  date: string;
  isSettled: boolean;
  notes?: string;
}

export interface User {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  photoUrl?: string;
}

export interface MonthlyStats {
  total: number;
  byCategory: { name: string; value: number; color: string; budget?: number }[];
}

export type Theme = 'light' | 'dark' | 'system';
