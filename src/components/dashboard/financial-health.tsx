'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/format';
import { AlertTriangle, TrendingDown, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialHealthProps {
  totalIncome: number;
  totalDebtPayments: number;
  totalInterestPerMonth: number;
  emergencyFund: number;
}

export function FinancialHealth({
  totalIncome,
  totalDebtPayments,
  totalInterestPerMonth,
  emergencyFund,
}: FinancialHealthProps) {
  // DTI = Debt-to-Income ratio
  const dti = totalIncome > 0 ? (totalDebtPayments / totalIncome) * 100 : 0;

  // Health status based on DTI
  const getHealthStatus = (dti: number) => {
    if (dti <= 30) return { label: 'Tốt', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (dti <= 40) return { label: 'Chấp nhận được', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (dti <= 50) return { label: 'Cần cải thiện', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { label: 'Nguy hiểm', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const status = getHealthStatus(dti);
  const annualInterestLoss = totalInterestPerMonth * 12;

  return (
    <Card className={cn('border-2', status.borderColor)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Sức khỏe tài chính
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* DTI Ratio */}
        <div className={cn('p-4 rounded-lg', status.bgColor)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tỷ lệ Nợ/Thu nhập (DTI)</span>
            <span className={cn('font-bold', status.color)}>
              {dti.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.min(dti, 100)}
            className={cn(
              'h-3',
              dti > 50 ? '[&>div]:bg-red-500' :
              dti > 40 ? '[&>div]:bg-orange-500' :
              dti > 30 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
            )}
          />
          <div className="flex items-center gap-2 mt-2">
            {dti > 50 && <AlertTriangle className="h-4 w-4 text-red-500" />}
            <span className={cn('text-sm font-medium', status.color)}>
              {status.label}
            </span>
            <span className="text-xs text-muted-foreground">
              (Khuyến nghị: dưới 40%)
            </span>
          </div>
        </div>

        {/* Interest Loss */}
        {totalInterestPerMonth > 0 && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">Lãi đang mất</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-red-600">Mỗi tháng</p>
                <p className="text-lg font-bold text-red-700">
                  {formatCurrency(Math.round(totalInterestPerMonth))}
                </p>
              </div>
              <div>
                <p className="text-xs text-red-600">Mỗi năm</p>
                <p className="text-lg font-bold text-red-700">
                  {formatCurrency(Math.round(annualInterestLoss))}
                </p>
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">
              💡 Ưu tiên trả nợ lãi cao trước để giảm số tiền mất đi
            </p>
          </div>
        )}

        {/* Emergency Fund Warning */}
        {emergencyFund === 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Chưa có quỹ dự phòng</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Nên để dành 3-6 tháng chi phí sinh hoạt cho trường hợp khẩn cấp
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-xs">Thu nhập</p>
            <p className="font-semibold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-xs">Trả nợ/tháng</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(totalDebtPayments)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
