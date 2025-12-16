import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MerchantSidebar from "./MerchantSidebar";
import { supabase } from "../lib/supabase";

interface MerchantLayoutProps {
  children: ReactNode;
}

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMerchantAuth();
  }, []);

  const checkMerchantAuth = async () => {
    try {
      // Check cache first for faster subsequent loads
      const cachedAuth = sessionStorage.getItem("merchant_auth");
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
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        setLoading(false);
        return;
      }

      if (!session) {
        sessionStorage.removeItem("merchant_auth");
        navigate("/merchant/login");
        return;
      }

      // Run both checks in parallel for faster loading
      const [deliveryResult, merchantResult] = await Promise.all([
        supabase
          .from("delivery_persons")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle(),
        supabase
          .from("merchants")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle(),
      ]);

      // Check if this is a delivery person (forbidden)
      if (deliveryResult.data) {
        sessionStorage.removeItem("merchant_auth");
        await supabase.auth.signOut();
        navigate("/merchant/login");
        return;
      }

      if (merchantResult.error) {
        console.error("Merchant check error:", merchantResult.error);
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      if (!merchantResult.data) {
        sessionStorage.removeItem("merchant_auth");
        navigate("/merchant/login");
        return;
      }

      // Cache the auth result
      sessionStorage.setItem(
        "merchant_auth",
        JSON.stringify({
          email: session.user.email,
          timestamp: Date.now(),
        }),
      );

      setIsAuthorized(true);
    } catch (error) {
      console.error("Auth check error:", error);
      sessionStorage.removeItem("merchant_auth");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MerchantSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
