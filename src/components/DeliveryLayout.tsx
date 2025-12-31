import { ReactNode } from "react";
import DeliverySidebar from "./DeliverySidebar";

interface DeliveryLayoutProps {
  children: ReactNode;
}

// Auth is already handled by ProtectedRoute in App.tsx
// This layout just provides the UI structure
export default function DeliveryLayout({ children }: DeliveryLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DeliverySidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
