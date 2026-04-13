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
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Lỗi kết nối cơ sở dữ liệu</p>
          <p className="text-sm text-muted-foreground">
            Vui lòng kiểm tra cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY)
          </p>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, households(*)')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.household_id) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Đang thiết lập tài khoản...</p>
            {profileError && (
              <p className="text-xs text-destructive">
                Lỗi: {profileError.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Nếu lỗi này kéo dài, hãy chạy lại file SQL migration trong Supabase SQL Editor.
            </p>
          </div>
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
        week: `Tuần ${week}`,
        Sang: weekExpenses
          .filter((expense) => expense.time_of_day === 'Sáng')
          .reduce((sum, expense) => sum + expense.amount, 0),
        Trua: weekExpenses
          .filter((expense) => expense.time_of_day === 'Trưa')
          .reduce((sum, expense) => sum + expense.amount, 0),
        Toi: weekExpenses
          .filter((expense) => expense.time_of_day === 'Tối')
          .reduce((sum, expense) => sum + expense.amount, 0),
        total: weekExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      };
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <p className="text-muted-foreground">{formatMonth(new Date())}</p>
        </div>

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
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Không thể tải dữ liệu</p>
          <p className="text-sm text-muted-foreground">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }
}
