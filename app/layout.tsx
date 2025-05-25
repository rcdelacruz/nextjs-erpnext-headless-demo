import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DemoUserSwitcher } from '@/components/auth/role-guard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduCore ERP - Educational Management System',
  description: 'Comprehensive educational ERP system with student management, finance, HRIS, and supply chain modules powered by ERPNext',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen pt-20">
          {children}
        </div>
        {process.env.NODE_ENV === 'development' && <DemoUserSwitcher />}
      </body>
    </html>
  );
}
