import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Phone,
  MapPin,
  Package,
  Video,
  Clock,
  TrendingUp,
  Info,
  ScanLine,
  KeyRound,
  Home
} from 'lucide-react';
import { supabase, STATUS_LABELS } from '../../lib/supabase';
import DeliveryLayout from '../../components/DeliveryLayout';

export default function ExchangeVerification() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<any>(null);
  const [clientHistory, setClientHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBagScannerModal, setShowBagScannerModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bagId, setBagId] = useState('');
  const [useBarcodeScanner, setUseBarcodeScanner] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (code) {
      fetchExchangeData();
    }
  }, [code]);

  const fetchExchangeData = async () => {
    try {
      const { data: exchangeData, error } = await supabase
        .from('exchanges')
        .select('*')
        .eq('exchange_code', code)
        .maybeSingle();

      if (error) throw error;

      if (exchangeData) {
        setExchange(exchangeData);

        // Fetch client history
        const { data: history } = await supabase
          .from('exchanges')
          .select('*')
          .eq('client_phone', exchangeData.client_phone)
          .neq('id', exchangeData.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setClientHistory(history || []);
      }
    } catch (error) {
      console.error('Error fetching exchange:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptExchange = () => {
    setShowBagScannerModal(true);
  };

  const handleRejectExchange = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison pour le refus');
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Update exchange status
      await supabase
        .from('exchanges')
        .update({
          status: 'delivery_rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', exchange.id);

      // Create verification record
      await supabase
        .from('delivery_verifications')
        .insert({
          exchange_id: exchange.id,
          delivery_person_id: user.id,
          status: 'rejected',
          rejection_reason: rejectionReason,
        });

      // Add status history
      await supabase
        .from('status_history')
        .insert({
          exchange_id: exchange.id,
          status: 'delivery_rejected',
        });

      setShowRejectModal(false);
      navigate('/delivery/dashboard');
    } catch (error) {
      console.error('Error rejecting exchange:', error);
      alert('Erreur lors du refus de l\'échange');
    } finally {
      setProcessing(false);
    }
  };

  const handleBagScanned = async (scannedBagId: string) => {
    setBagId(scannedBagId);
  };

  const confirmBagAssignment = async () => {
    if (!bagId.trim()) {
      alert('Veuillez scanner ou entrer l\'ID du sac');
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Update exchange status and bag_id
      await supabase
        .from('exchanges')
        .update({
          status: 'delivery_verified',
          bag_id: bagId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', exchange.id);

      // Create verification record
      await supabase
        .from('delivery_verifications')
        .insert({
          exchange_id: exchange.id,
          delivery_person_id: user.id,
          status: 'accepted',
          bag_id: bagId,
        });

      // Add status history
      await supabase
        .from('status_history')
        .insert({
          exchange_id: exchange.id,
          status: 'delivery_verified',
        });

      setShowBagScannerModal(false);
      navigate('/delivery/dashboard');
    } catch (error) {
      console.error('Error accepting exchange:', error);
      alert('Erreur lors de l\'acceptation de l\'échange');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </DeliveryLayout>
    );
  }

  if (!exchange) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Échange non trouvé</h2>
            <p className="text-slate-600 mb-4">Le code "{code}" n'existe pas.</p>
            <button
              onClick={() => navigate('/delivery/scan')}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Retour au scanner
            </button>
          </div>
        </div>
      </DeliveryLayout>
    );
  }

  const historyStats = {
    total: clientHistory.length,
    validated: clientHistory.filter(h => h.status === 'validated' || h.status === 'completed' || h.status === 'delivery_verified').length,
    rejected: clientHistory.filter(h => h.status === 'rejected' || h.status === 'delivery_rejected').length,
  };

  return (
    <DeliveryLayout>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/delivery/scan')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour au scanner</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exchange Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{exchange.exchange_code}</h2>
                  <p className="text-slate-600">
                    Créé le {new Date(exchange.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  exchange.status === 'validated' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  exchange.status === 'in_transit' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {STATUS_LABELS[exchange.status]}
                </span>
              </div>

              {/* Client & Product Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-900">Client</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Nom:</span>
                      <p className="font-medium text-slate-900">{exchange.client_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Téléphone:</span>
                      <p className="font-medium text-slate-900">
                        <a href={`tel:${exchange.client_phone}`} className="text-amber-600 hover:text-amber-700 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {exchange.client_phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-900">Produit</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Nom:</span>
                      <p className="font-medium text-slate-900">{exchange.product_name || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Raison d'échange:</span>
                      <p className="font-medium text-slate-900">{exchange.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-amber-700" />
                  <h3 className="font-semibold text-slate-900">Adresse de livraison</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">{exchange.client_address || 'Non fournie'}</p>
                      <p className="text-slate-700">
                        {exchange.client_city && exchange.client_postal_code
                          ? `${exchange.client_city} ${exchange.client_postal_code}, ${exchange.client_country || 'Tunisia'}`
                          : 'Informations incomplètes'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Video */}
              {exchange.video && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-slate-900">Vidéo de référence</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(exchange.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      src={exchange.video}
                      controls
                      className="w-full max-h-96"
                      poster=""
                    />
                  </div>
                  <p className="text-sm text-amber-700 mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Important:</strong> Comparez le produit présenté par le client avec cette vidéo de référence avant d'accepter l'échange.
                  </p>
                </div>
              )}

              {/* Photos */}
              {exchange.photos && exchange.photos.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Photos du produit</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {exchange.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={handleAcceptExchange}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accepter l'échange
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Refuser l'échange
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Client History */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Historique du client</h3>
              </div>

              {clientHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">Premier échange de ce client</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-900">{historyStats.total}</div>
                      <div className="text-xs text-slate-600">Échanges</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700">{historyStats.validated}</div>
                      <div className="text-xs text-emerald-700">Validés</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-2xl font-bold text-red-700">{historyStats.rejected}</div>
                      <div className="text-xs text-red-700">Refusés</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Derniers échanges</h4>
                    {clientHistory.slice(0, 3).map((h) => (
                      <div key={h.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-slate-600">{h.exchange_code}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            h.status === 'validated' || h.status === 'completed' || h.status === 'delivery_verified'
                              ? 'bg-emerald-100 text-emerald-700'
                              : h.status === 'rejected' || h.status === 'delivery_rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {STATUS_LABELS[h.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{h.reason}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(h.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {historyStats.total > 0 && (
                    <div className={`rounded-lg p-3 border ${
                      historyStats.validated / historyStats.total >= 0.7
                        ? 'bg-emerald-50 border-emerald-200'
                        : historyStats.validated / historyStats.total >= 0.4
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${
                          historyStats.validated / historyStats.total >= 0.7
                            ? 'text-emerald-600'
                            : historyStats.validated / historyStats.total >= 0.4
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">
                          Taux de validation: {Math.round((historyStats.validated / historyStats.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Refuser l'échange</h3>
                <p className="text-slate-600 mb-6">
                  Veuillez expliquer pourquoi vous refusez cet échange
                </p>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: Le produit ne correspond pas à la vidéo de référence..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    disabled={processing}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRejectExchange}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {processing ? 'Traitement...' : 'Confirmer le refus'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bag Scanner Modal */}
        {showBagScannerModal && (
          <BagScannerModal
            onScan={handleBagScanned}
            bagId={bagId}
            setBagId={setBagId}
            useBarcodeScanner={useBarcodeScanner}
            setUseBarcodeScanner={setUseBarcodeScanner}
            onConfirm={confirmBagAssignment}
            onCancel={() => setShowBagScannerModal(false)}
            processing={processing}
          />
        )}
      </div>
    </DeliveryLayout>
  );
}

// Bag Scanner Modal Component
function BagScannerModal({
  onScan,
  bagId,
  setBagId,
  useBarcodeScanner,
  setUseBarcodeScanner,
  onConfirm,
  onCancel,
  processing
}: {
  onScan: (bagId: string) => void;
  bagId: string;
  setBagId: (id: string) => void;
  useBarcodeScanner: boolean;
  setUseBarcodeScanner: (use: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  processing: boolean;
}) {
  useEffect(() => {
    if (useBarcodeScanner && !bagId) {
      const scanner = new Html5QrcodeScanner(
        'bag-scanner',
        { fps: 10, qrbox: { width: 250, height: 100 } },
        false
      );

      scanner.render(
        (decodedText: string) => {
          setBagId(decodedText);
          scanner.clear();
          setUseBarcodeScanner(false);
        },
        () => {}
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [useBarcodeScanner, bagId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ScanLine className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Scanner le sac</h3>
              <p className="text-slate-600 text-sm">Scannez le code-barres du sac pour l'assigner</p>
            </div>
          </div>

          {bagId ? (
            <div className="mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">Sac scanné</span>
                </div>
                <p className="font-mono text-lg text-emerald-800">{bagId}</p>
              </div>
              <button
                onClick={() => {
                  setBagId('');
                  setUseBarcodeScanner(true);
                }}
                className="mt-2 text-sm text-amber-600 hover:text-amber-700"
              >
                Scanner un autre sac
              </button>
            </div>
          ) : useBarcodeScanner ? (
            <div className="mb-6">
              <div id="bag-scanner" className="mb-4"></div>
              <button
                onClick={() => setUseBarcodeScanner(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <KeyRound className="w-5 h-5" />
                Entrer l'ID manuellement
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID du sac
              </label>
              <input
                type="text"
                value={bagId}
                onChange={(e) => setBagId(e.target.value)}
                placeholder="Entrez l'ID du sac..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
              <button
                onClick={() => setUseBarcodeScanner(true)}
                className="mt-2 text-sm text-amber-600 hover:text-amber-700"
              >
                Utiliser le scanner
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={processing}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={processing || !bagId}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              {processing ? 'Traitement...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
