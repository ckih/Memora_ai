import Link from 'next/link';
import { Providers } from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="flex items-center justify-between p-4 border-b">
            <Link href="/dashboard" className="text-xl font-bold">Memora AI</Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/agent" className="hover:underline">Agent</Link>
              <Link href="/matches" className="hover:underline">Matches</Link>
            </div>
          </nav>
          <main>{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
