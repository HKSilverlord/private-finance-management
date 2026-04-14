export function DashboardSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md leading-none"></div>
          <div className="h-4 w-24 bg-muted/50 rounded-md"></div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 4 Stats Cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted rounded-md"></div>
              <div className="h-4 w-4 bg-muted rounded-full"></div>
            </div>
            <div className="h-8 w-28 bg-muted rounded-md"></div>
            <div className="h-3 w-16 bg-muted/50 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart Area */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-80">
            <div className="h-6 w-32 bg-muted rounded-md mb-8"></div>
            <div className="h-full w-full bg-muted/20 rounded-md"></div>
          </div>
        </div>
        <div className="space-y-6">
          {/* Right Area (Quick Add/Debts) */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-40">
             <div className="h-6 w-24 bg-muted rounded-md mb-4"></div>
             <div className="space-y-2">
               <div className="h-10 w-full bg-muted rounded-md"></div>
             </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-40">
              <div className="h-6 w-32 bg-muted rounded-md mb-4"></div>
              <div className="h-2 w-full bg-muted/50 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
