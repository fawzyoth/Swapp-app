import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase, DEPOSIT_STATUS_LABELS } from '../../lib/supabase';
import DeliveryLayout from '../../components/DeliveryLayout';

export default function DeliveryWallet() {
  const [collections, setCollections] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPerson, setDeliveryPerson] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current delivery person
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: dpData } = await supabase
        .from('delivery_persons')
        .select('*')
        .eq('email', user.email)
        .single();

      if (dpData) {
        setDeliveryPerson(dpData);

        // Fetch collections (delivery verifications with payment)
        const { data: collectionsData } = await supabase
          .from('delivery_verifications')
          .select(`
            *,
            exchange:exchanges(
              id,
              exchange_code,
              client_name,
              merchant_id,
              merchants(name)
            )
          `)
          .eq('delivery_person_id', dpData.id)
          .eq('payment_collected', true)
          .order('created_at', { ascending: false });

        // Fetch deposits
        const { data: depositsData } = await supabase
          .from('delivery_deposits')
          .select('*')
          .eq('delivery_person_id', dpData.id)
          .order('created_at', { ascending: false });

        setCollections(collectionsData || []);
        setDeposits(depositsData || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalCollected = collections.reduce((sum, c) => sum + (c.amount_collected || 0), 0);
  const totalDeposited = deposits
    .filter(d => d.status === 'confirmed')
    .reduce((sum, d) => sum + d.amount_deposited, 0);
  const pendingDeposit = totalCollected - totalDeposited;

  const pendingCollections = collections.filter(c => !c.deposit_id);
  const todayCollections = collections.filter(c =>
    new Date(c.created_at).toDateString() === new Date().toDateString()
  );
  const todayAmount = todayCollections.reduce((sum, c) => sum + (c.amount_collected || 0), 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-emerald-100 text-emerald-700',
      disputed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {DEPOSIT_STATUS_LABELS[status as keyof typeof DEPOSIT_STATUS_LABELS] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-sky-600" />
            Mon Portefeuille
          </h1>
          <p className="text-slate-600 mt-1">Suivi de vos collectes et dépôts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{pendingDeposit.toFixed(2)} TND</p>
            <p className="text-xs text-slate-500">À déposer</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sky-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-sky-600">{todayAmount.toFixed(2)} TND</p>
            <p className="text-xs text-slate-500">Collecté aujourd'hui</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{totalDeposited.toFixed(2)} TND</p>
            <p className="text-xs text-slate-500">Total déposé</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{collections.length}</p>
            <p className="text-xs text-slate-500">Collectes totales</p>
          </div>
        </div>

        {/* Pending Collections Alert */}
        {pendingCollections.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900">Collectes en attente de dépôt</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Vous avez {pendingCollections.length} collecte(s) pour un total de{' '}
                  <strong>{pendingDeposit.toFixed(2)} TND</strong> à déposer au bureau SWAPP.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Collections */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Collectes Récentes</h2>
              <ArrowDownRight className="w-5 h-5 text-emerald-600" />
            </div>

            {collections.length > 0 ? (
              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {collections.slice(0, 10).map((collection) => (
                  <div key={collection.id} className="p-4 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {collection.exchange?.exchange_code}
                        </p>
                        <p className="text-sm text-slate-500">
                          {collection.exchange?.client_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {collection.exchange?.merchants?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          +{collection.amount_collected?.toFixed(2)} TND
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(collection.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                        {!collection.deposit_id && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                            Non déposé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Aucune collecte
              </div>
            )}
          </div>

          {/* Deposits History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Historique Dépôts</h2>
              <ArrowUpRight className="w-5 h-5 text-sky-600" />
            </div>

            {deposits.length > 0 ? (
              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="p-4 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {deposit.deposit_number}
                        </p>
                        <p className="text-sm text-slate-500">
                          {deposit.total_exchanges} échanges
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(deposit.deposit_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {deposit.amount_deposited.toFixed(2)} TND
                        </p>
                        {getStatusBadge(deposit.status)}
                        {deposit.discrepancy !== 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Écart: {deposit.discrepancy.toFixed(2)} TND
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Aucun dépôt
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Comment déposer vos collectes?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Rendez-vous au bureau SWAPP avec l'argent collecté</li>
            <li>2. Présentez votre ID livreur à l'agent</li>
            <li>3. L'agent vérifiera le montant et confirmera le dépôt</li>
            <li>4. Vous recevrez une confirmation dans votre portefeuille</li>
          </ul>
        </div>
      </div>
    </DeliveryLayout>
  );
}
