import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const REASONS = [
  'Taille incorrecte',
  'Couleur non conforme',
  'Produit défectueux',
  'Produit endommagé',
  'Ne correspond pas à la description',
  'Changement d\'avis',
  'Autre',
];

export default function ClientExchangeForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeCode = searchParams.get('code') || '';

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: '',
    clientPostalCode: '',
    clientCountry: 'Tunisia',
    productName: '',
    reason: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [error, setError] = useState('');
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
        setFormData({
          clientName: lastExchange.client_name || '',
          clientPhone: phone,
          clientAddress: lastExchange.client_address || '',
          clientCity: lastExchange.client_city || '',
          clientPostalCode: lastExchange.client_postal_code || '',
          clientCountry: lastExchange.client_country || 'Tunisia',
          productName: '',
          reason: '',
        });
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).slice(0, 3 - photos.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === Math.min(files.length, 3 - photos.length)) {
            setPhotos([...photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const merchantId = '11111111-1111-1111-1111-111111111111';

      const { data: existingExchange } = await supabase
        .from('exchanges')
        .select('*')
        .eq('exchange_code', exchangeCode)
        .maybeSingle();

      if (existingExchange) {
        navigate(`/client/tracking/${exchangeCode}`);
        return;
      }

      const { data: exchange, error: insertError } = await supabase
        .from('exchanges')
        .insert({
          exchange_code: exchangeCode,
          merchant_id: merchantId,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          client_address: formData.clientAddress,
          client_city: formData.clientCity,
          client_postal_code: formData.clientPostalCode,
          client_country: formData.clientCountry,
          product_name: formData.productName,
          reason: formData.reason,
          photos: photos,
          status: 'pending',
          payment_status: 'pending',
          payment_amount: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await supabase.from('status_history').insert({
        exchange_id: exchange.id,
        status: 'pending',
      });

      localStorage.setItem('lastClientPhone', formData.clientPhone);

      navigate(`/client/tracking/${exchangeCode}`);
    } catch (err) {
      console.error('Error submitting exchange:', err);
      setError('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/client/scan')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Demande d'Échange
            </h1>
            <p className="text-slate-600">
              Remplissez le formulaire pour soumettre votre demande
            </p>
          </div>

          {previousDataFound && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">Informations retrouvées</span>
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                Vos informations ont été automatiquement remplies depuis votre dernier échange
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
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code d'échange
                </label>
                <input
                  type="text"
                  value={exchangeCode}
                  disabled
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold"
                />
              </div>

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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {loadingPrevious && (
                      <p className="text-xs text-slate-500 mt-1">Recherche de vos informations...</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Adresse de livraison</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      placeholder="Rue, numéro, bâtiment"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientCity}
                        onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                        placeholder="Ville"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientPostalCode}
                        onChange={(e) => setFormData({ ...formData, clientPostalCode: e.target.value })}
                        placeholder="1000"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientCountry}
                      onChange={(e) => setFormData({ ...formData, clientCountry: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Détails du produit</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Ex: T-shirt Nike Bleu - Taille M"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Raison de l'échange *
                    </label>
                    <select
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Sélectionnez une raison</option>
                      {REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Photos du produit (1-3) *
                    </label>
                    <p className="text-xs text-slate-600 mb-3">
                      Prenez des photos claires du produit et du problème rencontré
                    </p>
                    <div className="space-y-4">
                      {photos.length < 3 && (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">
                            Cliquez pour ajouter des photos
                          </span>
                          <span className="text-xs text-slate-400">
                            {photos.length}/3 photos ajoutées
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}

                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-slate-200"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || photos.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
