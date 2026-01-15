import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function CheckEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    console.log("CheckEmail page loaded");
    console.log("Email from params:", email);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));
  }, [email, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à l'inscription
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Vérifiez votre email
          </h1>

          <div className="mb-6 space-y-3 text-slate-600">
            <p>
              Un email de confirmation a été envoyé à :
            </p>
            {email && (
              <p className="font-semibold text-blue-600 text-lg">
                {email}
              </p>
            )}
            <p>
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-700">
              <strong>💡 Conseil :</strong> Si vous ne voyez pas l'email, vérifiez votre dossier de spam ou courrier indésirable.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Aller à la page de connexion
            </button>

            <p className="text-sm text-slate-500">
              Après avoir confirmé votre email, vous pourrez vous connecter à votre compte.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Vous n'avez pas reçu l'email ?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Réessayer l'inscription
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
