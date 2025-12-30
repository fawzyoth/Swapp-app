import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Package, Truck, MapPin, X, AlertCircle, MessageSquare, Phone, Calendar, CheckCircle } from 'lucide-react';
import { supabase, STATUS_LABELS } from '../../lib/supabase';

export default function ClientTracking() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [depot, setDepot] = useState<any>(null);
  const [transporter, setTransporter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeData();
  }, [code]);

  const fetchExchangeData = async () => {
    try {
      const { data: exchangeData } = await supabase
        .from('exchanges')
        .select('*')
        .eq('exchange_code', code)
        .maybeSingle();

      if (exchangeData) {
        setExchange(exchangeData);

        const { data: historyData } = await supabase
          .from('status_history')
          .select('*')
          .eq('exchange_id', exchangeData.id)
          .order('created_at', { ascending: false });

        setHistory(historyData || []);

        if (exchangeData.mini_depot_id) {
          const { data: depotData } = await supabase
            .from('mini_depots')
            .select('*')
            .eq('id', exchangeData.mini_depot_id)
            .maybeSingle();
          setDepot(depotData);
        }

        if (exchangeData.transporter_id) {
          const { data: transporterData } = await supabase
            .from('transporters')
            .select('*')
            .eq('id', exchangeData.transporter_id)
            .maybeSingle();
          setTransporter(transporterData);
        }
      }
    } catch (error) {
      console.error('Error fetching exchange:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressSteps = () => {
    const allSteps = [
      { key: 'pending', label: 'Demande soumise', icon: Clock },
      { key: 'validated', label: 'Validée', icon: CheckCircle },
      { key: 'preparing', label: 'En préparation', icon: Package },
      { key: 'in_transit', label: 'En transit', icon: Truck },
      { key: 'completed', label: 'Livrée', icon: Check },
    ];

    const statusOrder = ['pending', 'validated', 'preparing', 'in_transit', 'completed'];
    const currentIndex = statusOrder.indexOf(exchange?.status);

    return allSteps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex && exchange?.status !== 'rejected',
      isCurrent: index === currentIndex && exchange?.status !== 'rejected',
      isRejected: exchange?.status === 'rejected' && index > 0,
    }));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-700',
          icon: Clock,
          message: 'Votre demande est en cours d\'examen par le marchand',
          action: 'En attente de validation'
        };
      case 'validated':
        return {
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          icon: CheckCircle,
          message: 'Votre échange a été approuvé',
          action: 'Préparation en cours'
        };
      case 'preparing':
        return {
          color: 'bg-purple-50 border-purple-200',
          textColor: 'text-purple-700',
          icon: Package,
          message: 'Votre nouveau produit est en cours de préparation',
          action: 'Sera bientôt expédié'
        };
      case 'in_transit':
        return {
          color: 'bg-indigo-50 border-indigo-200',
          textColor: 'text-indigo-700',
          icon: Truck,
          message: 'Votre colis est en route',
          action: 'Livraison en cours'
        };
      case 'completed':
        return {
          color: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-700',
          icon: CheckCircle,
          message: 'Votre échange est terminé',
          action: 'Échange complété'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          icon: X,
          message: 'Votre demande a été refusée',
          action: 'Échange refusé'
        };
      default:
        return {
          color: 'bg-slate-50 border-slate-200',
          textColor: 'text-slate-700',
          icon: AlertCircle,
          message: '',
          action: ''
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Échange non trouvé</h2>
          <p className="text-slate-600 mb-6">Le code d'échange est invalide ou n'existe pas</p>
          <button
            onClick={() => navigate('/client/exchanges')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Voir mes échanges
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(exchange.status);
  const StatusIcon = statusConfig.icon;
  const progressSteps = getProgressSteps();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => navigate('/client/exchanges')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Retour à mes échanges</span>
        </button>

        <div className="space-y-6">
          <div className={`rounded-2xl border-2 p-6 ${statusConfig.color}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                <StatusIcon className={`w-8 h-8 ${statusConfig.textColor}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {statusConfig.action}
                </h1>
                <p className="text-slate-700 text-lg mb-4">{statusConfig.message}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Demande créée le {new Date(exchange.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {exchange.status !== 'rejected' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Progression de votre échange</h2>
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${(progressSteps.filter(s => s.isCompleted).length / progressSteps.length) * 100}%`
                    }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {progressSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : step.isCurrent
                            ? 'bg-white border-emerald-500'
                            : 'bg-white border-slate-300'
                        }`}>
                          <StepIcon className={`w-5 h-5 ${
                            step.isCompleted
                              ? 'text-white'
                              : step.isCurrent
                              ? 'text-emerald-500'
                              : 'text-slate-400'
                          }`} />
                        </div>
                        <div className="mt-3 text-center">
                          <div className={`text-sm font-medium ${
                            step.isCompleted || step.isCurrent
                              ? 'text-slate-900'
                              : 'text-slate-500'
                          }`}>
                            {step.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {exchange.status === 'rejected' && exchange.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Motif du refus</h3>
                  <p className="text-red-700">{exchange.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Détails de la demande</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-500 mb-1">Code de suivi</div>
                <div className="font-mono font-semibold text-slate-900 text-lg">{exchange.exchange_code}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Nom du client</div>
                <div className="font-medium text-slate-900">{exchange.client_name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Téléphone</div>
                <div className="font-medium text-slate-900">{exchange.client_phone}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Motif de l'échange</div>
                <div className="font-medium text-slate-900">{exchange.reason}</div>
              </div>
            </div>
          </div>

          {(depot || transporter) && (
            <div className="grid md:grid-cols-2 gap-6">
              {depot && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Point de retrait</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-slate-500">Nom</div>
                      <div className="font-medium text-slate-900">{depot.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Adresse</div>
                      <div className="font-medium text-slate-900">{depot.address}</div>
                      <div className="text-slate-700">{depot.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Téléphone</div>
                      <a href={`tel:${depot.phone}`} className="font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {depot.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {transporter && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Transporteur</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-slate-500">Société</div>
                      <div className="font-medium text-slate-900">{transporter.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Contact</div>
                      <a href={`tel:${transporter.phone}`} className="font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {transporter.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Historique</h2>
              <div className="space-y-4">
                {history.map((item, index) => {
                  const ItemIcon = getStatusConfig(item.status).icon;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-lg ${getStatusConfig(item.status).color}`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        {index < history.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 min-h-[24px] my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="font-medium text-slate-900">{STATUS_LABELS[item.status]}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(item.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">Besoin d'aide ?</h3>
                <p className="text-slate-700 mb-4">Contactez le marchand via la messagerie pour toute question sur votre échange.</p>
                <Link
                  to="/client/chat"
                  className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ouvrir la messagerie
                </Link>
              </div>
            </div>
          </div>

          {exchange.photos && exchange.photos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Photos du produit</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {exchange.photos.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
