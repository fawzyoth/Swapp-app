import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import MerchantLayout from "../../components/MerchantLayout";

// Delivery fee that is always charged
const DELIVERY_FEE = 9; // 9 TND delivery fee

interface ExchangePayment {
  id: string;
  exchange_code: string;
  client_name: string;
  status: string;
  created_at: string;
  validated_at?: string;
  completed_at?: string;
  payment_status: 'pending' | 'expected' | 'ready' | 'paid';
  payment_type: 'free' | 'paid'; // free = merchant pays delivery, paid = client pays
  client_payment: number; // Amount client paid (0 if free)
  merchant_balance: number; // What merchant earns/owes for this exchange
}

function PaymentsContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exchanges, setExchanges] = useState<ExchangePayment[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'expected' | 'ready' | 'paid'>('all');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/merchant/login");
        return;
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!merchantData) {
        setLoading(false);
        return;
      }

      // Fetch all exchanges for this merchant with payment info
      const { data: exchangeData } = await supabase
        .from("exchanges")
        .select("id, exchange_code, client_name, status, created_at, validated_at, completed_at, payment_status, payment_amount")
        .eq("merchant_id", merchantData.id)
        .in("status", ["validated", "ready_for_pickup", "preparing", "in_transit", "completed"])
        .order("created_at", { ascending: false });

      if (exchangeData) {
        const paymentsData: ExchangePayment[] = exchangeData.map((e: any) => {
          // Determine if it's free (merchant pays) or paid (client pays)
          const isFreeDelivery = e.payment_status === 'free';
          const clientPayment = e.payment_amount || 0;

          // Calculate merchant balance for this exchange:
          // - If FREE: merchant is charged 9 DT (negative balance)
          // - If PAID: merchant gets (client_payment - 9 DT)
          //   - If client paid 9: merchant gets 0
          //   - If client paid more than 9: merchant gets the difference
          //   - If client paid less than 9: merchant owes the difference (negative)
          let merchantBalance: number;
          if (isFreeDelivery) {
            merchantBalance = -DELIVERY_FEE; // Merchant pays 9 DT
          } else {
            merchantBalance = clientPayment - DELIVERY_FEE; // Could be positive, zero, or negative
          }

          // Calculate collection status based on exchange status
          let collectionStatus: 'pending' | 'expected' | 'ready' | 'paid' = 'pending';

          if (e.status === 'completed') {
            // For demo: mark older completed exchanges as paid
            const completedDate = new Date(e.completed_at || e.created_at);
            const daysSinceCompleted = Math.floor((Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
            collectionStatus = daysSinceCompleted > 7 ? 'paid' : 'ready';
          } else if (e.status === 'validated' || e.status === 'ready_for_pickup' || e.status === 'preparing' || e.status === 'in_transit') {
            collectionStatus = 'expected';
          }

          return {
            ...e,
            payment_status: collectionStatus,
            payment_type: isFreeDelivery ? 'free' : 'paid',
            client_payment: clientPayment,
            merchant_balance: merchantBalance,
          };
        });

        setExchanges(paymentsData);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats using merchant_balance
  const stats = {
    // Total balance ready to collect (positive = merchant receives, negative = merchant owes)
    totalDue: exchanges
      .filter(e => e.payment_status === 'ready')
      .reduce((sum, e) => sum + e.merchant_balance, 0),
    // Expected balance from in-progress exchanges
    expectedPayments: exchanges
      .filter(e => e.payment_status === 'expected')
      .reduce((sum, e) => sum + e.merchant_balance, 0),
    // Balance settled this month
    paidThisMonth: exchanges
      .filter(e => {
        if (e.payment_status !== 'paid') return false;
        const date = new Date(e.completed_at || e.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.merchant_balance, 0),
    // Total balance ever settled
    totalPaid: exchanges
      .filter(e => e.payment_status === 'paid')
      .reduce((sum, e) => sum + e.merchant_balance, 0),
  };

  // Group exchanges by month
  const groupedByMonth = exchanges.reduce((acc, exchange) => {
    const date = new Date(exchange.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    if (!acc[monthKey]) {
      acc[monthKey] = { label: monthLabel, exchanges: [] };
    }
    acc[monthKey].exchanges.push(exchange);
    return acc;
  }, {} as Record<string, { label: string; exchanges: ExchangePayment[] }>);

  const filteredExchanges = filter === 'all'
    ? exchanges
    : exchanges.filter(e => e.payment_status === filter);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Réglé</span>;
      case 'ready':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">À régler</span>;
      case 'expected':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">En attente</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">En cours</span>;
    }
  };

  const getPaymentTypeBadge = (type: 'free' | 'paid', clientPayment: number) => {
    if (type === 'free') {
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Gratuit</span>;
    }
    return <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">{clientPayment} TND</span>;
  };

  const getExchangeStatusLabel = (status: string) => {
    switch (status) {
      case 'validated': return 'Validé';
      case 'ready_for_pickup': return 'Prêt pour ramassage';
      case 'preparing': return 'En préparation';
      case 'in_transit': return 'En route';
      case 'completed': return 'Complété';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Wallet className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
            <p className="text-slate-600">Suivez vos paiements et commissions</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Frais de livraison: {DELIVERY_FEE} TND par colis</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Livraison gratuite (vous payez):</strong> {DELIVERY_FEE} TND déduit de votre solde</li>
                <li><strong>Client paie la livraison:</strong> Vous recevez (montant payé - {DELIVERY_FEE} TND)
                  <ul className="list-disc list-inside ml-4 text-xs mt-1">
                    <li>Si le client paie {DELIVERY_FEE} TND → vous recevez 0 TND</li>
                    <li>Si le client paie plus de {DELIVERY_FEE} TND → vous recevez la différence</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stats.totalDue >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <CheckCircle className={`w-5 h-5 ${stats.totalDue >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${stats.totalDue >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {stats.totalDue >= 0 ? '+' : ''}{stats.totalDue.toFixed(2)} TND
              </div>
              <div className="text-xs text-slate-600">
                {stats.totalDue >= 0 ? 'À recevoir' : 'À payer'}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {exchanges.filter(e => e.payment_status === 'ready').length} échange(s) prêt(s)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stats.expectedPayments >= 0 ? 'bg-amber-100' : 'bg-orange-100'}`}>
              <Clock className={`w-5 h-5 ${stats.expectedPayments >= 0 ? 'text-amber-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${stats.expectedPayments >= 0 ? 'text-amber-600' : 'text-orange-600'}`}>
                {stats.expectedPayments >= 0 ? '+' : ''}{stats.expectedPayments.toFixed(2)} TND
              </div>
              <div className="text-xs text-slate-600">Solde attendu</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {exchanges.filter(e => e.payment_status === 'expected').length} échange(s) en cours
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stats.paidThisMonth >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <Calendar className={`w-5 h-5 ${stats.paidThisMonth >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${stats.paidThisMonth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {stats.paidThisMonth >= 0 ? '+' : ''}{stats.paidThisMonth.toFixed(2)} TND
              </div>
              <div className="text-xs text-slate-600">Réglé ce mois</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {exchanges.filter(e => {
              if (e.payment_status !== 'paid') return false;
              const date = new Date(e.completed_at || e.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length} échange(s)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stats.totalPaid >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`w-5 h-5 ${stats.totalPaid >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${stats.totalPaid >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalPaid >= 0 ? '+' : ''}{stats.totalPaid.toFixed(2)} TND
              </div>
              <div className="text-xs text-slate-600">Total réglé</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Depuis le début
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tous', count: exchanges.length },
            { key: 'expected', label: 'En attente', count: exchanges.filter(e => e.payment_status === 'expected').length },
            { key: 'ready', label: 'À régler', count: exchanges.filter(e => e.payment_status === 'ready').length },
            { key: 'paid', label: 'Réglés', count: exchanges.filter(e => e.payment_status === 'paid').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Exchanges List */}
      {filteredExchanges.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Aucun paiement trouvé
          </h3>
          <p className="text-slate-600">
            Les paiements apparaîtront ici une fois que vous aurez des échanges validés.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByMonth)
            .filter(([_, group]) => group.exchanges.some(e => filter === 'all' || e.payment_status === filter))
            .map(([monthKey, group]) => {
              const monthExchanges = group.exchanges.filter(e => filter === 'all' || e.payment_status === filter);
              const monthTotal = monthExchanges.reduce((sum, e) => sum + e.merchant_balance, 0);
              const isExpanded = expandedMonth === monthKey;

              return (
                <div key={monthKey} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedMonth(isExpanded ? null : monthKey)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${monthTotal >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        <Calendar className={`w-5 h-5 ${monthTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 capitalize">{group.label}</h3>
                        <p className="text-sm text-slate-600">{monthExchanges.length} échange(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-bold ${monthTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {monthTotal >= 0 ? '+' : ''}{monthTotal.toFixed(2)} TND
                        </div>
                        <div className="text-xs text-slate-500">Solde</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Code</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Client</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Statut</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Votre solde</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {monthExchanges.map((exchange) => (
                            <tr key={exchange.id} className="hover:bg-slate-50">
                              <td className="px-4 py-4">
                                <span className="font-mono text-sm font-medium text-slate-900">
                                  {exchange.exchange_code}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-700">
                                {exchange.client_name}
                              </td>
                              <td className="px-4 py-4">
                                {getPaymentTypeBadge(exchange.payment_type, exchange.client_payment)}
                              </td>
                              <td className="px-4 py-4">
                                {getPaymentStatusBadge(exchange.payment_status)}
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-600">
                                {new Date(exchange.created_at).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <span className={`font-semibold ${
                                  exchange.merchant_balance > 0 ? 'text-emerald-600' :
                                  exchange.merchant_balance < 0 ? 'text-red-600' :
                                  'text-slate-600'
                                }`}>
                                  {exchange.merchant_balance >= 0 ? '+' : ''}{exchange.merchant_balance.toFixed(2)} TND
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Payment Schedule Info */}
      <div className="mt-8 bg-slate-50 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-slate-600" />
          Règlement des soldes
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-medium text-slate-900 mb-1">Fréquence</div>
            <p className="text-slate-600">Règlements hebdomadaires chaque lundi</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-medium text-slate-900 mb-1">Solde positif</div>
            <p className="text-slate-600">Vous recevez le montant par virement ou espèces</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-medium text-slate-900 mb-1">Solde négatif</div>
            <p className="text-slate-600">Déduit de vos prochains paiements</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MerchantPayments() {
  return (
    <MerchantLayout>
      <PaymentsContent />
    </MerchantLayout>
  );
}
