import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Package, Star, MessageSquare, Clock, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useClientSession } from '../../contexts/ClientSessionContext';
import { supabase } from '../../lib/supabase';
import LanguageSwitcher from '../../components/LanguageSwitcher';

interface MerchantWithHistory {
  id: string;
  name: string;
  logoUrl?: string;
  scannedAt: string;
  lastInteraction: string;
  exchangeCount: number;
  reviewCount: number;
  exchanges: any[];
  reviews: any[];
}

export default function MyBrands() {
  const navigate = useNavigate();
  const { lang, dir } = useLanguage();
  const { scannedMerchants, clientInfo } = useClientSession();

  const [merchantsWithHistory, setMerchantsWithHistory] = useState<MerchantWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantWithHistory | null>(null);

  useEffect(() => {
    loadMerchantHistory();
  }, [scannedMerchants, clientInfo]);

  const loadMerchantHistory = async () => {
    if (!clientInfo?.phone || scannedMerchants.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const merchantIds = scannedMerchants.map((m) => m.id);

      // Load exchanges for this client with these merchants
      const { data: exchanges } = await supabase
        .from('exchanges')
        .select('*')
        .eq('client_phone', clientInfo.phone)
        .in('merchant_id', merchantIds)
        .order('created_at', { ascending: false });

      // Load reviews for this client with these merchants
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_phone', clientInfo.phone)
        .in('merchant_id', merchantIds)
        .order('created_at', { ascending: false });

      // Combine data
      const combined = scannedMerchants.map((merchant) => ({
        ...merchant,
        exchanges: exchanges?.filter((e) => e.merchant_id === merchant.id) || [],
        reviews: reviews?.filter((r) => r.merchant_id === merchant.id) || [],
      }));

      setMerchantsWithHistory(combined);
    } catch (err) {
      console.error('Error loading merchant history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchantsWithHistory.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'fr-TN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return lang === 'ar' ? 'اليوم' : "Aujourd'hui";
    } else if (diffDays === 1) {
      return lang === 'ar' ? 'أمس' : 'Hier';
    } else if (diffDays < 7) {
      return lang === 'ar' ? `منذ ${diffDays} أيام` : `Il y a ${diffDays} jours`;
    } else {
      return formatDate(dateString);
    }
  };

  if (!clientInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir={dir}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            {lang === 'ar' ? 'مرحبًا بك في SWAPP' : 'Bienvenue sur SWAPP'}
          </h1>
          <p className="text-slate-400 mb-6">
            {lang === 'ar'
              ? 'قم بمسح رمز QR الخاص بأي متجر للبدء. ستظهر هنا جميع العلامات التجارية التي تفاعلت معها.'
              : 'Scannez le QR code d\'une boutique pour commencer. Toutes les marques avec lesquelles vous avez interagi apparaîtront ici.'}
          </p>
          <button
            onClick={() => navigate('/client/scan')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
          >
            {lang === 'ar' ? 'مسح رمز QR' : 'Scanner un QR Code'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Detail view for selected merchant
  if (selectedMerchant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={dir}>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>

          {/* Back button */}
          <button
            onClick={() => setSelectedMerchant(null)}
            className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2 rotate-180'}`} />
            <span className="font-medium">{lang === 'ar' ? 'العودة' : 'Retour'}</span>
          </button>

          {/* Merchant Header */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              {selectedMerchant.logoUrl ? (
                <img
                  src={selectedMerchant.logoUrl}
                  alt={selectedMerchant.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-emerald-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{selectedMerchant.name}</h1>
                <p className="text-slate-400 text-sm">
                  {lang === 'ar' ? 'آخر تفاعل:' : 'Dernière interaction:'}{' '}
                  {formatTimeAgo(selectedMerchant.lastInteraction)}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => navigate(`/client/exchange/new?merchant=${selectedMerchant.id}`)}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <Package className="w-5 h-5" />
                {lang === 'ar' ? 'طلب استبدال' : 'Demander échange'}
              </button>
              <button
                onClick={() => navigate(`/client/review/new?merchant=${selectedMerchant.id}`)}
                className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
              >
                <Star className="w-5 h-5" />
                {lang === 'ar' ? 'ترك تقييم' : 'Laisser un avis'}
              </button>
            </div>
          </div>

          {/* Exchanges Section */}
          {selectedMerchant.exchanges.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                {lang === 'ar' ? 'طلبات الاستبدال' : 'Demandes d\'échange'}
                <span className="text-sm text-slate-400">({selectedMerchant.exchanges.length})</span>
              </h2>
              <div className="space-y-3">
                {selectedMerchant.exchanges.map((exchange) => (
                  <div
                    key={exchange.id}
                    onClick={() => navigate(`/client/tracking/${exchange.exchange_code}`)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{exchange.product_name}</p>
                        <p className="text-sm text-slate-400">{exchange.exchange_code}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          exchange.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          exchange.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          exchange.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {exchange.status}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(exchange.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {selectedMerchant.reviews.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                {lang === 'ar' ? 'تقييماتي' : 'Mes avis'}
                <span className="text-sm text-slate-400">({selectedMerchant.reviews.length})</span>
              </h2>
              <div className="space-y-3">
                {selectedMerchant.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                        />
                      ))}
                      <span className="text-sm text-slate-400 ml-2">{formatDate(review.created_at)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-slate-300 text-sm">{review.comment}</p>
                    )}
                    {review.merchant_response && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-1">
                          {lang === 'ar' ? 'رد المتجر:' : 'Réponse du marchand:'}
                        </p>
                        <p className="text-sm text-emerald-400">{review.merchant_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No history message */}
          {selectedMerchant.exchanges.length === 0 && selectedMerchant.reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">
                {lang === 'ar'
                  ? 'لم تقم بأي تفاعل مع هذا المتجر بعد'
                  : 'Vous n\'avez pas encore interagi avec cette boutique'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main brands list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={dir}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {lang === 'ar' ? 'متاجري' : 'Mes Boutiques'}
          </h1>
          <p className="text-slate-400">
            {lang === 'ar'
              ? `مرحبًا ${clientInfo.name}، إليك المتاجر التي تفاعلت معها`
              : `Bonjour ${clientInfo.name}, voici les boutiques avec lesquelles vous avez interagi`}
          </p>
        </div>

        {/* Search */}
        {scannedMerchants.length > 3 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'البحث عن متجر...' : 'Rechercher une boutique...'}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        )}

        {/* Merchants list */}
        {filteredMerchants.length > 0 ? (
          <div className="space-y-3">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                onClick={() => setSelectedMerchant(merchant)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  {merchant.logoUrl ? (
                    <img
                      src={merchant.logoUrl}
                      alt={merchant.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Store className="w-7 h-7 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{merchant.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      {merchant.exchanges.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {merchant.exchanges.length}
                        </span>
                      )}
                      {merchant.reviews.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {merchant.reviews.length}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(merchant.lastInteraction)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        ) : scannedMerchants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
              <Store className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {lang === 'ar' ? 'لا توجد متاجر بعد' : 'Aucune boutique'}
            </h2>
            <p className="text-slate-400 mb-6">
              {lang === 'ar'
                ? 'قم بمسح رمز QR الخاص بأي متجر للبدء'
                : 'Scannez le QR code d\'une boutique pour commencer'}
            </p>
            <button
              onClick={() => navigate('/client/scan')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
            >
              {lang === 'ar' ? 'مسح رمز QR' : 'Scanner un QR Code'}
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">
              {lang === 'ar' ? 'لا توجد نتائج' : 'Aucun résultat'}
            </p>
          </div>
        )}

        {/* Scan new button */}
        {scannedMerchants.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
            <button
              onClick={() => navigate('/client/scan')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              {lang === 'ar' ? '+ مسح متجر جديد' : '+ Scanner une boutique'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pb-20 text-center">
          <p className="text-slate-500 text-sm">Powered by <span className="font-semibold text-emerald-400">SWAPP</span></p>
        </div>
      </div>
    </div>
  );
}
