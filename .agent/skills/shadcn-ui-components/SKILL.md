---
name: shadcn-ui-components
description: shadcn/ui v4 component library patterns — using, customizing, and composing primitives from the installed component set for consistent, accessible UI across the finance app.
---

# shadcn/ui Component Library

## Overview

This project uses **shadcn/ui v4** as its component library, built on top of:
- `@base-ui/react` (headless primitives)
- `class-variance-authority` (variant management)
- `tailwind-merge` (class merging)
- `clsx` (conditional classes)
- Tailwind CSS v4

---

## Installed Components

| Component | File | Usage |
|-----------|------|-------|
| `Avatar` | `ui/avatar.tsx` | User avatars in sidebar/header |
| `Badge` | `ui/badge.tsx` | Status labels, category tags |
| `Button` | `ui/button.tsx` | All interactive buttons |
| `Card` | `ui/card.tsx` | Content containers, stats cards |
| `Dialog` | `ui/dialog.tsx` | Modal dialogs for forms |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Context menus, user menu |
| `Input` | `ui/input.tsx` | Text inputs in forms |
| `Label` | `ui/label.tsx` | Form field labels |
| `Progress` | `ui/progress.tsx` | Debt payoff progress bars |
| `Separator` | `ui/separator.tsx` | Visual dividers |
| `Sheet` | `ui/sheet.tsx` | Mobile sidebar slide-out |
| `Table` | `ui/table.tsx` | Data tables for expenses/income |
| `Tabs` | `ui/tabs.tsx` | Section switching (overview, charts) |

### Component Location

All shadcn components live in `src/components/ui/`.

---

## Adding New Components

Use the shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

The config is in `components.json`:

```json
{
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## Component Usage Patterns

### Button Variants

```tsx
import { Button } from '@/components/ui/button';

// Variants: default, destructive, outline, secondary, ghost, link
<Button variant="default">Lưu</Button>
<Button variant="destructive">Xóa</Button>
<Button variant="outline">Hủy</Button>
<Button variant="ghost" size="icon"><Settings /></Button>
```

### Card Pattern (Stats Card)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Tổng chi tiêu
    </CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{formatCurrency(total)}</div>
    <p className="text-xs text-muted-foreground mt-1">
      +20% so với tháng trước
    </p>
  </CardContent>
</Card>
```

### Dialog (Modal Form)

```tsx
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Thêm chi tiêu</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Thêm chi tiêu mới</DialogTitle>
      <DialogDescription>
        Nhập thông tin chi tiêu hàng ngày
      </DialogDescription>
    </DialogHeader>
    <ExpenseForm />
  </DialogContent>
</Dialog>
```

### Table Pattern

```tsx
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ngày</TableHead>
      <TableHead>Mô tả</TableHead>
      <TableHead className="text-right">Số tiền</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {expenses.map((expense) => (
      <TableRow key={expense.id}>
        <TableCell>{formatDate(expense.date)}</TableCell>
        <TableCell>{expense.note}</TableCell>
        <TableCell className="text-right font-medium">
          {formatCurrency(expense.amount)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Tabs Pattern

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="overview" className="space-y-4">
  <TabsList>
    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
    <TabsTrigger value="expenses">Chi tiêu</TabsTrigger>
    <TabsTrigger value="income">Thu nhập</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <OverviewCards />
  </TabsContent>
  <TabsContent value="expenses">
    <ExpenseTable />
  </TabsContent>
</Tabs>
```

---

## Theming (CSS Variables)

The theme is defined in `src/app/globals.css` using OKLCH color space:

### Light Mode (`:root`)
- `--background`: White
- `--foreground`: Near-black
- `--primary`: Dark neutral
- `--destructive`: Red
- `--muted`: Light gray

### Dark Mode (`.dark`)
- `--background`: Near-black
- `--foreground`: Near-white
- `--primary`: Light neutral
- `--sidebar-primary`: Blue accent

### Using Theme Colors

```tsx
// Always use semantic color tokens
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="border-border" />
<div className="text-destructive" />
```

---

## Utility Functions

### `cn()` — Class Name Merger

Located at `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg border p-4',
  isActive && 'border-primary bg-primary/5',
  className // allow parent override
)} />
```

---

## Custom Dashboard Components

Located in `src/components/dashboard/`:

| Component | Purpose |
|-----------|---------|
| `stats-card.tsx` | KPI stat card with icon |
| `weekly-chart.tsx` | Weekly expense bar chart |
| `debt-progress.tsx` | Debt payoff progress |
| `financial-health.tsx` | Financial health score |
| `quick-add-expense.tsx` | Inline expense form |

---

## Rules

- ✅ Always import from `@/components/ui/`
- ✅ Use `cn()` for conditional/merged classes
- ✅ Use semantic color tokens (`bg-primary`, `text-muted-foreground`)
- ✅ Keep components composable (use `asChild` pattern)
- ❌ Don't modify shadcn source files unless extending variants
- ❌ Don't use hardcoded color values in components
- ❌ Don't mix shadcn with other UI libraries
