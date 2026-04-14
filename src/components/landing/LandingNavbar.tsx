'use client';

import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Quản Lý Chi Phí</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#tinh-nang" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tính năng</a>
          <a href="#huong-dan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hướng dẫn</a>
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "mr-2")}>
            Đăng nhập
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "default" }))}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </nav>
  );
}
