---
name: database-schema
description: PostgreSQL database schema, migration conventions, RLS policies, stored functions, and data seeding patterns for the household finance management database.
---

# Database Schema & Migrations

## Overview

The database runs on **Supabase (PostgreSQL)** with:
- UUID primary keys (auto-generated)
- Row Level Security (RLS) on all tables
- Trigger-based profile creation on signup
- Timestamped records (`created_at`, `updated_at`)

---

## Schema Overview

```
┌─────────────┐     ┌──────────────┐
│  profiles    │────▶│  households   │
│  (users)     │     │              │
└─────────────┘     └──────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌─────────────┐  ┌───────────┐   ┌──────────────┐
   │income_sources│  │  debts    │   │fixed_expenses │
   └─────────────┘  └───────────┘   └──────────────┘
          │                │                │
          ▼                ▼                ▼
   ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐
   │monthly_incomes│ │debt_payments │ │fixed_expense_payments│
   └──────────────┘ └──────────────┘ └────────────────────┘
                                              
                    ┌──────────────┐
                    │daily_expenses │
                    └──────────────┘
```

---

## Table Definitions

### `households`

```sql
CREATE TABLE households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `profiles`

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'member')),
  household_id UUID REFERENCES households(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `income_sources`

```sql
CREATE TABLE income_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  default_amount NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `daily_expenses`

```sql
CREATE TABLE daily_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('Sáng', 'Trưa', 'Tối')),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'shopping', 'other')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `debts`

```sql
CREATE TABLE debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'loan', 'installment')),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  monthly_payment NUMERIC NOT NULL DEFAULT 0,
  interest_rate NUMERIC DEFAULT 0,
  due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## RLS Policies Pattern

All tables follow the same pattern — users can only access their own household's data:

```sql
ALTER TABLE daily_expenses ENABLE ROW LEVEL SECURITY;

-- Select: user belongs to the household
CREATE POLICY "Users can view their household expenses"
  ON daily_expenses FOR SELECT
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  ));

-- Insert: user belongs to the household
CREATE POLICY "Users can insert to their household"
  ON daily_expenses FOR INSERT
  WITH CHECK (household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  ));

-- Update: user belongs to the household
CREATE POLICY "Users can update their household data"
  ON daily_expenses FOR UPDATE
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  ));

-- Delete: only owner
CREATE POLICY "Owners can delete"
  ON daily_expenses FOR DELETE
  USING (household_id IN (
    SELECT household_id FROM profiles
    WHERE id = auth.uid() AND role = 'owner'
  ));
```

---

## Triggers

### Auto-create Profile on Signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_household_id UUID;
BEGIN
  INSERT INTO households (name) VALUES ('Gia đình của ' || COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  RETURNING id INTO new_household_id;

  INSERT INTO profiles (id, full_name, role, household_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'owner', new_household_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON daily_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Indexes

```sql
-- Frequent queries by household + date
CREATE INDEX idx_daily_expenses_household_date
  ON daily_expenses(household_id, date DESC);

-- Monthly income lookups
CREATE INDEX idx_monthly_incomes_household_month
  ON monthly_incomes(household_id, month);

-- Debt payment lookups
CREATE INDEX idx_debt_payments_debt_month
  ON debt_payments(debt_id, month);
```

---

## Migration Conventions

### File Structure

```
supabase/
├── migrations/
│   ├── 001_create_tables.sql    # Initial schema
│   ├── 002_add_indexes.sql      # Performance indexes
│   └── 003_add_feature_x.sql    # Feature additions
└── seed/
    └── 002_import_excel_data.sql # Excel data import
```

### Writing Migrations

1. **Always idempotent**: `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE IF`
2. **Include RLS policies** for new tables
3. **Add indexes** for frequently queried columns
4. **Test in Supabase SQL Editor** before committing
5. **Document** any breaking changes

### Data Import Pattern

```sql
-- Replace UUIDs with actual values from your database
DO $$
DECLARE
  v_household_id UUID;
  v_income_source_id UUID;
BEGIN
  SELECT household_id INTO v_household_id
  FROM profiles LIMIT 1;

  INSERT INTO income_sources (household_id, name, default_amount)
  VALUES (v_household_id, 'Lương chồng', 25000000)
  RETURNING id INTO v_income_source_id;

  INSERT INTO monthly_incomes (household_id, income_source_id, amount, month)
  VALUES (v_household_id, v_income_source_id, 25000000, '2026-01-01');
END $$;
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Tables | `snake_case`, plural | `daily_expenses` |
| Columns | `snake_case` | `household_id`, `created_at` |
| Primary Key | `id` (UUID) | `gen_random_uuid()` |
| Foreign Key | `<table_singular>_id` | `debt_id`, `user_id` |
| Indexes | `idx_<table>_<columns>` | `idx_daily_expenses_household_date` |
| Triggers | Descriptive | `on_auth_user_created` |
| Functions | `snake_case` | `handle_new_user()` |
| Check constraints | Inline | `CHECK (amount >= 0)` |
