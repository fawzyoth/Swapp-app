import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BookOpen,
  X,
  TrendingUp,
  TrendingDown,
  Truck,
  Box,
  ArrowRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";
import { useMerchantLanguage } from "../../contexts/MerchantLanguageContext";

function DashboardContent() {
  const navigate = useNavigate();
  const { t, dir, lang } = useMerchantLanguage();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    validated: 0,
    preparing: 0,
    readyForPickup: 0,
    inTransit: 0,
    completed: 0,
    rejected: 0,
    validationRate: 0,
    completionRate: 0,
  });
  const [timeStats, setTimeStats] = useState({
    thisWeek: 0,
    lastWeek: 0,
    thisMonth: 0,
    trend: 0,
  });
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    newThisMonth: 0,
    returningClients: 0,
  });
  const [reasonsStats, setReasonsStats] = useState<any[]>([]);
  const [recentExchanges, setRecentExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorialBanner, setShowTutorialBanner] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<string | null>(null);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem("merchant_tutorial_completed");
    if (!tutorialCompleted) {
      setShowTutorialBanner(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id, verification_status, business_type")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!merchantData) {
        setLoading(false);
        return;
      }

      // Set verification status
      setVerificationStatus(merchantData.verification_status || 'not_submitted');
      setBusinessType(merchantData.business_type || null);

      // Fetch exchanges with more data
      const { data: exchanges } = await supabase
        .from("exchanges")
        .select("id, status, reason, client_phone, client_name, created_at, exchange_code")
        .eq("merchant_id", merchantData.id)
        .order("created_at", { ascending: false });

      if (exchanges) {
        const total = exchanges.length;
        const pending = exchanges.filter((e) => e.status === "pending").length;
        const validated = exchanges.filter((e) => e.status === "validated").length;
        const preparing = exchanges.filter((e) => e.status === "preparing").length;
        const readyForPickup = exchanges.filter((e) => e.status === "ready_for_pickup").length;
        const inTransit = exchanges.filter((e) => e.status === "in_transit").length;
        const completed = exchanges.filter((e) => e.status === "completed").length;
        const rejected = exchanges.filter((e) => e.status === "rejected").length;

        const acceptedTotal = validated + preparing + readyForPickup + inTransit + completed;
        const validationRate = total > 0 ? Math.round((acceptedTotal / total) * 100) : 0;
        const completionRate = acceptedTotal > 0 ? Math.round((completed / acceptedTotal) * 100) : 0;

        setStats({
          total,
          pending,
          validated,
          preparing,
          readyForPickup,
          inTransit,
          completed,
          rejected,
          validationRate,
          completionRate,
        });

        // Time-based stats
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const thisWeek = exchanges.filter(e => new Date(e.created_at) >= startOfThisWeek).length;
        const lastWeek = exchanges.filter(e => {
          const date = new Date(e.created_at);
          return date >= startOfLastWeek && date < startOfThisWeek;
        }).length;
        const thisMonth = exchanges.filter(e => new Date(e.created_at) >= startOfMonth).length;

        const trend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : (thisWeek > 0 ? 100 : 0);

        setTimeStats({ thisWeek, lastWeek, thisMonth, trend });

        // Client stats
        const uniqueClients = new Set(exchanges.map(e => e.client_phone));
        const clientExchangeCount: Record<string, number> = {};
        exchanges.forEach(e => {
          clientExchangeCount[e.client_phone] = (clientExchangeCount[e.client_phone] || 0) + 1;
        });
        const returningClients = Object.values(clientExchangeCount).filter(count => count > 1).length;

        const newClientsThisMonth = new Set(
          exchanges
            .filter(e => new Date(e.created_at) >= startOfMonth)
            .map(e => e.client_phone)
        );
        // Find clients who had their first exchange this month
        const clientFirstExchange: Record<string, Date> = {};
        exchanges.forEach(e => {
          const date = new Date(e.created_at);
          if (!clientFirstExchange[e.client_phone] || date < clientFirstExchange[e.client_phone]) {
            clientFirstExchange[e.client_phone] = date;
          }
        });
        const newThisMonth = Object.entries(clientFirstExchange)
          .filter(([_, date]) => date >= startOfMonth)
          .length;

        setClientStats({
          totalClients: uniqueClients.size,
          newThisMonth,
          returningClients,
        });

        // Reasons stats
        const reasonsCount: Record<string, number> = {};
        exchanges.forEach((e) => {
          reasonsCount[e.reason] = (reasonsCount[e.reason] || 0) + 1;
        });
        const reasonsArray = Object.entries(reasonsCount)
          .map(([reason, count]) => ({ reason, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setReasonsStats(reasonsArray);

        // Recent exchanges (last 5)
        setRecentExchanges(exchanges.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "validated": return "bg-emerald-100 text-emerald-700";
      case "preparing": return "bg-blue-100 text-blue-700";
      case "ready_for_pickup": return "bg-purple-100 text-purple-700";
      case "in_transit": return "bg-sky-100 text-sky-700";
      case "completed": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "validated": return "Validé";
      case "preparing": return "Préparation";
      case "ready_for_pickup": return "Prêt";
      case "in_transit": return "Transit";
      case "completed": return "Terminé";
      case "rejected": return "Refusé";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Tutorial Banner */}
        {showTutorialBanner && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
            <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h3 className="text-xl font-bold mb-2">{t('welcomeToSwapp')}</h3>
                <p className="text-blue-100 mb-4">{t('tutorialDescription')}</p>
                <div className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => navigate("/merchant/tutorial")}
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    {t('startTutorial')}
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("merchant_tutorial_completed", "true");
                      setShowTutorialBanner(false);
                    }}
                    className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
                  >
                    {t('later')}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("merchant_tutorial_completed", "true");
                  setShowTutorialBanner(false);
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Verification Status Banner */}
        {verificationStatus && verificationStatus !== 'verified' && (
          <div className={`mb-6 rounded-xl p-5 border-2 ${
            verificationStatus === 'pending'
              ? 'bg-amber-50 border-amber-200'
              : verificationStatus === 'rejected'
              ? 'bg-red-50 border-red-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-3 rounded-xl ${
                verificationStatus === 'pending'
                  ? 'bg-amber-100'
                  : verificationStatus === 'rejected'
                  ? 'bg-red-100'
                  : 'bg-orange-100'
              }`}>
                <Clock className={`w-6 h-6 ${
                  verificationStatus === 'pending'
                    ? 'text-amber-600'
                    : verificationStatus === 'rejected'
                    ? 'text-red-600'
                    : 'text-orange-600'
                }`} />
              </div>
              <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h3 className={`text-lg font-bold mb-1 ${
                  verificationStatus === 'pending'
                    ? 'text-amber-900'
                    : verificationStatus === 'rejected'
                    ? 'text-red-900'
                    : 'text-orange-900'
                }`}>
                  {verificationStatus === 'pending'
                    ? 'Vérification en cours'
                    : verificationStatus === 'rejected'
                    ? 'Document rejeté'
                    : 'Document requis'}
                </h3>
                <p className={`text-sm ${
                  verificationStatus === 'pending'
                    ? 'text-amber-700'
                    : verificationStatus === 'rejected'
                    ? 'text-red-700'
                    : 'text-orange-700'
                }`}>
                  {verificationStatus === 'pending'
                    ? `Votre ${businessType === 'individual' ? 'carte CIN' : 'patente'} est en cours de vérification par notre équipe. Vous serez notifié une fois validé.`
                    : verificationStatus === 'rejected'
                    ? 'Votre document a été rejeté. Veuillez télécharger un nouveau document valide dans les paramètres.'
                    : `Veuillez télécharger votre ${businessType === 'individual' ? 'carte CIN' : 'patente'} pour activer pleinement votre compte.`}
                </p>
                {(verificationStatus === 'not_submitted' || verificationStatus === 'rejected') && (
                  <button
                    onClick={() => navigate('/merchant/settings')}
                    className={`mt-3 px-4 py-2 rounded-lg font-medium text-sm ${
                      verificationStatus === 'rejected'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    } transition-colors`}
                  >
                    Télécharger le document
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-7 h-7 text-blue-600" />
            </div>
            <div className={dir === 'rtl' ? 'text-right' : ''}>
              <h1 className="text-2xl font-bold text-slate-900">{t('overview')}</h1>
              <p className="text-slate-600">{t('statsAndMetrics')}</p>
            </div>
          </div>
        </div>

        {/* Alert for pending exchanges */}
        {stats.pending > 0 && (
          <Link
            to="/merchant/exchanges?status=pending"
            className="block mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
          >
            <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 bg-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <p className="font-semibold text-amber-900">
                  {stats.pending} demande{stats.pending > 1 ? 's' : ''} en attente de validation
                </p>
                <p className="text-sm text-amber-700">Cliquez ici pour les traiter</p>
              </div>
              <ArrowRight className={`w-5 h-5 text-amber-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
          </Link>
        )}

        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* This Week */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`flex items-center gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase">Cette semaine</span>
            </div>
            <div className={`flex items-end justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-bold text-slate-900">{timeStats.thisWeek}</span>
              <div className={`flex items-center gap-1 text-sm ${
                timeStats.trend >= 0 ? 'text-emerald-600' : 'text-red-600'
              } ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {timeStats.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{timeStats.trend >= 0 ? '+' : ''}{timeStats.trend}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">vs semaine dernière ({timeStats.lastWeek})</p>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`flex items-center gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase">Ce mois</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">{timeStats.thisMonth}</span>
            <p className="text-xs text-slate-500 mt-1">demandes ce mois</p>
          </div>

          {/* Validation Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`flex items-center gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-500 uppercase">Taux validation</span>
            </div>
            <div className={`flex items-end gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-bold text-emerald-600">{stats.validationRate}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${stats.validationRate}%` }}
              />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className={`flex items-center gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Package className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-slate-500 uppercase">Taux livraison</span>
            </div>
            <div className={`flex items-end gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-bold text-green-600">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pipeline Status - Visual flow */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className={`text-lg font-bold text-slate-900 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
            Pipeline des échanges
          </h3>
          <div className={`flex items-center justify-between gap-2 overflow-x-auto pb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* Pending */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                <div className="text-xs text-amber-600 font-medium">En attente</div>
              </div>
            </div>

            <ArrowRight className={`w-5 h-5 text-slate-300 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />

            {/* Validated */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700">{stats.validated}</div>
                <div className="text-xs text-emerald-600 font-medium">Validé</div>
              </div>
            </div>

            <ArrowRight className={`w-5 h-5 text-slate-300 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />

            {/* Preparing */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <Box className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{stats.preparing}</div>
                <div className="text-xs text-blue-600 font-medium">Préparation</div>
              </div>
            </div>

            <ArrowRight className={`w-5 h-5 text-slate-300 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />

            {/* Ready */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{stats.readyForPickup}</div>
                <div className="text-xs text-purple-600 font-medium">Prêt</div>
              </div>
            </div>

            <ArrowRight className={`w-5 h-5 text-slate-300 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />

            {/* In Transit */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 text-center">
                <Truck className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-sky-700">{stats.inTransit}</div>
                <div className="text-xs text-sky-600 font-medium">Transit</div>
              </div>
            </div>

            <ArrowRight className={`w-5 h-5 text-slate-300 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />

            {/* Completed */}
            <div className="flex-1 min-w-[100px]">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                <div className="text-xs text-green-600 font-medium">Terminé</div>
              </div>
            </div>
          </div>

          {/* Rejected count */}
          {stats.rejected > 0 && (
            <div className={`mt-4 pt-4 border-t border-slate-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-2 text-red-600 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{stats.rejected} refusé{stats.rejected > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Client Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className={`text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Users className="w-5 h-5 text-blue-600" />
              Clients
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-3 bg-slate-50 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className="text-2xl font-bold text-slate-900">{clientStats.totalClients}</div>
                <div className="text-xs text-slate-600">Total clients</div>
              </div>
              <div className={`text-center p-3 bg-emerald-50 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className="text-2xl font-bold text-emerald-700">{clientStats.newThisMonth}</div>
                <div className="text-xs text-emerald-600">Nouveaux ce mois</div>
              </div>
              <div className={`text-center p-3 bg-blue-50 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className="text-2xl font-bold text-blue-700">{clientStats.returningClients}</div>
                <div className="text-xs text-blue-600">Récurrents</div>
              </div>
            </div>
          </div>

          {/* Exchange Reasons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className={`text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {t('mainExchangeReasons')}
            </h3>
            {reasonsStats.length > 0 ? (
              <div className="space-y-3">
                {reasonsStats.map((item: any, index) => (
                  <div key={index}>
                    <div className={`flex items-center justify-between text-sm mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-slate-700 truncate">{item.reason}</span>
                      <span className="font-semibold text-slate-900 ml-2">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`bg-blue-600 h-2 rounded-full ${dir === 'rtl' ? 'ml-auto' : ''}`}
                        style={{ width: `${(item.count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">{t('noDataAvailable')}</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className={`flex items-center justify-between mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h3 className={`text-lg font-bold text-slate-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-5 h-5 text-slate-500" />
              Activité récente
            </h3>
            <Link
              to="/merchant/exchanges"
              className={`text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              Voir tout
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {recentExchanges.length > 0 ? (
            <div className="space-y-3">
              {recentExchanges.map((exchange) => (
                <Link
                  key={exchange.id}
                  to={`/merchant/exchange/${exchange.id}`}
                  className={`flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 min-w-0 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="font-semibold text-slate-900">{exchange.exchange_code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exchange.status)}`}>
                        {getStatusLabel(exchange.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{exchange.client_name}</p>
                  </div>
                  <div className={`text-sm text-slate-500 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                    {new Date(exchange.created_at).toLocaleDateString(
                      lang === 'ar' ? 'ar-TN' : 'fr-FR',
                      { day: 'numeric', month: 'short' }
                    )}
                  </div>
                  <ArrowRight className={`w-4 h-4 text-slate-400 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Aucune activité récente</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function MerchantDashboard() {
  return (
    <MerchantLayout>
      <DashboardContent />
    </MerchantLayout>
  );
}
