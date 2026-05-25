import { Sidebar } from '@/components/sidebar';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata = {
  title: 'Memora AI | Your Intelligent Career Memory',
  description: 'Proactive AI headhunter that remembers your goals and finds your perfect match.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="overflow-x-hidden">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 transition-all duration-300 ml-20 lg:ml-64 relative">
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
