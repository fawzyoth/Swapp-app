import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Package, Clock, CheckCircle, XCircle, Truck, Box } from "lucide-react";
import { supabase } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";
import { useMerchantLanguage } from "../../contexts/MerchantLanguageContext";

// Status flow steps for visual indicator
const STATUS_STEPS = ["pending", "validated", "preparing", "ready_for_pickup", "in_transit", "completed"];

// Get step index for a status (-1 for rejected)
const getStepIndex = (status: string) => {
  if (status === "rejected") return -1;
  return STATUS_STEPS.indexOf(status);
};

// Mini progress indicator component
function StatusProgress({ status }: { status: string }) {
  const stepIndex = getStepIndex(status);

  // Handle rejected status separately
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-4 h-4 text-red-600" />
        </div>
        <span className="text-xs font-medium text-red-700">Refusé</span>
      </div>
    );
  }

  // For completed status, show success badge
  if (status === "completed") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-medium text-emerald-700">Terminé</span>
      </div>
    );
  }

  // Visual progress dots for active statuses
  const steps = [
    { key: "pending", icon: Clock, label: "Att." },
    { key: "validated", icon: CheckCircle, label: "Val." },
    { key: "preparing", icon: Box, label: "Prép." },
    { key: "ready_for_pickup", icon: Package, label: "Prêt" },
    { key: "in_transit", icon: Truck, label: "Transit" },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {steps.map((step, idx) => {
        const isCompleted = idx < stepIndex;
        const isCurrent = idx === stepIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step indicator */}
            <div
              className={`relative group ${isCurrent ? 'z-10' : ''}`}
              title={step.label}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-sky-500 ring-2 ring-sky-200 scale-110'
                  : isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
              }`}>
                <Icon className={`w-3 h-3 ${
                  isCurrent || isCompleted ? 'text-white' : 'text-slate-400'
                }`} />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {step.label}
              </div>
            </div>
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className={`w-2 h-0.5 ${
                idx < stepIndex ? 'bg-emerald-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const PAGE_SIZE = 100;

function ExchangeListContent() {
  const navigate = useNavigate();
  const { t, dir, lang } = useMerchantLanguage();
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    filterExchanges();
  }, [exchanges, searchTerm, statusFilter]);

  const checkAuthAndFetch = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/merchant/login");
        return;
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      if (merchantData) {
        setMerchantId(merchantData.id);
        await fetchExchanges(merchantData.id);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchanges = async (mId: string) => {
    try {
      const { data } = await supabase
        .from("exchanges")
        .select("id, exchange_code, client_name, client_phone, reason, status, created_at")
        .eq("merchant_id", mId)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      setExchanges(data || []);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
    }
  };

  const filterExchanges = () => {
    let filtered = [...exchanges];

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.client_phone.includes(searchTerm) ||
          e.exchange_code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredExchanges(filtered);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Package className="w-7 h-7 text-emerald-600" />
          </div>
          <div className={dir === 'rtl' ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-slate-900">{t('exchangeRequests')}</h1>
            <p className="text-slate-600">{t('manageValidateRequests')}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="relative">
          <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5`} />
          <input
            type="text"
            placeholder={t('searchByNamePhoneCode')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className={`flex flex-wrap gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* All */}
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "all"
                ? "bg-slate-800 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Tous</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {exchanges.length}
            </span>
          </button>

          {/* Pending - needs attention */}
          <button
            onClick={() => setStatusFilter("pending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white shadow-md"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>En attente</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "pending" ? "bg-white/20 text-white" : "bg-amber-200 text-amber-800"
            }`}>
              {exchanges.filter(e => e.status === "pending").length}
            </span>
          </button>

          {/* Validated */}
          <button
            onClick={() => setStatusFilter("validated")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "validated"
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Validé</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "validated" ? "bg-white/20 text-white" : "bg-emerald-200 text-emerald-800"
            }`}>
              {exchanges.filter(e => e.status === "validated").length}
            </span>
          </button>

          {/* Preparing */}
          <button
            onClick={() => setStatusFilter("preparing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "preparing"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Préparation</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "preparing" ? "bg-white/20 text-white" : "bg-blue-200 text-blue-800"
            }`}>
              {exchanges.filter(e => e.status === "preparing").length}
            </span>
          </button>

          {/* Ready for pickup */}
          <button
            onClick={() => setStatusFilter("ready_for_pickup")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "ready_for_pickup"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Prêt</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "ready_for_pickup" ? "bg-white/20 text-white" : "bg-purple-200 text-purple-800"
            }`}>
              {exchanges.filter(e => e.status === "ready_for_pickup").length}
            </span>
          </button>

          {/* In transit */}
          <button
            onClick={() => setStatusFilter("in_transit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "in_transit"
                ? "bg-sky-500 text-white shadow-md"
                : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Transit</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "in_transit" ? "bg-white/20 text-white" : "bg-sky-200 text-sky-800"
            }`}>
              {exchanges.filter(e => e.status === "in_transit").length}
            </span>
          </button>

          {/* Completed */}
          <button
            onClick={() => setStatusFilter("completed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "completed"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Terminé</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "completed" ? "bg-white/20 text-white" : "bg-green-200 text-green-800"
            }`}>
              {exchanges.filter(e => e.status === "completed").length}
            </span>
          </button>

          {/* Rejected */}
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              statusFilter === "rejected"
                ? "bg-red-500 text-white shadow-md"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Refusé</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "rejected" ? "bg-white/20 text-white" : "bg-red-200 text-red-800"
            }`}>
              {exchanges.filter(e => e.status === "rejected").length}
            </span>
          </button>
        </div>
      </div>

      {/* List View */}
      {filteredExchanges.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-slate-600">{t('noExchangesFound')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('code')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('client')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('telephone')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('reason')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('date')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700 min-w-[180px]`}>
                  {t('status')}
                </th>
                <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} px-6 py-4 text-sm font-medium text-slate-700`}>
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredExchanges.map((exchange) => (
                <tr key={exchange.id} className="hover:bg-slate-50">
                  <td className={`px-6 py-4 text-sm font-medium text-slate-900 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {exchange.exchange_code}
                  </td>
                  <td className={`px-6 py-4 text-sm text-slate-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {exchange.client_name}
                  </td>
                  <td className={`px-6 py-4 text-sm text-slate-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {exchange.client_phone}
                  </td>
                  <td className={`px-6 py-4 text-sm text-slate-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {exchange.reason}
                  </td>
                  <td className={`px-6 py-4 text-sm text-slate-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {new Date(exchange.created_at).toLocaleDateString(
                      lang === 'ar' ? 'ar-TN' : 'fr-FR',
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusProgress status={exchange.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/merchant/exchange/${exchange.id}`}
                      className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                    >
                      {t('viewDetails')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MerchantExchangeList() {
  return (
    <MerchantLayout>
      <ExchangeListContent />
    </MerchantLayout>
  );
}
