'use client';

import { Sidebar } from '@/components/sidebar';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="dark">
      <body className="overflow-x-hidden bg-[#0a0f1e]">
        <Providers>
          <div className="flex min-h-screen">
            {!isLoginPage && <Sidebar />}
            <main className={cn(
              "flex-1 w-full pt-16 md:pt-0 transition-all duration-300",
              !isLoginPage && "md:pl-64 body-data-[sidebar-collapsed=true]:md:pl-20"
            )}>
               {children}
            </main>
          </div>
          <Toaster richColors position="top-right" theme="dark" />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
