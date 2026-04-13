'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-8 bg-muted rounded-2xl max-w-md">
        <p className="text-red-600 font-bold text-lg">Đã xảy ra lỗi</p>
        <p className="text-sm text-gray-500">
          Ứng dụng gặp sự cố. Vui lòng thử lại.
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400 font-mono">
            Mã lỗi: {error.digest}
          </p>
        )}
        {error?.message && process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-red-400 font-mono bg-red-50 p-2 rounded break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-50"
          >
            Thử lại
          </button>
          <a
            href="/login"
            className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-50"
          >
            Về trang đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
