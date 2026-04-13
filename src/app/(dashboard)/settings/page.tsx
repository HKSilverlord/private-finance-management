import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Home, Shield } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, households(*)')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và cài đặt ứng dụng</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Tài khoản</CardTitle>
            </div>
            <CardDescription>Thông tin tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Họ tên</p>
              <p className="font-medium">{profile?.full_name || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vai trò</p>
              <Badge variant={profile?.role === 'owner' ? 'default' : 'secondary'}>
                {profile?.role === 'owner' ? 'Chủ sở hữu' : 'Thành viên'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Household Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <CardTitle>Hộ gia đình</CardTitle>
            </div>
            <CardDescription>Thông tin nhóm quản lý chi phí</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tên nhóm</p>
              <p className="font-medium">
                {(profile?.households as { name?: string })?.name || 'Gia đình'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID Nhóm</p>
              <p className="font-mono text-xs text-muted-foreground">
                {profile?.household_id || '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Bảo mật</CardTitle>
            </div>
            <CardDescription>Cài đặt bảo mật tài khoản</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tính năng đang được phát triển...
            </p>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Ứng dụng</CardTitle>
            </div>
            <CardDescription>Cài đặt chung của ứng dụng</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tính năng đang được phát triển...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
