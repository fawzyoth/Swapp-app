import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Email confirmation page loaded");
        console.log("Search params:", Object.fromEntries(searchParams.entries()));
        console.log("Full hash:", window.location.hash);

        // Wait a moment for Supabase to process the session from URL
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if we have an error in URL params
        const error_code = searchParams.get("error_code");
        const error_description = searchParams.get("error_description");

        if (error_code) {
          console.error("Error in URL:", error_code, error_description);

          // Check if user might already be confirmed
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            console.log("User has active session despite error:", session.user);
            setStatus("success");
            setMessage("Votre email a été confirmé! Vous pouvez maintenant vous connecter.");
            setTimeout(() => {
              navigate("/login?confirmed=true");
            }, 2000);
            return;
          }

          // Otherwise show error but allow login attempt
          setStatus("error");
          setMessage("Le lien de confirmation a expiré. Essayez de vous connecter - votre compte pourrait déjà être actif.");
          return;
        }

        // Check current session after Supabase processes the URL tokens
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log("Session after confirmation:", session);
        console.log("Session error:", error);

        if (session?.user) {
          console.log("Email confirmed successfully for:", session.user.email);
          setStatus("success");
          setMessage("Votre email a été confirmé avec succès! Vous pouvez maintenant vous connecter.");

          // Sign out so user can log in properly
          await supabase.auth.signOut();

          setTimeout(() => {
            navigate("/login?confirmed=true");
          }, 2000);
        } else {
          // No session but no error - might need to try login
          setStatus("error");
          setMessage("Lien de confirmation invalide ou expiré. Essayez de vous connecter - votre compte pourrait déjà être actif.");
        }
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        setStatus("error");
        setMessage("Lien de confirmation invalide. Essayez de vous connecter - votre compte pourrait déjà être actif.");
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Confirmation en cours...
            </h1>
            <p className="text-slate-600">
              Veuillez patienter pendant la vérification de votre email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Email confirmé!
            </h1>
            <p className="text-slate-600 mb-4">{message}</p>
            <p className="text-sm text-slate-500">
              Redirection vers la page de connexion...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Erreur de confirmation
            </h1>
            <p className="text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Retour à la connexion
            </button>
          </>
        )}
      </div>
    </div>
  );
}
