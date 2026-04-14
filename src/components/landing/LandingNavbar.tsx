import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <Button variant="ghost" className="mr-2" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Đăng ký ngay</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
