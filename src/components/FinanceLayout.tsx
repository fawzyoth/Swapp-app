import { ReactNode } from 'react';
import FinanceSidebar from './FinanceSidebar';

interface FinanceLayoutProps {
  children: ReactNode;
}

export default function FinanceLayout({ children }: FinanceLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <FinanceSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
