// Database types for Supabase

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'owner' | 'member';
  household_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeSource {
  id: string;
  household_id: string;
  name: string;
  default_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlyIncome {
  id: string;
  household_id: string;
  income_source_id: string;
  amount: number;
  month: string; // Date as ISO string (first day of month)
  note: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  income_source?: IncomeSource;
}

export interface Debt {
  id: string;
  household_id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'installment';
  total_amount: number;
  monthly_payment: number;
  interest_rate: number;
  due_day: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DebtPayment {
  id: string;
  debt_id: string;
  month: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  debt?: Debt;
}

export interface FixedExpense {
  id: string;
  household_id: string;
  name: string;
  amount: number;
  due_day: number | null;
  category: 'rent' | 'utilities' | 'subscription' | 'other';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FixedExpensePayment {
  id: string;
  fixed_expense_id: string;
  month: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
  // Joined
  fixed_expense?: FixedExpense;
}

export type TimeOfDay = 'Sáng' | 'Trưa' | 'Tối';
export type ExpenseCategory = 'food' | 'transport' | 'shopping' | 'other';

export interface DailyExpense {
  id: string;
  household_id: string;
  user_id: string | null;
  date: string;
  time_of_day: TimeOfDay;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// Summary types
export interface MonthlySummary {
  month: string;
  total_income: number;
  total_daily_expenses: number;
  total_debt_payments: number;
  total_fixed_expenses: number;
  balance: number;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  total: number;
  by_time_of_day: {
    'Sáng': number;
    'Trưa': number;
    'Tối': number;
  };
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      households: {
        Row: Household;
        Insert: Omit<Household, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Household, 'id' | 'created_at' | 'updated_at'>>;
      };
      income_sources: {
        Row: IncomeSource;
        Insert: Omit<IncomeSource, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<IncomeSource, 'id' | 'created_at' | 'updated_at'>>;
      };
      monthly_incomes: {
        Row: MonthlyIncome;
        Insert: Omit<MonthlyIncome, 'id' | 'created_at' | 'updated_at' | 'income_source'>;
        Update: Partial<Omit<MonthlyIncome, 'id' | 'created_at' | 'updated_at' | 'income_source'>>;
      };
      debts: {
        Row: Debt;
        Insert: Omit<Debt, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Debt, 'id' | 'created_at' | 'updated_at'>>;
      };
      debt_payments: {
        Row: DebtPayment;
        Insert: Omit<DebtPayment, 'id' | 'created_at' | 'updated_at' | 'debt'>;
        Update: Partial<Omit<DebtPayment, 'id' | 'created_at' | 'updated_at' | 'debt'>>;
      };
      fixed_expenses: {
        Row: FixedExpense;
        Insert: Omit<FixedExpense, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FixedExpense, 'id' | 'created_at' | 'updated_at'>>;
      };
      fixed_expense_payments: {
        Row: FixedExpensePayment;
        Insert: Omit<FixedExpensePayment, 'id' | 'created_at' | 'fixed_expense'>;
        Update: Partial<Omit<FixedExpensePayment, 'id' | 'created_at' | 'fixed_expense'>>;
      };
      daily_expenses: {
        Row: DailyExpense;
        Insert: Omit<DailyExpense, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DailyExpense, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
