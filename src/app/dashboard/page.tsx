import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DebtProgress } from '@/components/dashboard/debt-progress';
import { QuickAddExpense } from '@/components/dashboard/quick-add-expense';
import { WeeklyChart } from '@/components/dashboard/weekly-chart';
import { FinancialHealth } from '@/components/dashboard/financial-health';
import { formatCurrency, formatMonth, getFirstDayOfMonth } from '@/utils/format';
import {
  Wallet,
  TrendingDown,
  CreditCard,
  PiggyBank,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get user's profile and household
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, households(*)')
    .eq('id', user.id)
    .single();

  if (!profile?.household_id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Đang thiết lập tài khoản...</p>
      </div>
    );
  }

  const householdId = profile.household_id;
  const currentMonth = getFirstDayOfMonth();

  // Fetch data in parallel
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
      .lte('date', new Date().toISOString().split('T')[0]),
    supabase
      .from('fixed_expenses')
      .select('*')
      .eq('household_id', householdId)
      .eq('is_active', true),
  ]);

  // Calculate totals
  const totalIncome = monthlyIncomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const totalDailyExpenses = dailyExpenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const totalDebtPayments = debts?.reduce((sum, d) => sum + d.monthly_payment, 0) ?? 0;
  const totalFixedExpenses = fixedExpenses?.reduce((sum, f) => sum + f.amount, 0) ?? 0;
  const totalExpenses = totalDailyExpenses + totalDebtPayments + totalFixedExpenses;
  const balance = totalIncome - totalExpenses;

  // Calculate total monthly interest from high-interest debts
  const totalInterestPerMonth = debts?.reduce((sum, d) => {
    return sum + (d.total_amount * d.interest_rate / 100 / 12);
  }, 0) ?? 0;

  // Calculate weekly data for chart
  const weeklyData = [1, 2, 3, 4, 5].map((week) => {
    const weekExpenses = dailyExpenses?.filter((e) => {
      const day = new Date(e.date).getDate();
      const weekNum = Math.ceil(day / 7);
      return weekNum === week;
    }) ?? [];

    return {
      week: `Tuần ${week}`,
      'Sáng': weekExpenses.filter((e) => e.time_of_day === 'Sáng').reduce((s, e) => s + e.amount, 0),
      'Trưa': weekExpenses.filter((e) => e.time_of_day === 'Trưa').reduce((s, e) => s + e.amount, 0),
      'Tối': weekExpenses.filter((e) => e.time_of_day === 'Tối').reduce((s, e) => s + e.amount, 0),
      total: weekExpenses.reduce((s, e) => s + e.amount, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Thu nhập"
          value={formatCurrency(totalIncome)}
          icon={Wallet}
          description="Tổng thu nhập tháng này"
          valueClassName="text-green-600"
        />
        <StatsCard
          title="Chi tiêu"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          description="Tổng chi tiêu tháng này"
          valueClassName="text-red-600"
        />
        <StatsCard
          title="Trả nợ"
          value={formatCurrency(totalDebtPayments)}
          icon={CreditCard}
          description={`${debts?.length ?? 0} khoản nợ`}
        />
        <StatsCard
          title="Số dư"
          value={formatCurrency(balance)}
          icon={PiggyBank}
          description={balance >= 0 ? 'Còn dư' : 'Thiếu hụt'}
          valueClassName={balance >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Health Card - Full width on mobile, top of left column */}
          <FinancialHealth
            totalIncome={totalIncome}
            totalDebtPayments={totalDebtPayments}
            totalInterestPerMonth={totalInterestPerMonth}
            emergencyFund={0} // TODO: Add emergency fund tracking
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
