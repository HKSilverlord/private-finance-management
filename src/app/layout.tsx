import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
