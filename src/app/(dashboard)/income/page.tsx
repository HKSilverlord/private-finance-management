import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatMonth, getFirstDayOfMonth } from '@/utils/format';
import { User } from 'lucide-react';
import { StaggerReveal } from '@/components/landing/StaggerReveal';

export default async function IncomePage() {
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

  const [{ data: incomeSources }, { data: monthlyIncomes }] = await Promise.all([
    supabase
      .from('income_sources')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('name'),
    supabase
      .from('monthly_incomes')
      .select('*, income_source:income_sources(*)')
      .eq('household_id', profile.household_id)
      .eq('month', currentMonth),
  ]);

  const totalIncome = monthlyIncomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0;

  return (
    <StaggerReveal className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Thu nhập</h1>
        <p className="text-muted-foreground">{formatMonth(new Date())}</p>
      </div>

      {/* Total Income */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tổng thu nhập tháng này
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>

      {/* Income Sources */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Nguồn thu nhập</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {incomeSources?.map((source) => {
            const monthlyIncome = monthlyIncomes?.find(
              (i) => i.income_source_id === source.id
            );
            const amount = monthlyIncome?.amount ?? 0;

            return (
              <Card key={source.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{source.name}</h3>
                          {!source.is_active && (
                            <Badge variant="secondary">Không hoạt động</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mặc định: {formatCurrency(source.default_amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(amount)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {amount > 0 ? 'Đã nhập' : 'Chưa nhập'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!incomeSources || incomeSources.length === 0) && (
            <Card className="md:col-span-2">
              <CardContent className="p-6 text-center text-muted-foreground">
                Chưa có nguồn thu nhập nào được thêm
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StaggerReveal>
  );
}
