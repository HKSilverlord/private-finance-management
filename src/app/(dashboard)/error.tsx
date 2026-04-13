'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4 p-8 bg-muted rounded-2xl max-w-md">
        <p className="text-destructive font-bold text-lg">Đã xảy ra lỗi</p>
        <p className="text-sm text-muted-foreground">
          Ứng dụng gặp sự cố khi tải dữ liệu. Vui lòng thử lại.
        </p>
        {error?.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Mã lỗi: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-md border bg-background hover:bg-accent"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
