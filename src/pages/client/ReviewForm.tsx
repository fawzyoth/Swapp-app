import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Send, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StarRating from '../../components/common/StarRating';
import ClientLayout from '../../components/ClientLayout';

export default function ClientReviewForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeCode = searchParams.get('code') || '';

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    rating: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [previousDataFound, setPreviousDataFound] = useState(false);

  useEffect(() => {
    const phone = localStorage.getItem('lastClientPhone');
    if (phone) {
      loadPreviousData(phone);
    }
  }, []);

  const loadPreviousData = async (phone: string) => {
    setLoadingPrevious(true);
    try {
      const { data: exchanges } = await supabase
        .from('exchanges')
        .select('*')
        .eq('client_phone', phone)
        .order('created_at', { ascending: false })
        .limit(1);

      if (exchanges && exchanges.length > 0) {
        const lastExchange = exchanges[0];
        setFormData((prev) => ({
          ...prev,
          clientName: lastExchange.client_name || '',
          clientPhone: phone,
        }));
        setPreviousDataFound(true);
      }
    } catch (err) {
      console.error('Error loading previous data:', err);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handlePhoneChange = async (phone: string) => {
    setFormData({ ...formData, clientPhone: phone });

    if (phone.length >= 8) {
      loadPreviousData(phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const merchantId = '11111111-1111-1111-1111-111111111111';

      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          exchange_code: exchangeCode || null,
          merchant_id: merchantId,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          rating: formData.rating,
          comment: formData.comment || null,
          is_published: true,
        });

      if (insertError) throw insertError;

      localStorage.setItem('lastClientPhone', formData.clientPhone);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Merci pour votre avis !
            </h1>
            <p className="text-slate-600 mb-6">
              Votre retour nous aide a ameliorer nos services.
            </p>
            <div className="flex justify-center mb-6">
              <StarRating rating={formData.rating} readonly size="lg" />
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Retour a l'accueil
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/client/scan')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Star className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Laisser un avis
          </h1>
          <p className="text-slate-600">
            Partagez votre experience avec le marchand
          </p>
        </div>

        {previousDataFound && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">Informations retrouvees</span>
            </div>
            <p className="text-sm text-emerald-600 mt-1">
              Vos informations ont ete automatiquement remplies
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {exchangeCode && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code d'echange
                </label>
                <input
                  type="text"
                  value={exchangeCode}
                  disabled
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold"
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Vos informations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+216 XX XXX XXX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  {loadingPrevious && (
                    <p className="text-xs text-slate-500 mt-1">Recherche de vos informations...</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Votre avis</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Note *
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(rating) => setFormData({ ...formData, rating })}
                      size="lg"
                    />
                    {formData.rating > 0 && (
                      <span className="text-lg font-semibold text-amber-600">
                        {formData.rating}/5
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Decrivez votre experience..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">
                    {formData.comment.length}/500 caracteres
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.rating === 0}
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}
