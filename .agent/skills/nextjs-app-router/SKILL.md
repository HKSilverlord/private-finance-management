---
name: nextjs-app-router
description: Next.js 16 App Router patterns — file-based routing, server/client components, layouts, middleware, data fetching, and TypeScript conventions for this finance management application.
---

# Next.js 16 App Router — Project Patterns

## Overview

This project uses **Next.js 16** with the App Router (`src/app/`), server-side rendering, and Supabase SSR for authentication.

> ⚠️ **CRITICAL**: This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing code. APIs, conventions, and file structure may differ from training data.

---

## File-Based Routing

### Route Structure

```
src/app/
├── (auth)/              # Auth layout group (login, register)
├── (dashboard)/         # Dashboard layout group
│   ├── layout.tsx       # Sidebar + Header wrapper
│   ├── debts/           # /debts page
│   ├── expenses/        # /expenses page
│   ├── overview/        # /overview (dashboard) page
│   └── settings/        # /settings page
├── dashboard/           # /dashboard redirect
├── income/              # /income page
├── login/               # /login page
├── register/            # /register page
├── layout.tsx           # Root layout (fonts, metadata)
├── page.tsx             # Root page (redirect)
└── globals.css          # Tailwind v4 + shadcn theme
```

### Route Groups

- `(dashboard)` — Wraps pages with `Sidebar` + `Header` layout
- `(auth)` — Separate layout for login/register (no sidebar)

### Creating a New Page

```tsx
// src/app/(dashboard)/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Page Title</h1>
      {/* Page content */}
    </div>
  );
}
```

---

## Server vs Client Components

### Rules

| Component Type | Directive | When to Use |
|---------------|-----------|-------------|
| **Server** | (default) | Data fetching, SEO, static content |
| **Client** | `'use client'` | Interactivity, state, browser APIs |

### Pattern: Server Page + Client Component

```tsx
// src/app/(dashboard)/expenses/page.tsx (Server)
import { ExpenseForm } from '@/components/forms/expense-form';

export default async function ExpensesPage() {
  // Server-side data fetching possible here
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chi tiêu</h1>
      <ExpenseForm /> {/* Client component */}
    </div>
  );
}
```

```tsx
// src/components/forms/expense-form.tsx (Client)
'use client';

import { useState } from 'react';

export function ExpenseForm() {
  const [amount, setAmount] = useState('');
  // Interactive form logic
}
```

---

## Layout Pattern

### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)

```tsx
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
```

---

## Middleware (Auth Protection)

Located at `src/middleware.ts`:

```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Path Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Usage

```typescript
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
```

---

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| Use `pages/` directory | Use `src/app/` (App Router) |
| Import `next/router` | Use `next/navigation` |
| Put `'use client'` on pages | Keep pages as server components, extract client parts |
| Use `getServerSideProps` | Use async server components or Route Handlers |
| Create API routes for Supabase calls | Use Supabase client directly in server components |
