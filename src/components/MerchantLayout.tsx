import { ReactNode } from "react";
import MerchantSidebar from "./MerchantSidebar";
import { MerchantLanguageProvider, useMerchantLanguage } from "../contexts/MerchantLanguageContext";

interface MerchantLayoutProps {
  children: ReactNode;
}

// Inner layout that uses the language context
function MerchantLayoutInner({ children }: MerchantLayoutProps) {
  const { dir } = useMerchantLanguage();

  return (
    <div className="flex min-h-screen bg-slate-50" dir={dir}>
      <MerchantSidebar />
      <main className={`flex-1 ${dir === 'rtl' ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

// Auth is already handled by ProtectedRoute in App.tsx
// This layout just provides the UI structure with language support
export default function MerchantLayout({ children }: MerchantLayoutProps) {
  return (
    <MerchantLanguageProvider>
      <MerchantLayoutInner>{children}</MerchantLayoutInner>
    </MerchantLanguageProvider>
  );
}
