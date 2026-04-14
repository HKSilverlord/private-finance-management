export function LandingFooter() {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-muted-foreground mb-4">
          © {new Date().getFullYear()} Quản Lý Chi Phí. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-foreground transition-colors">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-foreground transition-colors">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}
