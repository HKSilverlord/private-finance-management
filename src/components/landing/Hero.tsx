'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden pt-16">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          ✨ Quản lý tài chính cá nhân & gia đình
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
          Kiểm soát tài chính <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> dễ dàng và thông minh</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Theo dõi chi tiêu, quản lý nợ, lập kế hoạch ngân sách và xây dựng tài sản. Tất cả diễn ra một cách tự động và trực quan, giúp bạn đạt tự do tài chính nhanh hơn.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Bắt đầu miễn phí
          </Link>
          <a
            href="#huong-dan"
            className="px-8 py-3.5 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-medium rounded-xl transition-all"
          >
            Tìm hiểu thêm →
          </a>
        </div>
      </div>
    </section>
  );
}
