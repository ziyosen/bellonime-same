import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Animekita',
  description: 'Platform untuk streaming anime favoritmu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme={undefined}
        >
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
