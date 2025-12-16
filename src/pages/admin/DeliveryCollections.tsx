import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { supabase, DeliveryDeposit, DEPOSIT_STATUS_LABELS, generateDepositNumber } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function DeliveryCollections() {
  const [deposits, setDeposits] = useState<DeliveryDeposit[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<any[]>([]);
  const [pendingCollections, setPendingCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewDeposit, setShowNewDeposit] = useState(false);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNotes, setDepositNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch deposits
      const { data: depositsData } = await supabase
        .from('delivery_deposits')
        .select(`
          *,
          delivery_person:delivery_persons(id, name, phone)
        `)
        .order('created_at', { ascending: false });

      // Fetch delivery persons
      const { data: dpData } = await supabase
        .from('delivery_persons')
        .select('*')
        .order('name');

      // Fetch pending collections (delivery verifications with payment but no deposit)
      const { data: pendingData } = await supabase
        .from('delivery_verifications')
        .select(`
          *,
          exchange:exchanges(
            id,
            exchange_code,
            merchant_id,
            merchants(name)
          ),
          delivery_person:delivery_persons(id, name)
        `)
        .eq('payment_collected', true)
        .is('deposit_id', null)
        .order('created_at', { ascending: false });

      setDeposits(depositsData || []);
      setDeliveryPersons(dpData || []);
      setPendingCollections(pendingData || []);
    } finally {
      setLoading(false);
    }
  };

  const createDeposit = async () => {
    if (!selectedDeliveryPerson || !depositAmount) return;

    setSaving(true);
    try {
      // Get pending collections for this delivery person
      const dpPending = pendingCollections.filter(
        p => p.delivery_person_id === selectedDeliveryPerson
      );

      const totalCollected = dpPending.reduce(
        (sum, p) => sum + (p.amount_collected || 0), 0
      );
      const amount = parseFloat(depositAmount);
      const discrepancy = totalCollected - amount;

      // Get next sequence number
      const { count } = await supabase
        .from('delivery_deposits')
        .select('*', { count: 'exact', head: true });

      const depositNumber = generateDepositNumber((count || 0) + 1);

      const { data: newDeposit, error } = await supabase
        .from('delivery_deposits')
        .insert({
          deposit_number: depositNumber,
          delivery_person_id: selectedDeliveryPerson,
          deposit_date: new Date().toISOString(),
          total_collected: totalCollected,
          total_exchanges: dpPending.length,
          amount_deposited: amount,
          discrepancy: discrepancy,
          status: discrepancy === 0 ? 'confirmed' : 'pending',
          received_by: 'admin', // TODO: Get actual admin user
          received_at: new Date().toISOString(),
          notes: depositNotes || null,
        })
        .select()
        .single();

      if (!error && newDeposit) {
        // Update delivery verifications with deposit_id
        const verificationIds = dpPending.map(p => p.id);
        await supabase
          .from('delivery_verifications')
          .update({ deposit_id: newDeposit.id })
          .in('id', verificationIds);

        // Reset form and refresh
        setShowNewDeposit(false);
        setSelectedDeliveryPerson('');
        setDepositAmount('');
        setDepositNotes('');
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

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

  const confirmDeposit = async (depositId: string) => {
    await supabase
      .from('delivery_deposits')
      .update({
        status: 'confirmed',
        received_at: new Date().toISOString()
      })
      .eq('id', depositId);
    fetchData();
  };

  // Calculate summary stats
  const stats = {
    totalPending: pendingCollections.reduce((sum, p) => sum + (p.amount_collected || 0), 0),
    pendingCount: pendingCollections.length,
    todayDeposits: deposits.filter(d =>
      new Date(d.deposit_date).toDateString() === new Date().toDateString()
    ).reduce((sum, d) => sum + d.amount_deposited, 0),
    pendingDeposits: deposits.filter(d => d.status === 'pending').length,
  };

  // Filter deposits
  const filteredDeposits = deposits.filter(d => {
    const matchesSearch =
      d.deposit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.delivery_person as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group pending collections by delivery person
  const pendingByPerson = pendingCollections.reduce((acc, p) => {
    const dpId = p.delivery_person_id;
    if (!acc[dpId]) {
      acc[dpId] = {
        deliveryPerson: p.delivery_person,
        collections: [],
        total: 0
      };
    }
    acc[dpId].collections.push(p);
    acc[dpId].total += p.amount_collected || 0;
    return acc;
  }, {} as Record<string, any>);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Collectes Livreurs</h1>
            <p className="text-slate-600">Gestion des dépôts espèces des livreurs</p>
          </div>
          <button
            onClick={() => setShowNewDeposit(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau Dépôt
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-slate-600">À Collecter</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalPending.toFixed(2)} TND</p>
            <p className="text-xs text-slate-500">{stats.pendingCount} échanges</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-slate-600">Dépôts Aujourd'hui</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.todayDeposits.toFixed(2)} TND</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-slate-600">Dépôts en Attente</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.pendingDeposits}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-sky-600" />
              <span className="text-sm text-slate-600">Total Dépôts</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{deposits.length}</p>
          </div>
        </div>

        {/* New Deposit Modal */}
        {showNewDeposit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Nouveau Dépôt Espèces</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Livreur
                  </label>
                  <select
                    value={selectedDeliveryPerson}
                    onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sélectionner un livreur</option>
                    {Object.keys(pendingByPerson).map(dpId => (
                      <option key={dpId} value={dpId}>
                        {pendingByPerson[dpId].deliveryPerson?.name} - {pendingByPerson[dpId].total.toFixed(2)} TND ({pendingByPerson[dpId].collections.length} échanges)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDeliveryPerson && pendingByPerson[selectedDeliveryPerson] && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Montant à collecter: <span className="font-bold text-slate-900">
                        {pendingByPerson[selectedDeliveryPerson].total.toFixed(2)} TND
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {pendingByPerson[selectedDeliveryPerson].collections.length} échanges en attente
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Montant Déposé (TND)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>

                {selectedDeliveryPerson && depositAmount && pendingByPerson[selectedDeliveryPerson] && (
                  <div className={`rounded-lg p-3 ${
                    parseFloat(depositAmount) === pendingByPerson[selectedDeliveryPerson].total
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {parseFloat(depositAmount) === pendingByPerson[selectedDeliveryPerson].total ? (
                      <p className="text-sm font-medium">✓ Montant exact</p>
                    ) : (
                      <p className="text-sm font-medium">
                        Écart: {(pendingByPerson[selectedDeliveryPerson].total - parseFloat(depositAmount)).toFixed(2)} TND
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={depositNotes}
                    onChange={(e) => setDepositNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Remarques..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewDeposit(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={createDeposit}
                  disabled={!selectedDeliveryPerson || !depositAmount || saving}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer Dépôt'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Collections by Delivery Person */}
        {Object.keys(pendingByPerson).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Collectes en Attente par Livreur</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {Object.entries(pendingByPerson).map(([dpId, data]: [string, any]) => (
                <div key={dpId} className="p-4 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{data.deliveryPerson?.name}</p>
                      <p className="text-sm text-slate-500">{data.collections.length} échanges</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">{data.total.toFixed(2)} TND</p>
                      <button
                        onClick={() => {
                          setSelectedDeliveryPerson(dpId);
                          setDepositAmount(data.total.toFixed(2));
                          setShowNewDeposit(true);
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Collecter →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deposits List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro ou livreur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="disputed">Contesté</option>
              </select>
            </div>
          </div>

          {filteredDeposits.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {filteredDeposits.map((deposit) => (
                <div key={deposit.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{deposit.deposit_number}</p>
                        <p className="text-sm text-slate-500">
                          {(deposit.delivery_person as any)?.name} • {deposit.total_exchanges} échanges
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{deposit.amount_deposited.toFixed(2)} TND</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(deposit.status)}
                        {deposit.discrepancy !== 0 && (
                          <span className="text-xs text-red-600">
                            Écart: {deposit.discrepancy.toFixed(2)} TND
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {deposit.status === 'pending' && (
                        <button
                          onClick={() => confirmDeposit(deposit.id)}
                          className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                        >
                          Confirmer
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {new Date(deposit.deposit_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Aucun dépôt trouvé
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
