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
  
  // 1. Safe Client Creation
  try {
    supabase = await createClient();
  } catch (err) {
    console.error('Supabase Client Error:', err);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-6 bg-destructive/10 border border-destructive/20 rounded-xl max-w-md">
          <p className="text-destructive font-bold text-lg mb-2">Lỗi cấu hình hệ thống</p>
          <p className="text-sm text-muted-foreground">
            Không thể khởi tạo kết nối Supabase. Vui lòng kiểm tra file .env hoặc cấu hình Vercel.
          </p>
        </div>
      </div>
    );
  }

  // 2. Safe Auth Retrieval
  const authResponse = await supabase.auth.getUser();
  const user = authResponse?.data?.user;

  // If no user, show a guest/welcome view instead of crashing
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="p-4 bg-primary/5 rounded-full">
          <PiggyBank className="h-12 w-12 text-primary" />
        </div>
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

  // 3. Robust Data Retrieval
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, households(*)')
      .eq('id', user.id)
      .single();

    if (!profile?.household_id) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center p-8 border-2 border-dashed rounded-2xl max-w-md">
            <h2 className="text-xl font-bold mb-2">Tài khoản chưa hoàn tất thiết lập</h2>
            <p className="text-muted-foreground mb-4">
              Bạn cần được gán vào một Nhóm Hộ Gia Đình để bắt đầu ghi chép.
            </p>
            <p className="text-xs text-muted-foreground">
              Gợi ý: Hãy chạy SQL Migration trong Supabase SQL Editor để tự động tạo profile.
            </p>
          </div>
        </div>
      );
    }

    const householdId = profile.household_id;
    const currentMonth = getFirstDayOfMonth();
    const today = new Date().toISOString().split('T')[0];

    // Safely execute all queries
    const [
      incomeResponse,
      debtResponse,
      dailyResponse,
      fixedResponse,
    ] = await Promise.all([
      supabase.from('monthly_incomes').select('*, income_source:income_sources(*)').eq('household_id', householdId).eq('month', currentMonth),
      supabase.from('debts').select('*, payments:debt_payments(*)').eq('household_id', householdId).eq('is_active', true),
      supabase.from('daily_expenses').select('*').eq('household_id', householdId).gte('date', currentMonth).lte('date', today),
      supabase.from('fixed_expenses').select('*').eq('household_id', householdId).eq('is_active', true),
    ]);

    // Extract data safely
    const monthlyIncomes = incomeResponse?.data ?? [];
    const debts = debtResponse?.data ?? [];
    const dailyExpenses = dailyResponse?.data ?? [];
    const fixedExpenses = fixedResponse?.data ?? [];

    const totalIncome = monthlyIncomes.reduce((sum: number, income: any) => sum + income.amount, 0);
    const totalDailyExpenses = dailyExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    const totalDebtPayments = debts.reduce((sum: number, debt: any) => sum + (debt.monthly_payment || 0), 0);
    const totalFixedExpenses = fixedExpenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
    
    const totalExpenses = totalDailyExpenses + totalDebtPayments + totalFixedExpenses;
    const balance = totalIncome - totalExpenses;

    const totalInterestPerMonth = debts.reduce((sum: number, debt: any) => {
      const amount = debt.total_amount || 0;
      const rate = debt.interest_rate || 0;
      return sum + (amount * rate / 100 / 12);
    }, 0);

    const weeklyData = [1, 2, 3, 4, 5].map((week) => {
      const weekExpenses = dailyExpenses.filter((expense: any) => Math.ceil(new Date(expense.date).getDate() / 7) === week);
      return {
        week: `Tuần ${week}`,
        Sang: weekExpenses.filter((e: any) => e.time_of_day === 'Sáng').reduce((sum: number, e: any) => sum + e.amount, 0),
        Trua: weekExpenses.filter((e: any) => e.time_of_day === 'Trưa').reduce((sum: number, e: any) => sum + e.amount, 0),
        Toi: weekExpenses.filter((e: any) => e.time_of_day === 'Tối').reduce((sum: number, e: any) => sum + e.amount, 0),
        total: weekExpenses.reduce((sum: number, e: any) => sum + e.amount, 0),
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
          <StatsCard title="Thu nhập" value={formatCurrency(totalIncome)} icon={Wallet} description="Thu nhập tháng này" valueClassName="text-green-600" />
          <StatsCard title="Chi tiêu" value={formatCurrency(totalExpenses)} icon={TrendingDown} description="Chi tiêu tháng này" valueClassName="text-red-600" />
          <StatsCard title="Trả nợ" value={formatCurrency(totalDebtPayments)} icon={CreditCard} description={`${debts.length} khoản nợ`} />
          <StatsCard 
            title="Số dư" 
            value={formatCurrency(balance)} 
            icon={PiggyBank} 
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
  } catch (error) {
    console.error('Dashboard Application Error:', error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 p-8 bg-muted rounded-2xl">
          <p className="text-destructive font-bold">Lỗi không mong muốn</p>
          <p className="text-sm text-muted-foreground">Ứng dụng gặp sự cố khi hiển thị dữ liệu.</p>
          <Button onClick={() => window.location.reload()} variant="outline">Tải lại trang</Button>
        </div>
      </div>
    );
  }
}

// Client-side reload helper
function Button({ children, onClick, variant }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-md border ${variant === 'outline' ? 'bg-background hover:bg-accent' : ''}`}
    >
      {children}
    </button>
  );
}
