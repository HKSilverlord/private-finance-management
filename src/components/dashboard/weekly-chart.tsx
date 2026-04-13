'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrencyShort } from '@/utils/format';

interface WeeklyData {
  week: string;
  Sang: number;
  Trua: number;
  Toi: number;
  total: number;
}

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chi tieu theo tuan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrencyShort(Number(value))}
              />
              <Tooltip
                formatter={(value) => formatCurrencyShort(Number(value ?? 0))}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Sang" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Trua" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Toi" stackId="a" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
