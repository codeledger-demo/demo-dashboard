import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeLedger Demo Dashboard',
  description: 'Synthetic team health dashboard powered by CodeLedger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-bg text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
