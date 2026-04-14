import { StaggerReveal } from './StaggerReveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, PieChart, CreditCard, TrendingUp, Calendar, Shield } from 'lucide-react';

const features = [
  {
    title: 'Ghi chép siêu tốc',
    description: 'Thêm mới chi tiêu theo buổi sáng/trưa/tối chỉ với vài lượt chạm. Phân loại tự động thông minh.',
    icon: Wallet,
  },
  {
    title: 'Quản lý nợ chi tiết',
    description: 'Theo dõi chi tiết thẻ tín dụng, khoản vay, và nhắc nhở thanh toán để tránh trả lãi trễ hạn.',
    icon: CreditCard,
  },
  {
    title: 'Báo cáo trực quan',
    description: 'Biến những con số khô khan thành biểu đồ sinh động giúp bạn hiểu rõ dòng tiền mỗi phút.',
    icon: PieChart,
  },
  {
    title: 'Nguồn thu đa dạng',
    description: 'Dễ dàng quản lý nhiều nguồn thu nhập của cả vợ và chồng trong cùng một giao diện.',
    icon: TrendingUp,
  },
  {
    title: 'Dự báo dài hạn',
    description: 'Phân tích sức khỏe tài chính và dự báo tổng tài sản trong tương lai gần.',
    icon: Calendar,
  },
  {
    title: 'Bảo mật tuyệt đối',
    description: 'Dữ liệu được mã hóa và cô lập theo hộ gia đình. Không ai có quyền truy cập ngoài bạn.',
    icon: Shield,
  },
];

export function Features() {
  return (
    <section id="tinh-nang" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Tính năng nổi bật</h2>
          <p className="text-lg text-muted-foreground">
            Trải nghiệm các tính năng mạnh mẽ được thiết kế riêng cho thói quen quản lý tài chính của gia đình Việt.
          </p>
        </div>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
