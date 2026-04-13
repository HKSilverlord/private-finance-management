---
name: finance-domain
description: Domain knowledge for the personal/household finance management app — data models, business rules, calculation formulas, Vietnamese financial conventions (VND), and expense categorization patterns.
---

# Finance Domain Knowledge

## Overview

**Quản Lý Chi Phí** is a personal/household finance management application designed for Vietnamese households. It tracks income, daily expenses, debts, and fixed costs to provide financial health visibility.

---

## Core Concepts

### Household Model

A **household** is the top-level grouping unit. All financial data belongs to a household.

```
Household
├── Members (Profiles)
├── Income Sources → Monthly Incomes
├── Debts → Debt Payments
├── Fixed Expenses → Fixed Expense Payments
└── Daily Expenses
```

### User Roles

| Role | Permissions |
|------|------------|
| `owner` | Full CRUD on all household data |
| `member` | Can add expenses, view reports |

---

## Data Models

### Income

**Income Sources** (recurring): Salary, freelance, gifts, etc.

**Monthly Incomes**: Specific amount per source per month.

```typescript
// Key fields
{
  income_source_id: string;  // FK to income_sources
  amount: number;            // VND amount
  month: string;             // '2026-04-01' (first day of month)
  note: string | null;
}
```

### Expenses

#### Daily Expenses

Tracked by **time of day** (Vietnamese meal-based pattern):

| Time | Vietnamese | Typical |
|------|-----------|---------|
| `Sáng` | Morning | Breakfast, morning coffee |
| `Trưa` | Afternoon | Lunch, midday shopping |
| `Tối` | Evening | Dinner, evening activities |

#### Categories

| Category | Vietnamese | Examples |
|----------|-----------|----------|
| `food` | Thực phẩm | Groceries, meals, drinks |
| `transport` | Di chuyển | Gas, taxi, parking |
| `shopping` | Mua sắm | Clothing, electronics |
| `other` | Khác | Miscellaneous |

#### Fixed Expenses

Recurring monthly costs:

| Category | Examples |
|----------|---------|
| `rent` | House/apartment rent |
| `utilities` | Electric, water, internet |
| `subscription` | Netflix, gym, insurance |
| `other` | Other recurring costs |

### Debts

Three debt types:

| Type | Vietnamese | Description |
|------|-----------|-------------|
| `credit_card` | Thẻ tín dụng | Credit card balance |
| `loan` | Vay | Personal/bank loan |
| `installment` | Trả góp | Installment purchase |

Key fields:
- `total_amount` — Original debt amount
- `monthly_payment` — Expected monthly payment
- `interest_rate` — Annual interest rate (%)
- `due_day` — Day of month payment is due

---

## Calculations

### Monthly Summary

```typescript
interface MonthlySummary {
  month: string;
  total_income: number;          // Sum of all income sources
  total_daily_expenses: number;  // Sum of daily expenses
  total_debt_payments: number;   // Sum of debt payments
  total_fixed_expenses: number;  // Sum of fixed expense payments
  balance: number;               // income - (daily + debt + fixed)
}
```

### Balance Formula

```
Balance = Total Income − (Daily Expenses + Debt Payments + Fixed Expenses)
```

### Weekly Summary

```typescript
interface WeeklySummary {
  week_start: string;
  week_end: string;
  total: number;
  by_time_of_day: {
    'Sáng': number;
    'Trưa': number;
    'Tối': number;
  };
}
```

### Financial Health Score

Based on:
1. **Expense Ratio** — daily expenses / income (< 50% is good)
2. **Debt Ratio** — debt payments / income (< 30% is good)
3. **Savings Rate** — balance / income (> 20% is good)

---

## Currency

All amounts are in **VND (Vietnamese Dong)**:

```typescript
// Formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0, // No decimals for VND
  }).format(amount);
};

// Example: 1500000 → "₫1.500.000"
```

### Typical Ranges (VND)

| Category | Typical Range |
|----------|--------------|
| Monthly income | 10,000,000 – 50,000,000 |
| Daily food expense | 50,000 – 300,000 |
| Monthly rent | 3,000,000 – 15,000,000 |
| Credit card payment | 1,000,000 – 10,000,000 |

---

## Date Conventions

- **Month format**: `'2026-04-01'` (ISO date, always 1st of month)
- **Date format**: `'2026-04-13'` (ISO date)
- **Display format**: `'13/04/2026'` (Vietnamese DD/MM/YYYY)
- Use `date-fns` for date calculations

```typescript
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';

format(new Date(), 'dd/MM/yyyy', { locale: vi }); // "13/04/2026"
```

---

## Business Rules

1. All financial data is **household-scoped** (multi-tenant)
2. Income sources can be **active/inactive** (`is_active` flag)
3. Debts can be **active/inactive** — inactive = fully paid
4. Fixed expenses track if each monthly payment `is_paid`
5. Daily expenses are **immutable once created** (soft-delete planned)
6. Monthly summaries are **computed**, not stored
7. Only household `owner` can modify income sources and debts
