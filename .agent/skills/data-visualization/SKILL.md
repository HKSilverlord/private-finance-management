---
name: data-visualization
description: Chart and data visualization patterns using Recharts in the finance app — weekly expense charts, debt progress, financial health gauges, and dashboard KPI cards.
---

# Data Visualization — Recharts + Dashboard Components

## Overview

This project uses **Recharts v3** for charting, combined with shadcn/ui cards for KPI metrics. All visualizations are client-side components.

---

## Chart Library

| Package | Version | Usage |
|---------|---------|-------|
| `recharts` | 3.8.x | Bar charts, line charts, pie charts |
| `lucide-react` | 0.577.x | Icons for stats cards |

---

## Existing Dashboard Components

### Stats Card (`src/components/dashboard/stats-card.tsx`)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}
```

### Weekly Chart (`src/components/dashboard/weekly-chart.tsx`)

Bar chart showing daily expenses grouped by week.

### Debt Progress (`src/components/dashboard/debt-progress.tsx`)

Progress bars showing debt payoff status using the `Progress` component.

### Financial Health (`src/components/dashboard/financial-health.tsx`)

Financial health score based on income vs expense ratios.

### Quick Add Expense (`src/components/dashboard/quick-add-expense.tsx`)

Inline expense entry form on the dashboard.

---

## Recharts Patterns

### Bar Chart (Weekly Expenses)

```tsx
'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export function WeeklyChart({ data }: { data: WeeklyData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiêu tuần này</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={formatCompact} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatCurrency(value), '']}
            />
            <Bar
              dataKey="morning"
              name="Sáng"
              fill="hsl(200 80% 60%)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="afternoon"
              name="Trưa"
              fill="hsl(150 60% 50%)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="evening"
              name="Tối"
              fill="hsl(270 60% 60%)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Line Chart (Monthly Trend)

```tsx
import { LineChart, Line, Area, AreaChart } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={monthlyData}>
    <defs>
      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="hsl(150 60% 50%)" stopOpacity={0.3} />
        <stop offset="95%" stopColor="hsl(150 60% 50%)" stopOpacity={0} />
      </linearGradient>
    </defs>
    <Area
      type="monotone"
      dataKey="income"
      stroke="hsl(150 60% 50%)"
      fill="url(#colorIncome)"
    />
    <Line
      type="monotone"
      dataKey="expenses"
      stroke="hsl(0 70% 60%)"
      strokeDasharray="5 5"
    />
  </AreaChart>
</ResponsiveContainer>
```

---

## Color Palette for Charts

| Semantic | HSL | Usage |
|----------|-----|-------|
| Income | `hsl(150 60% 50%)` | Income bars/lines |
| Expenses | `hsl(0 70% 60%)` | Expense bars/lines |
| Morning | `hsl(200 80% 60%)` | Sáng expenses |
| Afternoon | `hsl(150 60% 50%)` | Trưa expenses |
| Evening | `hsl(270 60% 60%)` | Tối expenses |
| Debt | `hsl(30 80% 55%)` | Debt payments |
| Balance | `hsl(210 80% 55%)` | Net balance |

---

## KPI Card Layout

```tsx
{/* Dashboard grid */}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard
    title="Tổng thu nhập"
    value={formatCurrency(income)}
    icon={TrendingUp}
    trend="up"
    description="+12% so với tháng trước"
  />
  <StatsCard
    title="Tổng chi tiêu"
    value={formatCurrency(expenses)}
    icon={ShoppingCart}
    trend="down"
    description="-5% so với tháng trước"
  />
  <StatsCard
    title="Số dư"
    value={formatCurrency(balance)}
    icon={Wallet}
    trend="neutral"
  />
  <StatsCard
    title="Nợ còn lại"
    value={formatCurrency(debt)}
    icon={CreditCard}
    trend="down"
    description="Trả xong trong 6 tháng"
  />
</div>
```

---

## Formatting Helpers

```typescript
// Full currency format
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

// Compact (for Y-axis)
const formatCompact = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
};
```

---

## Rules

- ✅ Always wrap charts in `<ResponsiveContainer>`
- ✅ Use HSL colors that work with both light/dark themes
- ✅ All chart components must be `'use client'`
- ✅ Format VND with zero decimal places
- ✅ Use stacked bars for time-of-day breakdown
- ❌ Don't use inline pixel dimensions for charts
- ❌ Don't use hex colors (use HSL for theme compatibility)
