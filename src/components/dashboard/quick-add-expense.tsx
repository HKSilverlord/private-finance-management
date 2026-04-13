'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { TimeOfDay } from '@/types/database';
import { cn } from '@/lib/utils';
import { Plus, Sun, CloudSun, Moon } from 'lucide-react';

const timeOptions: { value: TimeOfDay; label: string; icon: typeof Sun }[] = [
  { value: 'Sáng', label: 'Sáng', icon: Sun },
  { value: 'Trưa', label: 'Trưa', icon: CloudSun },
  { value: 'Tối', label: 'Tối', icon: Moon },
];

interface QuickAddExpenseProps {
  householdId: string;
  onSuccess?: () => void;
}

export function QuickAddExpense({ householdId, onSuccess }: QuickAddExpenseProps) {
  const [amount, setAmount] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Sáng');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-detect time of day
  useState(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay('Sáng');
    else if (hour >= 11 && hour < 17) setTimeOfDay('Trưa');
    else setTimeOfDay('Tối');
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isLoading) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('daily_expenses').insert({
        household_id: householdId,
        date: new Date().toISOString().split('T')[0],
        time_of_day: timeOfDay,
        amount: parseInt(amount.replace(/\D/g, ''), 10),
        category: 'food',
        note: note || null,
      });

      if (error) throw error;

      setAmount('');
      setNote('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatInputValue = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thêm chi tiêu nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Buổi</Label>
            <div className="flex gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={timeOfDay === option.value ? 'default' : 'outline'}
                  className={cn(
                    'flex-1',
                    timeOfDay === option.value && 'ring-2 ring-primary ring-offset-2'
                  )}
                  onClick={() => setTimeOfDay(option.value)}
                >
                  <option.icon className="h-4 w-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              placeholder="50.000"
              value={amount}
              onChange={(e) => setAmount(formatInputValue(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
            <Input
              id="note"
              type="text"
              placeholder="Ăn sáng, cafe..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!amount || isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Đang thêm...' : 'Thêm chi tiêu'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
