import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Quản Lý Chi Phí - Ứng dụng quản lý tài chính cá nhân',
  description: 'Quản lý chi tiêu, theo dõi nợ, và lập kế hoạch tài chính cho gia đình',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
