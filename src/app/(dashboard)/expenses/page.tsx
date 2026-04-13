import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, formatMonth, getFirstDayOfMonth } from '@/utils/format';
import { DailyExpense } from '@/types/database';
import { Sun, CloudSun, Moon } from 'lucide-react';

const timeIcons = {
  'SÃ¡ng': Sun,
  'TrÆ°a': CloudSun,
  'Tá»‘i': Moon,
};

const timeColors = {
  'SÃ¡ng': 'bg-yellow-100 text-yellow-800',
  'TrÆ°a': 'bg-orange-100 text-orange-800',
  'Tá»‘i': 'bg-indigo-100 text-indigo-800',
};

export default async function ExpensesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('household_id')
    .eq('id', user.id)
    .single();

  if (!profile?.household_id) {
    return <div>Dang tai...</div>;
  }

  const currentMonth = getFirstDayOfMonth();
  const today = new Date().toISOString().split('T')[0];

  const { data: expenses } = await supabase
    .from('daily_expenses')
    .select('*')
    .eq('household_id', profile.household_id)
    .gte('date', currentMonth)
    .lte('date', today)
    .order('date', { ascending: false })
    .order('time_of_day');

  const groupedByDate = (expenses ?? []).reduce<Record<string, DailyExpense[]>>((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(expense as DailyExpense);
    return acc;
  }, {});

  const totalByTime = {
    'SÃ¡ng': expenses?.filter((expense) => expense.time_of_day === 'SÃ¡ng').reduce((sum, expense) => sum + expense.amount, 0) ?? 0,
    'TrÆ°a': expenses?.filter((expense) => expense.time_of_day === 'TrÆ°a').reduce((sum, expense) => sum + expense.amount, 0) ?? 0,
    'Tá»‘i': expenses?.filter((expense) => expense.time_of_day === 'Tá»‘i').reduce((sum, expense) => sum + expense.amount, 0) ?? 0,
  };
  const total = Object.values(totalByTime).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chi tieu hang ngay</h1>
        <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tong chi tieu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(total)}</div>
          </CardContent>
        </Card>
        {(['SÃ¡ng', 'TrÆ°a', 'Tá»‘i'] as const).map((time) => {
          const Icon = timeIcons[time];
          return (
            <Card key={time}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {time}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalByTime[time])}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, dayExpenses]) => {
          const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

          return (
            <Card key={date}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{formatDate(date)}</CardTitle>
                  <span className="font-semibold">{formatCurrency(dayTotal)}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buoi</TableHead>
                      <TableHead>So tien</TableHead>
                      <TableHead>Ghi chu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayExpenses.map((expense) => {
                      const Icon = timeIcons[expense.time_of_day as keyof typeof timeIcons];
                      return (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={timeColors[expense.time_of_day as keyof typeof timeColors]}
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {expense.time_of_day}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {expense.note || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}

        {(!expenses || expenses.length === 0) && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Chua co chi tieu nao trong thang nay
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
