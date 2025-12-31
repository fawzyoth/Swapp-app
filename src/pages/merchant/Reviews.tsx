import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Check,
  Video,
  User,
} from "lucide-react";
import { supabase, Review } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";
import StarRating from "../../components/common/StarRating";

export default function MerchantReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>(
    {},
  );
  const [submittingResponse, setSubmittingResponse] = useState<string | null>(
    null,
  );
  const [merchantId, setMerchantId] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    responseRate: 0,
    ratingDistribution: [0, 0, 0, 0, 0] as number[],
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/merchant/login");
      return;
    }

    // Get merchant ID from session - try user_id first, then email
    let merchant = null;

    const { data: merchantByUserId } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (merchantByUserId) {
      merchant = merchantByUserId;
    } else {
      // Fallback to email lookup
      const { data: merchantByEmail } = await supabase
        .from("merchants")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      merchant = merchantByEmail;
    }

    if (merchant) {
      setMerchantId(merchant.id);
      fetchReviews(merchant.id);
    } else {
      setLoading(false);
    }
  };

  const fetchReviews = async (mId: string) => {
    try {
      // Filter reviews by merchant_id
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("merchant_id", mId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviewsData = data || [];
      setReviews(reviewsData);

      // Calculate stats
      const total = reviewsData.length;
      const averageRating =
        total > 0
          ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / total
          : 0;
      const withResponse = reviewsData.filter(
        (r) => r.merchant_response,
      ).length;
      const responseRate =
        total > 0 ? Math.round((withResponse / total) * 100) : 0;

      // Calculate rating distribution
      const distribution = [0, 0, 0, 0, 0];
      reviewsData.forEach((r) => {
        if (r.rating >= 1 && r.rating <= 5) {
          distribution[r.rating - 1]++;
        }
      });

      setStats({
        total,
        averageRating: Math.round(averageRating * 10) / 10,
        responseRate,
        ratingDistribution: distribution,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (reviewId: string) => {
    const responseText = responseTexts[reviewId];
    if (!responseText?.trim()) return;

    setSubmittingResponse(reviewId);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          merchant_response: responseText.trim(),
          merchant_response_at: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (error) throw error;

      // Update local state
      setReviews(
        reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                merchant_response: responseText.trim(),
                merchant_response_at: new Date().toISOString(),
              }
            : r,
        ),
      );
      setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }));
      setExpandedReview(null);

      // Update response rate
      const updatedWithResponse = reviews.filter(
        (r) => r.merchant_response || r.id === reviewId,
      ).length;
      setStats((prev) => ({
        ...prev,
        responseRate: Math.round((updatedWithResponse / prev.total) * 100),
      }));
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setSubmittingResponse(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.client_phone.includes(searchTerm) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === null || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-emerald-600 bg-emerald-50";
    if (rating >= 3) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getRatingLabel = (rating: number) => {
    const labels = ["Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];
    return labels[rating - 1] || "";
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Avis Clients
          </h2>
          <p className="text-slate-600">
            Consultez et répondez aux avis de vos clients
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Average Rating Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                <StarRating
                  rating={Math.round(stats.averageRating)}
                  readonly
                  size="sm"
                />
              </div>
              <p className="text-sm text-slate-500">Note moyenne</p>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total}
            </div>
            <p className="text-sm text-slate-500">Total des avis</p>
          </div>

          {/* Response Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.responseRate}%
            </div>
            <p className="text-sm text-slate-500">Taux de réponse</p>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Distribution
            </h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating - 1];
                const percentage =
                  stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-3">{rating}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-6">{count}</span>
                  </div>
                );
              })}
            </div>
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
                  placeholder="Rechercher par nom, téléphone ou commentaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRating(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterRating === null
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tous
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    filterRating === rating
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {rating}
                  <Star
                    className={`w-4 h-4 ${filterRating === rating ? "fill-white" : "fill-amber-400 text-amber-400"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucun avis
            </h3>
            <p className="text-slate-600">
              {searchTerm || filterRating !== null
                ? "Aucun avis ne correspond à vos critères"
                : "Vous n'avez pas encore reçu d'avis clients"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Review Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {review.client_name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {review.client_phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(review.rating)}`}
                      >
                        <span className="font-semibold">{review.rating}</span>
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating Display */}
                  <div className="mb-4">
                    <StarRating rating={review.rating} readonly size="md" />
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <p className="text-slate-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}

                  {/* Video */}
                  {review.video_url && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          Vidéo du client
                        </span>
                      </div>
                      <video
                        src={review.video_url}
                        controls
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Exchange Code */}
                  {review.exchange_code && (
                    <p className="text-sm text-slate-500">
                      Code d'échange:{" "}
                      <span className="font-mono font-medium text-slate-700">
                        {review.exchange_code}
                      </span>
                    </p>
                  )}

                  {/* Merchant Response */}
                  {review.merchant_response && (
                    <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-sky-600" />
                        <span className="text-sm font-medium text-sky-800">
                          Votre réponse
                        </span>
                        {review.merchant_response_at && (
                          <span className="text-xs text-sky-600">
                            • {formatDate(review.merchant_response_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700">
                        {review.merchant_response}
                      </p>
                    </div>
                  )}
                </div>

                {/* Response Section */}
                {!review.merchant_response && (
                  <div className="border-t border-slate-200">
                    <button
                      onClick={() =>
                        setExpandedReview(
                          expandedReview === review.id ? null : review.id,
                        )
                      }
                      className="w-full px-6 py-3 flex items-center justify-between text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <span className="font-medium">Répondre à cet avis</span>
                      {expandedReview === review.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {expandedReview === review.id && (
                      <div className="px-6 pb-6">
                        <textarea
                          value={responseTexts[review.id] || ""}
                          onChange={(e) =>
                            setResponseTexts((prev) => ({
                              ...prev,
                              [review.id]: e.target.value,
                            }))
                          }
                          placeholder="Écrivez votre réponse..."
                          rows={3}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none mb-3"
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setExpandedReview(null);
                              setResponseTexts((prev) => ({
                                ...prev,
                                [review.id]: "",
                              }));
                            }}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleSubmitResponse(review.id)}
                            disabled={
                              !responseTexts[review.id]?.trim() ||
                              submittingResponse === review.id
                            }
                            className="flex items-center gap-2 px-6 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            {submittingResponse === review.id
                              ? "Envoi..."
                              : "Envoyer"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
