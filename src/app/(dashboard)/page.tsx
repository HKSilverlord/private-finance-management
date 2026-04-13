import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatMonth, getFirstDayOfMonth } from '@/utils/format';

export default async function DashboardPage() {
  // Step 1: Create client
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    return <p>Error: createClient failed - {String(err)}</p>;
  }

  // Step 2: Get user
  let user;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return <p>Error: getUser - {error.message}</p>;
    user = data?.user;
  } catch (err) {
    return <p>Error: getUser threw - {String(err)}</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-2xl font-bold">Chào mừng bạn đến với Quản Lý Chi Phí</h1>
        <p className="text-muted-foreground">Vui lòng đăng nhập để bắt đầu.</p>
        <a href="/login" className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  // Step 3: Get profile
  let profile;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, households(*)')
      .eq('id', user.id)
      .single();
    if (error) return <p>Error: profile query - {error.code}: {error.message}</p>;
    profile = data;
  } catch (err) {
    return <p>Error: profile threw - {String(err)}</p>;
  }

  if (!profile?.household_id) {
    return <p>Error: No household_id in profile</p>;
  }

  // Step 4: Fetch data
  const householdId = profile.household_id;
  const currentMonth = getFirstDayOfMonth();
  const today = new Date().toISOString().split('T')[0];

  const [incomeRes, debtRes, dailyRes, fixedRes] = await Promise.all([
    supabase.from('monthly_incomes').select('*, income_source:income_sources(*)').eq('household_id', householdId).eq('month', currentMonth),
    supabase.from('debts').select('*, payments:debt_payments(*)').eq('household_id', householdId).eq('is_active', true),
    supabase.from('daily_expenses').select('*').eq('household_id', householdId).gte('date', currentMonth).lte('date', today),
    supabase.from('fixed_expenses').select('*').eq('household_id', householdId).eq('is_active', true),
  ]);

  const totalIncome = (incomeRes.data ?? []).reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);
  const totalDailyExpenses = (dailyRes.data ?? []).reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
  const totalDebtPayments = (debtRes.data ?? []).reduce((sum: number, d: any) => sum + (Number(d.monthly_payment) || 0), 0);
  const totalFixedExpenses = (fixedRes.data ?? []).reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
  const totalExpenses = totalDailyExpenses + totalDebtPayments + totalFixedExpenses;
  const balance = totalIncome - totalExpenses;

  // Minimal render - pure HTML, no client components
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      <p>User: {user.email}</p>
      <p>Household: {profile.households?.name ?? householdId}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Thu nhập</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Chi tiêu</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Trả nợ</p>
          <p className="text-2xl font-bold">{formatCurrency(totalDebtPayments)}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Số dư</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Debug: incomes={incomeRes.data?.length ?? 0}, debts={debtRes.data?.length ?? 0}, daily={dailyRes.data?.length ?? 0}, fixed={fixedRes.data?.length ?? 0}</p>
        {incomeRes.error && <p className="text-red-500">Income error: {incomeRes.error.message}</p>}
        {debtRes.error && <p className="text-red-500">Debt error: {debtRes.error.message}</p>}
        {dailyRes.error && <p className="text-red-500">Daily error: {dailyRes.error.message}</p>}
        {fixedRes.error && <p className="text-red-500">Fixed error: {fixedRes.error.message}</p>}
      </div>
    </div>
  );
}
