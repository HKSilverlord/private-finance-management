---
name: supabase-nextjs
description: Supabase integration with Next.js SSR — client setup (browser/server/middleware), auth flows, database queries, RLS policies, and migration patterns for the expense management app.
---

# Supabase + Next.js Integration

## Overview

This project uses **Supabase** as its backend with:
- `@supabase/ssr` for SSR-compatible auth
- `@supabase/supabase-js` for database operations
- Row Level Security (RLS) for authorization
- PostgreSQL with typed schema

---

## Client Setup

### Three Client Types

| Client | Location | When to Use |
|--------|----------|-------------|
| **Browser** | `src/lib/supabase/client.ts` | Client components (`'use client'`) |
| **Server** | `src/lib/supabase/server.ts` | Server components, Route Handlers |
| **Middleware** | `src/lib/supabase/middleware.ts` | Auth session refresh |

### Browser Client (Client Components)

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client (Server Components)

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

---

## Database Schema (Core Tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (name, role, household link) |
| `households` | Family/household groups |
| `income_sources` | Income source definitions |
| `monthly_incomes` | Monthly income records |
| `debts` | Credit cards, loans, installments |
| `debt_payments` | Monthly debt payment tracking |
| `fixed_expenses` | Recurring fixed expenses (rent, utilities) |
| `fixed_expense_payments` | Fixed expense payment records |
| `daily_expenses` | Daily spending (food, transport, shopping) |

### Key Types (`src/types/database.ts`)

```typescript
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
}
```

---

## Query Patterns

### Select with Joins

```typescript
const supabase = createClient();

// Get income sources with monthly data
const { data, error } = await supabase
  .from('monthly_incomes')
  .select('*, income_source:income_sources(*)')
  .eq('household_id', householdId)
  .gte('month', startDate)
  .lte('month', endDate)
  .order('month', { ascending: true });
```

### Insert

```typescript
const { error } = await supabase
  .from('daily_expenses')
  .insert({
    household_id: householdId,
    user_id: userId,
    date: new Date().toISOString().split('T')[0],
    time_of_day: 'Trưa',
    amount: 150000,
    category: 'food',
    note: 'Cơm trưa',
  });
```

### Upsert

```typescript
const { error } = await supabase
  .from('debt_payments')
  .upsert({
    debt_id: debtId,
    month: '2026-04-01',
    amount: 5000000,
    is_paid: true,
    paid_at: new Date().toISOString(),
  }, { onConflict: 'debt_id,month' });
```

### Aggregate with RPC

```typescript
// Use stored functions for complex aggregations
const { data } = await supabase
  .rpc('get_monthly_summary', {
    p_household_id: householdId,
    p_month: '2026-04-01'
  });
```

---

## Authentication Flow

### Sign In

```typescript
const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### Sign Up (with profile creation)

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: name } // Profile created via trigger
  }
});
```

### Get Current User (Server)

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
```

- `NEXT_PUBLIC_` prefix = available in browser
- Never use `service_role` key in frontend

---

## Migrations

### Location

```
supabase/
├── migrations/
│   └── 001_create_tables.sql    # Full schema
└── seed/
    └── 002_import_excel_data.sql  # Data import
```

### Migration Rules

1. Write idempotent SQL (`CREATE TABLE IF NOT EXISTS`)
2. Always include RLS policies
3. Add proper indexes for frequent queries
4. Apply via Supabase Dashboard SQL Editor

---

## Error Handling

```typescript
const { data, error } = await supabase.from('table').select('*');

if (error) {
  console.error('Database error:', error.message);
  // Show user-friendly message, not raw error
  throw new Error('Không thể tải dữ liệu');
}

return data;
```

---

## Security Rules

- ✅ RLS enabled on all tables
- ✅ Credentials in `.env.local` (gitignored)
- ✅ Browser client uses anon key only
- ✅ Server client handles session cookies
- ❌ Never expose service_role key
- ❌ Never disable RLS
- ❌ Never bypass auth checks
