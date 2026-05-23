'use client';

export default function Loading() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-muted rounded-lg"></div>
        <div className="h-64 bg-muted rounded-lg"></div>
      </div>
    </div>
  );
}
