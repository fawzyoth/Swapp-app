import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, MessageSquare, TrendingUp, Send } from 'lucide-react';
import { supabase, Review } from '../../lib/supabase';
import MerchantLayout from '../../components/MerchantLayout';
import StarRating from '../../components/common/StarRating';

export default function MerchantReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    responseRate: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchReviews();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/merchant/login');
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviewsData = data || [];
      setReviews(reviewsData);

      // Calculate stats
      const total = reviewsData.length;
      const averageRating = total > 0
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;
      const withResponse = reviewsData.filter(r => r.merchant_response).length;
      const responseRate = total > 0 ? Math.round((withResponse / total) * 100) : 0;

      setStats({ total, averageRating: Math.round(averageRating * 10) / 10, responseRate });

      if (reviewsData.length > 0 && !selectedReview) {
        setSelectedReview(reviewsData[0]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    setSubmittingResponse(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          merchant_response: responseText.trim(),
          merchant_response_at: new Date().toISOString(),
        })
        .eq('id', selectedReview.id);

      if (error) throw error;

      // Update local state
      setReviews(reviews.map(r =>
        r.id === selectedReview.id
          ? { ...r, merchant_response: responseText.trim(), merchant_response_at: new Date().toISOString() }
          : r
      ));
      setSelectedReview({
        ...selectedReview,
        merchant_response: responseText.trim(),
        merchant_response_at: new Date().toISOString(),
      });
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setSubmittingResponse(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.client_phone.includes(searchTerm);
    const matchesRating = filterRating === null || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Avis Clients</h2>
          <p className="text-slate-600">Gerez les avis et retours de vos clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <h3 className="text-slate-600 text-sm">Total des avis</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.averageRating}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm">Note moyenne</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-sky-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stats.responseRate}%</span>
            </div>
            <h3 className="text-slate-600 text-sm">Taux de reponse</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou telephone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterRating === null ? '' : filterRating}
                onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Toutes les notes</option>
                <option value="5">5 etoiles</option>
                <option value="4">4 etoiles</option>
                <option value="3">3 etoiles</option>
                <option value="2">2 etoiles</option>
                <option value="1">1 etoile</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List + Detail */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun avis</h3>
            <p className="text-slate-600">
              {searchTerm || filterRating !== null
                ? 'Aucun avis ne correspond a vos criteres'
                : 'Vous n\'avez pas encore recu d\'avis clients'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-400px)] min-h-[400px] flex overflow-hidden">
            {/* Left pane - Reviews list */}
            <div className="w-1/3 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">
                  {filteredReviews.length} avis
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredReviews.map((review) => (
                  <button
                    key={review.id}
                    onClick={() => {
                      setSelectedReview(review);
                      setResponseText('');
                    }}
                    className={`w-full p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      selectedReview?.id === review.id ? 'bg-sky-50 border-l-4 border-l-sky-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{review.client_name}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {review.comment || 'Pas de commentaire'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {formatDate(review.created_at)}
                      </span>
                      {review.merchant_response && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Repondu
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right pane - Review detail */}
            <div className="flex-1 flex flex-col">
              {selectedReview ? (
                <>
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedReview.client_name}</h3>
                        <p className="text-sm text-slate-600">{selectedReview.client_phone}</p>
                      </div>
                      <StarRating rating={selectedReview.rating} readonly size="lg" />
                    </div>
                    {selectedReview.exchange_code && (
                      <p className="text-sm text-slate-600">
                        Code d'echange: <span className="font-mono font-medium">{selectedReview.exchange_code}</span>
                      </p>
                    )}
                    <p className="text-sm text-slate-500 mt-2">
                      {formatDate(selectedReview.created_at)}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-2">Commentaire du client</h4>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-slate-700">
                          {selectedReview.comment || 'Aucun commentaire'}
                        </p>
                      </div>
                    </div>

                    {selectedReview.video_url && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video du client
                        </h4>
                        <div className="bg-black rounded-lg overflow-hidden">
                          <video
                            src={selectedReview.video_url}
                            controls
                            className="w-full max-h-64 object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {selectedReview.merchant_response && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-2">Votre reponse</h4>
                        <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                          <p className="text-slate-700">{selectedReview.merchant_response}</p>
                          {selectedReview.merchant_response_at && (
                            <p className="text-xs text-slate-500 mt-2">
                              Repondu le {formatDate(selectedReview.merchant_response_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Response form */}
                  {!selectedReview.merchant_response && (
                    <div className="p-4 border-t border-slate-200">
                      <div className="flex gap-2">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Ecrire une reponse..."
                          rows={2}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                        />
                        <button
                          onClick={handleSubmitResponse}
                          disabled={!responseText.trim() || submittingResponse}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  Selectionnez un avis pour voir les details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
