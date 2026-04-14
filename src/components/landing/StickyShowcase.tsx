import { ScrollReveal } from './ScrollReveal';

const steps = [
  { 
    title: 'Bước 1: Thiết lập cơ bản',  
    desc: 'Bắt đầu bằng việc khai báo các nguồn thu nhập hiện có và những khoản chi phí cố định hàng tháng của gia đình.',
    color: 'text-blue-500'
  },
  { 
    title: 'Bước 2: Ghi chép chi tiêu',  
    desc: 'Sử dụng giao diện nhập liệu siêu tốc để ghi chép chi tiêu hàng ngày theo các buổi: Sáng, Trưa, Tối.',
    color: 'text-cyan-500' 
  },
  { 
    title: 'Bước 3: Tối ưu thanh toán nợ',  
    desc: 'Thêm thẻ tín dụng hoặc khoản vay. Hệ thống sẽ tự động nhắc nhở và tính toán gốc/lãi để bạn trả nợ đúng hạn.',
    color: 'text-purple-500' 
  },
  { 
    title: 'Bước 4: Theo dõi dòng tiền',  
    desc: 'Xem báo cáo ngay trên bảng điều khiển. Nhận điểm sức khỏe tài chính và điều chỉnh thói quen ngay lập tức.',
    color: 'text-green-500'
  },
];

export function StickyShowcase() {
  return (
    <section id="huong-dan" className="relative bg-slate-50 py-32 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Scrolling text steps */}
          <div className="space-y-[40vh] py-[10vh]">
            {steps.map((step, i) => (
              <ScrollReveal key={i}>
                <div className="py-24">
                  <div className={`text-sm font-bold tracking-wider uppercase mb-3 ${step.color}`}>
                    Quy trình
                  </div>
                  <h3 className="text-4xl font-bold mb-6 leading-tight text-foreground">{step.title}</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right: Sticky visual */}
          <div className="hidden lg:block">
            <div className="sticky top-1/3 w-full aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10 dark:border-white/5 flex items-center justify-center p-8 shadow-2xl backdrop-blur-xl">
               <div className="w-full h-full bg-card rounded-2xl shadow-inner border border-border/50 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                     <span className="text-primary text-2xl font-bold">✓</span>
                  </div>
                  <h4 className="text-2xl font-semibold">Tự động hoá</h4>
                  <p className="text-muted-foreground">Mọi con số đều được kết nối tạo thành bức tranh tài chính liền mạch.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
