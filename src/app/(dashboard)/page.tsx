import { createClient } from '@/lib/supabase/server';
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
  } catch (err) {
    return <p className="p-8 text-destructive">Lỗi kết nối Supabase: {String(err)}</p>;
  }

  let user;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error('[Dashboard] getUser error:', error.message);
    user = data?.user;
  } catch (err) {
    return <p className="p-8 text-destructive">Lỗi xác thực: {String(err)}</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Chào mừng bạn đến với Quản Lý Chi Phí</h1>
          <p className="text-muted-foreground max-w-sm">
            Vui lòng đăng nhập để bắt đầu theo dõi thu nhập và chi tiêu của bạn.
          </p>
        </div>
        <a href="/login" className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  let profile;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, households(*)')
      .eq('id', user.id)
      .single();
    if (error) {
      return <p className="p-8 text-destructive">Lỗi tải hồ sơ: {error.code} - {error.message}</p>;
    }
    profile = data;
  } catch (err) {
    return <p className="p-8 text-destructive">Lỗi truy vấn hồ sơ: {String(err)}</p>;
  }

  if (!profile?.household_id) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 border-2 border-dashed rounded-2xl max-w-md">
          <h2 className="text-xl font-bold mb-2">Tài khoản chưa hoàn tất thiết lập</h2>
          <p className="text-muted-foreground mb-4">
            Bạn cần được gán vào một Nhóm Hộ Gia Đình để bắt đầu ghi chép.
          </p>
        </div>
      </div>
    );
  }

  const householdId = profile.household_id;
  const currentMonth = getFirstDayOfMonth();
  const today = new Date().toISOString().split('T')[0];

  const [incomeRes, debtRes, dailyRes, fixedRes] = await Promise.all([
    supabase.from('monthly_incomes').select('*, income_source:income_sources(*)').eq('household_id', householdId).eq('month', currentMonth),
    supabase.from('debts').select('*, payments:debt_payments(*)').eq('household_id', householdId).eq('is_active', true),
    supabase.from('daily_expenses').select('*').eq('household_id', householdId).gte('date', currentMonth).lte('date', today),
    supabase.from('fixed_expenses').select('*').eq('household_id', householdId).eq('is_active', true),
  ]);

  const monthlyIncomes = incomeRes.data ?? [];
  const debts = debtRes.data ?? [];
  const dailyExpenses = dailyRes.data ?? [];
  const fixedExpenses = fixedRes.data ?? [];

  const totalIncome = monthlyIncomes.reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);
  const totalDailyExpenses = dailyExpenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
  const totalDebtPayments = debts.reduce((sum: number, d: any) => sum + (Number(d.monthly_payment) || 0), 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
  const totalExpenses = totalDailyExpenses + totalDebtPayments + totalFixedExpenses;
  const balance = totalIncome - totalExpenses;

  const totalInterestPerMonth = debts.reduce((sum: number, debt: any) => {
    return sum + ((Number(debt.total_amount) || 0) * (Number(debt.interest_rate) || 0) / 100 / 12);
  }, 0);

  const weeklyData = [1, 2, 3, 4, 5].map((week) => {
    const weekExpenses = dailyExpenses.filter((expense: any) => {
      const date = new Date(expense.date);
      return !isNaN(date.getTime()) && Math.ceil(date.getDate() / 7) === week;
    });
    return {
      week: `Tuần ${week}`,
      Sang: weekExpenses.filter((e: any) => e.time_of_day === 'Sáng').reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
      Trua: weekExpenses.filter((e: any) => e.time_of_day === 'Trưa').reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
      Toi: weekExpenses.filter((e: any) => e.time_of_day === 'Tối').reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
      total: weekExpenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">{formatMonth(new Date())}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Thu nhập" value={formatCurrency(totalIncome)} icon={<Wallet className="h-5 w-5" />} description="Thu nhập tháng này" valueClassName="text-green-600" />
        <StatsCard title="Chi tiêu" value={formatCurrency(totalExpenses)} icon={<TrendingDown className="h-5 w-5" />} description="Chi tiêu tháng này" valueClassName="text-red-600" />
        <StatsCard title="Trả nợ" value={formatCurrency(totalDebtPayments)} icon={<CreditCard className="h-5 w-5" />} description={`${debts.length} khoản nợ`} />
        <StatsCard
          title="Số dư"
          value={formatCurrency(balance)}
          icon={<PiggyBank className="h-5 w-5" />}
          description={balance >= 0 ? 'Thặng dư' : 'Thâm hụt'}
          valueClassName={balance >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <FinancialHealth totalIncome={totalIncome} totalDebtPayments={totalDebtPayments} totalInterestPerMonth={totalInterestPerMonth} emergencyFund={0} />
          <WeeklyChart data={weeklyData} />
        </div>
        <div className="space-y-6">
          <QuickAddExpense householdId={householdId} />
          <DebtProgress debts={debts} currentMonth={currentMonth} />
        </div>
      </div>
    </div>
  );
}
