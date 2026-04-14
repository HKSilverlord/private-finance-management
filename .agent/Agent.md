# Agent.md — Quản Lý Chi Phí (Personal Finance Manager)

> **Last Updated**: 2026-04-13
> **Maintainer**: Tuấn Anh @ ESUTECH

---

## 🎯 Project Identity

**Quản Lý Chi Phí** is a personal/household finance management web application for Vietnamese families. It tracks income, daily expenses (by meal-time), debts, and fixed costs to provide clear financial health visibility.

**Core Functions**:
- 📊 **Dashboard** — Monthly summary, KPI stats cards, weekly expense charts
- 💰 **Income Management** — Multiple income sources per household
- 🛒 **Daily Expenses** — Track spending by time-of-day (Sáng/Trưa/Tối) and category
- 💳 **Debt Tracking** — Credit cards, loans, installments with payoff progress
- 🏠 **Fixed Expenses** — Rent, utilities, subscriptions tracking
- 📈 **Financial Health** — Expense ratios, savings rate, health score
- 🔐 **Multi-tenant** — Household-scoped data with RLS

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.x |
| **Language** | TypeScript | 5.x (strict) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | 4.x |
| **UI Library** | shadcn/ui v4 (13 components) | 4.1.x |
| **Backend** | Supabase (PostgreSQL) | SDK 2.99.x |
| **Auth** | Supabase Auth + `@supabase/ssr` | 0.9.x |
| **Charts** | Recharts | 3.8.x |
| **Icons** | Lucide React | 0.577.x |
| **Dates** | date-fns | 4.1.x |
| **Animations** | tw-animate-css | 1.4.x |
| **Class Utils** | clsx + tailwind-merge + CVA | Latest |

---

## 📂 Project Structure

```
quanlychiphi-app/
├── .agent/                      # AI Agent configuration
│   ├── Agent.md                # ← This file
│   └── skills/                 # Project-specific skills (8 skills)
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth layout group
│   │   ├── (dashboard)/        # Dashboard layout (Sidebar + Header)
│   │   │   ├── layout.tsx      # Sidebar + Header wrapper
│   │   │   ├── debts/          # Debt management page
│   │   │   ├── expenses/       # Daily expenses page
│   │   │   ├── overview/       # Dashboard overview page
│   │   │   └── settings/       # Settings page
│   │   ├── dashboard/          # Dashboard redirect
│   │   ├── income/             # Income management page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Root page (redirect)
│   │   └── globals.css         # Tailwind v4 + shadcn theme (OKLCH)
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (13 components)
│   │   │   ├── button.tsx, card.tsx, dialog.tsx, table.tsx, ...
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── stats-card.tsx, weekly-chart.tsx, debt-progress.tsx, ...
│   │   ├── forms/              # Form components (empty — to build)
│   │   └── layout/             # Layout components
│   │       ├── sidebar.tsx     # App sidebar navigation
│   │       └── header.tsx      # Top header bar
│   │
│   ├── lib/
│   │   ├── supabase/           # Supabase clients (browser/server/middleware)
│   │   └── utils.ts            # cn() utility function
│   │
│   ├── hooks/                  # Custom React hooks (empty — to build)
│   ├── types/
│   │   └── database.ts         # Full typed schema (9 tables)
│   ├── utils/                  # Utility functions
│   └── middleware.ts           # Auth session middleware
│
├── supabase/
│   ├── migrations/
│   │   └── 001_create_tables.sql  # Full schema + RLS + triggers
│   └── seed/
│       └── 002_import_excel_data.sql  # Excel data import
│
├── AGENTS.md                   # Next.js agent rules (breaking changes warning)
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # Tailwind PostCSS plugin
├── tsconfig.json               # TypeScript config (strict, @/* alias)
└── package.json                # Dependencies
```

---

## 🎨 Design System

### Theming (OKLCH Color Space)

The app uses **OKLCH-based CSS variables** for perceptually uniform theming with full dark mode support:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | White | Near-black | Page background |
| `--foreground` | Near-black | Near-white | Primary text |
| `--card` | White | Dark gray | Card surfaces |
| `--primary` | Dark neutral | Light neutral | Buttons, accents |
| `--muted` | Light gray | Dark gray | Muted surfaces |
| `--destructive` | Red | Red (lighter) | Delete actions |
| `--border` | Gray | Translucent white | Borders |
| `--sidebar-primary` | Dark | Blue accent | Sidebar active |

### Typography

- **Font**: System sans-serif (`var(--font-sans)`)
- **Heading font**: Same as body (`var(--font-heading)`)

### shadcn/ui Components (13 installed)

`Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `DropdownMenu`, `Input`, `Label`, `Progress`, `Separator`, `Sheet`, `Table`, `Tabs`

---

## 🛠️ Skills Reference

### All 9 Project-Specific Skills

| # | Skill | Path | Covers |
|---|-------|------|--------|
| 1 | **nextjs-app-router** | `skills/nextjs-app-router/SKILL.md` | Next.js 16 App Router, routing, layouts, server/client components, middleware, path aliases |
| 2 | **supabase-nextjs** | `skills/supabase-nextjs/SKILL.md` | Three Supabase clients (browser/server/middleware), auth flows, query patterns, RLS, error handling |
| 3 | **shadcn-ui-components** | `skills/shadcn-ui-components/SKILL.md` | All 13 installed components, usage patterns, `cn()` utility, theming with OKLCH tokens |
| 4 | **tailwind-v4-theming** | `skills/tailwind-v4-theming/SKILL.md` | CSS-first config, OKLCH color system, dark mode, design tokens, custom variants |
| 5 | **finance-domain** | `skills/finance-domain/SKILL.md` | Data models, business rules, VND currency, calculation formulas, Vietnamese conventions |
| 6 | **data-visualization** | `skills/data-visualization/SKILL.md` | Recharts charts, KPI cards, chart colors, VND formatting, dashboard patterns |
| 7 | **database-schema** | `skills/database-schema/SKILL.md` | PostgreSQL schema, 9 tables, RLS policies, triggers, indexes, migration conventions |
| 8 | **scrollytelling-sticky-animations** | `skills/scrollytelling-sticky-animations/SKILL.md` | Scroll-driven landing pages, sticky pinned sections, Lenis smooth scrolling, GSAP ScrollTrigger scrub/pin, Framer Motion `whileInView` reveals, stagger animations, AOS, Intersection Observer, hero patterns, conversion-optimized section architecture, 2026 design trends |
| 9 | **eslint-code-quality** | `skills/eslint-code-quality/SKILL.md` | Next.js/React code quality, ESLint configurations, strict type checking, and standardizing formatting |

### Skill Selection Matrix

| When you need to... | Use this skill | Also consider |
|---------------------|---------------|---------------|
| Create/modify a page or route | **nextjs-app-router** | shadcn-ui-components |
| Fetch or mutate database data | **supabase-nextjs** | database-schema |
| Build or compose UI components | **shadcn-ui-components** | tailwind-v4-theming |
| Style components or customize theme | **tailwind-v4-theming** | shadcn-ui-components |
| Understand business rules or data models | **finance-domain** | database-schema |
| Create charts, graphs, or KPI cards | **data-visualization** | tailwind-v4-theming |
| Modify database schema or write SQL | **database-schema** | supabase-nextjs |
| Add authentication or authorization | **supabase-nextjs** | nextjs-app-router |
| Build a landing page / marketing site | **scrollytelling-sticky-animations** | tailwind-v4-theming, nextjs-app-router |
| Add scroll-triggered reveal animations | **scrollytelling-sticky-animations** | tailwind-v4-theming |
| Create sticky pinned scroll sections | **scrollytelling-sticky-animations** | — |
| Implement smooth scrolling | **scrollytelling-sticky-animations** | — |
| Write or fix linting/formatting issues | **eslint-code-quality** | nextjs-app-router |

---

## 🔧 Development

### Start Development

```bash
npm install
npm run dev      # http://localhost:3000
```

### Add shadcn Component

```bash
npx shadcn@latest add <component-name>
```

### Database Setup

1. Create Supabase project
2. Run `supabase/migrations/001_create_tables.sql` in SQL Editor
3. Copy `.env.local.example` → `.env.local` and fill in values

---

## 📋 Coding Standards

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `StatsCard.tsx` |
| Utility files | kebab-case | `format-currency.ts` |
| Types/interfaces | PascalCase | `DailyExpense` |
| shadcn components | kebab-case | `dropdown-menu.tsx` |
| DB tables | snake_case plural | `daily_expenses` |
| DB columns | snake_case | `household_id` |
| CSS variables | kebab-case | `--muted-foreground` |
| Route folders | kebab-case | `(dashboard)/expenses/` |

### TypeScript Rules

- `strict: true` — No `any` types
- Use `@/*` path alias for all imports
- Typed Supabase schema in `src/types/database.ts`
- Prefer `interface` over `type` for object shapes

### React Rules

- Functional components only
- Server components by default; `'use client'` only when needed
- Extract interactive parts into separate client components
- Use shadcn/ui components — don't reinvent primitives

### Styling Rules

- ✅ Use semantic color tokens (`bg-background`, `text-muted-foreground`)
- ✅ Use `cn()` for conditional/merged classes
- ✅ Standard spacing scale only (`p-4`, `gap-6`)
- ❌ No inline `style={{}}` for colors
- ❌ No `tailwind.config.js` (Tailwind v4 = CSS-first)
- ❌ No hardcoded colors (`bg-white` → `bg-background`)

---

## ⚠️ Known Issues & TODO

1. **Forms directory empty** — Form components need to be built
2. **Hooks directory empty** — Custom hooks need to be created
3. **Dark mode toggle** — CSS variables ready, UI toggle not yet implemented
4. **Mobile sidebar** — Uses `Sheet` component, may need refinement
5. **Planned features**: Debt CRUD, payment reminders, PDF export, PWA, family member invite

---

## 🔒 Security

- ✅ RLS enabled on all 9 tables
- ✅ Credentials in `.env.local` (gitignored)
- ✅ Three separate Supabase clients (browser/server/middleware)
- ✅ Middleware protects all routes except static assets
- ✅ Household-scoped data isolation
- ❌ Never use service_role key in frontend
- ❌ Never disable RLS
- ❌ Never commit `.env` files

---

## 📖 Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/app/(dashboard)/layout.tsx` | Dashboard layout (Sidebar + Header + main) |
| `src/app/globals.css` | Tailwind v4 theme (OKLCH colors, dark mode) |
| `src/components/layout/sidebar.tsx` | Navigation sidebar |
| `src/components/layout/header.tsx` | Top header bar |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/utils.ts` | `cn()` class merger utility |
| `src/types/database.ts` | Full typed schema (9 tables) |
| `src/middleware.ts` | Auth session protection |
| `components.json` | shadcn/ui configuration |

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
```

### Routes

| Path | Layout | Page |
|------|--------|------|
| `/` | — | Root redirect |
| `/login` | Auth | Login page |
| `/register` | Auth | Registration page |
| `/dashboard` | Dashboard | Redirect to overview |
| `/(dashboard)/overview` | Dashboard | KPI cards, charts, quick-add |
| `/(dashboard)/expenses` | Dashboard | Daily expense tracking |
| `/(dashboard)/debts` | Dashboard | Debt management |
| `/(dashboard)/settings` | Dashboard | App settings |
| `/income` | — | Income management |
