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
        // Check if we have a token in the URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        console.log("Email confirmation params:", { token, type });

        if (type === "signup" && token) {
          // Verify the token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          });

          if (error) throw error;

          console.log("Email verified successfully:", data);
          setStatus("success");
          setMessage("Votre email a été confirmé avec succès! Vous pouvez maintenant vous connecter.");

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate("/login?confirmed=true");
          }, 3000);
        } else {
          // Check current session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user?.email_confirmed_at) {
            setStatus("success");
            setMessage("Votre email est déjà confirmé! Vous pouvez vous connecter.");
            setTimeout(() => {
              navigate("/login?confirmed=true");
            }, 2000);
          } else {
            setStatus("error");
            setMessage("Lien de confirmation invalide ou expiré.");
          }
        }
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        setStatus("error");
        setMessage(error.message || "Erreur lors de la confirmation de l'email");
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
