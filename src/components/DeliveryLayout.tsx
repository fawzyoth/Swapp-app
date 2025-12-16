import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeliverySidebar from "./DeliverySidebar";
import { supabase } from "../lib/supabase";

interface DeliveryLayoutProps {
  children: ReactNode;
}

export default function DeliveryLayout({ children }: DeliveryLayoutProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDeliveryAuth();
  }, []);

  const checkDeliveryAuth = async () => {
    try {
      // Check cache first for faster subsequent loads
      const cachedAuth = sessionStorage.getItem("delivery_auth");
      if (cachedAuth) {
        const { email, timestamp } = JSON.parse(cachedAuth);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Cache valid for 5 minutes and email matches
        if (
          session &&
          session.user.email === email &&
          Date.now() - timestamp < 300000
        ) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        sessionStorage.removeItem("delivery_auth");
        navigate("/delivery/login");
        return;
      }

      // Run both checks in parallel for faster loading
      const [merchantResult, deliveryResult] = await Promise.all([
        supabase
          .from("merchants")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle(),
        supabase
          .from("delivery_persons")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle(),
      ]);

      // Check if this is a merchant (forbidden)
      if (merchantResult.data) {
        sessionStorage.removeItem("delivery_auth");
        await supabase.auth.signOut();
        navigate("/delivery/login");
        return;
      }

      // Verify user is a delivery person
      if (deliveryResult.error || !deliveryResult.data) {
        sessionStorage.removeItem("delivery_auth");
        navigate("/delivery/login");
        return;
      }

      // Cache the auth result
      sessionStorage.setItem(
        "delivery_auth",
        JSON.stringify({
          email: session.user.email,
          timestamp: Date.now(),
        }),
      );

      setIsAuthorized(true);
    } catch (error) {
      console.error("Auth check error:", error);
      sessionStorage.removeItem("delivery_auth");
      navigate("/delivery/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DeliverySidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
