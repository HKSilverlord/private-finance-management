'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Nợ & Thẻ tín dụng', href: '/debts', icon: CreditCard },
  { name: 'Thu nhập', href: '/income', icon: Wallet },
  { name: 'Chi tiêu hàng ngày', href: '/expenses', icon: Receipt },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

function NavItems({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r bg-card px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Wallet className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Quản Lý Chi Phí</span>
        </div>

        <div className="flex-1">
          <NavItems />
        </div>

        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Quản Lý Chi Phí</span>
            </div>
          </div>

          <div className="flex-1">
            <NavItems onItemClick={() => setOpen(false)} />
          </div>

          <div className="mt-auto pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
