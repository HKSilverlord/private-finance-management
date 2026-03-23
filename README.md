# Quản Lý Chi Phí

Ứng dụng quản lý tài chính cá nhân và gia đình.

## Tính năng

- **Dashboard tổng quan**: Xem thu nhập, chi tiêu, và số dư hàng tháng
- **Quản lý nợ**: Theo dõi thẻ tín dụng, khoản vay, và tiến độ trả nợ
- **Chi tiêu hàng ngày**: Ghi nhận chi tiêu theo buổi (Sáng/Trưa/Tối)
- **Thu nhập**: Quản lý các nguồn thu nhập
- **Biểu đồ**: Trực quan hóa chi tiêu theo tuần

## Công nghệ

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Cài đặt

### 1. Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com) và tạo project mới
2. Vào **Settings > API** để lấy:
   - `Project URL`
   - `anon public key`

### 2. Cấu hình môi trường

```bash
cp .env.local.example .env.local
```

Cập nhật file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Tạo database schema

1. Vào Supabase Dashboard > **SQL Editor**
2. Chạy file `supabase/migrations/001_create_tables.sql`
3. Schema sẽ tự động tạo các bảng và RLS policies

### 4. Cài đặt dependencies

```bash
npm install
```

### 5. Chạy ứng dụng

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

### 6. Import dữ liệu từ Excel (tùy chọn)

1. Đăng ký tài khoản trong app
2. Lấy `household_id` từ Supabase:
   ```sql
   SELECT household_id FROM profiles LIMIT 1;
   ```
3. Cập nhật file `supabase/seed/002_import_excel_data.sql`:
   - Thay `YOUR_HOUSEHOLD_ID` bằng UUID thực
   - Thay `CHONG_INCOME_ID` và `VO_INCOME_ID` bằng ID nguồn thu nhập
4. Chạy script trong SQL Editor

## Cấu trúc thư mục

```
quanlychiphi-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   ├── dashboard/          # Trang tổng quan
│   │   ├── debts/              # Trang quản lý nợ
│   │   ├── expenses/           # Trang chi tiêu
│   │   ├── income/             # Trang thu nhập
│   │   ├── settings/           # Trang cài đặt
│   │   ├── login/              # Trang đăng nhập
│   │   └── register/           # Trang đăng ký
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Layout components
│   ├── lib/
│   │   └── supabase/           # Supabase client setup
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── supabase/
│   ├── migrations/             # SQL migrations
│   └── seed/                   # Seed data
└── public/                     # Static assets
```

## Tính năng sắp tới

- [ ] Thêm/sửa/xóa nợ và nguồn thu nhập
- [ ] Nhắc nhở thanh toán
- [ ] Xuất báo cáo PDF
- [ ] Chế độ tối (Dark mode)
- [ ] Mời thành viên gia đình
- [ ] Ứng dụng mobile (PWA)

## License

MIT
