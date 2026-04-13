import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DebtProgress } from '@/components/dashboard/debt-progress';
import { QuickAddExpense } from '@/components/dashboard/quick-add-expense';
import { WeeklyChart } from '@/components/dashboard/weekly-chart';
import { FinancialHealth } from '@/components/dashboard/financial-health';
import { formatCurrency, formatMonth, getFirstDayOfMonth } from '@/utils/format';
import { Wallet, TrendingDown, CreditCard, PiggyBank } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, households(*)')
    .eq('id', user.id)
    .single();

  if (!profile?.household_id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Dang thiet lap tai khoan...</p>
      </div>
    );
  }

  const householdId = profile.household_id;
  const currentMonth = getFirstDayOfMonth();
  const today = new Date().toISOString().split('T')[0];

  const [
    { data: monthlyIncomes },
    { data: debts },
    { data: dailyExpenses },
    { data: fixedExpenses },
  ] = await Promise.all([
    supabase
      .from('monthly_incomes')
      .select('*, income_source:income_sources(*)')
      .eq('household_id', householdId)
      .eq('month', currentMonth),
    supabase
      .from('debts')
      .select('*, payments:debt_payments(*)')
      .eq('household_id', householdId)
      .eq('is_active', true),
    supabase
      .from('daily_expenses')
      .select('*')
      .eq('household_id', householdId)
      .gte('date', currentMonth)
      .lte('date', today),
    supabase
      .from('fixed_expenses')
      .select('*')
      .eq('household_id', householdId)
      .eq('is_active', true),
  ]);

  const totalIncome = monthlyIncomes?.reduce((sum, income) => sum + income.amount, 0) ?? 0;
  const totalDailyExpenses = dailyExpenses?.reduce((sum, expense) => sum + expense.amount, 0) ?? 0;
  const totalDebtPayments = debts?.reduce((sum, debt) => sum + debt.monthly_payment, 0) ?? 0;
  const totalFixedExpenses = fixedExpenses?.reduce((sum, expense) => sum + expense.amount, 0) ?? 0;
  const totalExpenses = totalDailyExpenses + totalDebtPayments + totalFixedExpenses;
  const balance = totalIncome - totalExpenses;

  const totalInterestPerMonth =
    debts?.reduce((sum, debt) => sum + debt.total_amount * debt.interest_rate / 100 / 12, 0) ?? 0;

  const weeklyData = [1, 2, 3, 4, 5].map((week) => {
    const weekExpenses =
      dailyExpenses?.filter((expense) => Math.ceil(new Date(expense.date).getDate() / 7) === week) ?? [];

    return {
      week: `Tuan ${week}`,
      Sang: weekExpenses
        .filter((expense) => expense.time_of_day === 'SÃ¡ng')
        .reduce((sum, expense) => sum + expense.amount, 0),
      Trua: weekExpenses
        .filter((expense) => expense.time_of_day === 'TrÆ°a')
        .reduce((sum, expense) => sum + expense.amount, 0),
      Toi: weekExpenses
        .filter((expense) => expense.time_of_day === 'Tá»‘i')
        .reduce((sum, expense) => sum + expense.amount, 0),
      total: weekExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tong quan</h1>
        <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Thu nhap"
          value={formatCurrency(totalIncome)}
          icon={Wallet}
          description="Tong thu nhap thang nay"
          valueClassName="text-green-600"
        />
        <StatsCard
          title="Chi tieu"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          description="Tong chi tieu thang nay"
          valueClassName="text-red-600"
        />
        <StatsCard
          title="Tra no"
          value={formatCurrency(totalDebtPayments)}
          icon={CreditCard}
          description={`${debts?.length ?? 0} khoan no`}
        />
        <StatsCard
          title="So du"
          value={formatCurrency(balance)}
          icon={PiggyBank}
          description={balance >= 0 ? 'Con du' : 'Thieu hut'}
          valueClassName={balance >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <FinancialHealth
            totalIncome={totalIncome}
            totalDebtPayments={totalDebtPayments}
            totalInterestPerMonth={totalInterestPerMonth}
            emergencyFund={0}
          />
          <WeeklyChart data={weeklyData} />
        </div>
        <div className="space-y-6">
          <QuickAddExpense householdId={householdId} />
          <DebtProgress debts={debts ?? []} currentMonth={currentMonth} />
        </div>
      </div>
    </div>
  );
}
