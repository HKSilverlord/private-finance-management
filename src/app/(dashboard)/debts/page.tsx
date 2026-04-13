import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatMonth, getFirstDayOfMonth } from '@/utils/format';
import { CreditCard, Building, Landmark } from 'lucide-react';

const debtTypeIcons = {
  credit_card: CreditCard,
  loan: Landmark,
  installment: Building,
};

const debtTypeLabels = {
  credit_card: 'Thẻ tín dụng',
  loan: 'Khoản vay',
  installment: 'Trả góp',
};

export default async function DebtsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('household_id')
    .eq('id', user.id)
    .single();

  if (!profile?.household_id) {
    return <div>Đang tải...</div>;
  }

  const currentMonth = getFirstDayOfMonth();

  const { data: debts } = await supabase
    .from('debts')
    .select('*, payments:debt_payments(*)')
    .eq('household_id', profile.household_id)
    .order('is_active', { ascending: false })
    .order('name');

  const totalDebt = debts?.reduce((sum, d) => sum + d.total_amount, 0) ?? 0;
  const monthlyPayments = debts?.filter(d => d.is_active).reduce((sum, d) => sum + d.monthly_payment, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nợ & Thẻ tín dụng</h1>
        <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng nợ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDebt)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trả hàng tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyPayments)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số khoản nợ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {debts?.filter(d => d.is_active).length ?? 0}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {debts?.length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="grid gap-4">
        {debts?.map((debt) => {
          const Icon = debtTypeIcons[debt.type as keyof typeof debtTypeIcons] || CreditCard;
          const payment = debt.payments?.find((p: { month: string }) => p.month === currentMonth);
          const isPaid = payment?.is_paid ?? false;

          return (
            <Card key={debt.id} className={!debt.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{debt.name}</h3>
                        <Badge variant="outline">
                          {debtTypeLabels[debt.type as keyof typeof debtTypeLabels]}
                        </Badge>
                        {!debt.is_active && (
                          <Badge variant="secondary">Đã tất toán</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tổng nợ: {formatCurrency(debt.total_amount)}
                        {debt.interest_rate > 0 && ` • Lãi: ${debt.interest_rate}%/năm`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(debt.monthly_payment)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {debt.due_day ? `Hạn ngày ${debt.due_day}` : 'Chưa đặt hạn'}
                    </p>
                  </div>
                </div>

                {debt.is_active && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tháng này</span>
                      {isPaid ? (
                        <Badge className="bg-green-600">Đã trả</Badge>
                      ) : (
                        <Badge variant="destructive">Chưa trả</Badge>
                      )}
                    </div>
                    <Progress value={isPaid ? 100 : 0} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {(!debts || debts.length === 0) && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Chưa có khoản nợ nào được thêm
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
