'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { Debt, DebtPayment } from '@/types/database';
import { Flame, AlertTriangle } from 'lucide-react';

interface DebtProgressProps {
  debts: (Debt & { payments?: DebtPayment[] })[];
  currentMonth: string;
}

export function DebtProgress({ debts, currentMonth }: DebtProgressProps) {
  const activeDebts = debts.filter((d) => d.is_active);

  // Sort by interest rate (highest first) - prioritize high-interest debt
  const sortedDebts = [...activeDebts].sort((a, b) => b.interest_rate - a.interest_rate);

  // Calculate total monthly interest
  const totalMonthlyInterest = activeDebts.reduce((sum, d) => {
    return sum + (d.total_amount * d.interest_rate / 100 / 12);
  }, 0);

  const highInterestDebts = activeDebts.filter(d => d.interest_rate > 20);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Tiến độ trả nợ tháng này
        </CardTitle>
        {totalMonthlyInterest > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-medium">
              Lãi đang mất: {formatCurrency(Math.round(totalMonthlyInterest))}/tháng
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* High Interest Warning */}
        {highInterestDebts.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              Ưu tiên trả trước
            </div>
            <p className="text-xs text-red-600">
              {highInterestDebts.length} khoản nợ lãi cao ({'>'}20%/năm) đang tiêu tiền của bạn
            </p>
          </div>
        )}

        {activeDebts.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có khoản nợ nào</p>
        ) : (
          sortedDebts.map((debt) => {
            const payment = debt.payments?.find(
              (p) => p.month === currentMonth
            );
            const isPaid = payment?.is_paid ?? false;
            const paidAmount = isPaid ? debt.monthly_payment : 0;
            const progress = debt.monthly_payment > 0
              ? (paidAmount / debt.monthly_payment) * 100
              : 0;
            const isHighInterest = debt.interest_rate > 20;
            const monthlyInterest = Math.round(debt.total_amount * debt.interest_rate / 100 / 12);

            return (
              <div key={debt.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{debt.name}</span>
                    {isHighInterest && (
                      <Badge variant="destructive" className="text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        {debt.interest_rate}%
                      </Badge>
                    )}
                    {debt.interest_rate === 0 && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                        0% lãi
                      </Badge>
                    )}
                    {isPaid ? (
                      <Badge variant="default" className="bg-green-600 text-xs">
                        Đã trả
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Chưa trả</Badge>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(debt.monthly_payment)}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className={`h-2 ${isHighInterest ? '[&>div]:bg-red-500' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {debt.due_day ? `Hạn: Ngày ${debt.due_day}` : 'Chưa đặt hạn'}
                  </span>
                  {monthlyInterest > 0 && (
                    <span className="text-red-500">
                      -{formatCurrency(monthlyInterest)} lãi/tháng
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
