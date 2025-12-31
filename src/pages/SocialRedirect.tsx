import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SocialRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  const handleRedirect = async () => {
    try {
      // Find the QR code by short code
      const { data: qrCode, error: fetchError } = await supabase
        .from('social_qr_codes')
        .select('*')
        .eq('short_code', shortCode)
        .eq('is_active', true)
        .single();

      if (fetchError || !qrCode) {
        setError(true);
        setLoading(false);
        return;
      }

      // Record the scan
      await supabase.from('social_qr_scans').insert({
        qr_code_id: qrCode.id,
        scanned_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });

      // Increment scan count
      await supabase
        .from('social_qr_codes')
        .update({ scan_count: (qrCode.scan_count || 0) + 1 })
        .eq('id', qrCode.id);

      // Redirect to the social media page
      window.location.href = qrCode.social_url;
    } catch (err) {
      console.error('Error redirecting:', err);
      setError(true);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Lien non trouvé</h1>
          <p className="text-slate-600 mb-4">
            Ce QR code n'est plus actif ou n'existe pas.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Redirection en cours...</h1>
        <p className="text-slate-600">
          Vous allez être redirigé vers la page demandée.
        </p>
      </div>
    </div>
  );
}
