import { ReactNode } from 'react';
import MerchantSidebar from './MerchantSidebar';

interface MerchantLayoutProps {
  children: ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <MerchantSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
