import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700'],
});

export const metadata: Metadata = {
  title: 'Bellonime',
  description: 'Platform untuk streaming anime favoritmu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`} lang="en" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
