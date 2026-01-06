import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Search, Phone, Clock, User, ExternalLink } from 'lucide-react';
import { supabase, VideoCall, VIDEO_CALL_STATUS_LABELS } from '../../lib/supabase';
import MerchantLayout from '../../components/MerchantLayout';

export default function MerchantVideoCallList() {
  const navigate = useNavigate();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    checkAuth();
    fetchVideoCalls();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/merchant/login');
    }
  };

  const fetchVideoCalls = async () => {
    try {
      // Get current merchant
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();

      if (!merchantData) {
        console.error('Merchant not found');
        setLoading(false);
        return;
      }

      // Fetch only video calls for this merchant
      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideoCalls(data || []);
    } catch (error) {
      console.error('Error fetching video calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCalls = videoCalls.filter(call => {
    const matchesSearch = call.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.client_phone.includes(searchTerm) ||
      call.room_id.includes(searchTerm);
    const matchesStatus = !filterStatus || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-sky-100 text-sky-800';
      case 'expired': return 'bg-slate-100 text-slate-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Appels Video</h2>
          <p className="text-slate-600">Historique et gestion des appels video avec vos clients</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Video className="w-6 h-6 text-sky-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{videoCalls.length}</span>
            </div>
            <h3 className="text-slate-600 text-sm">Total des appels</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {videoCalls.filter(c => c.status === 'pending').length}
              </span>
            </div>
            <h3 className="text-slate-600 text-sm">En attente</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Video className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {videoCalls.filter(c => c.status === 'active').length}
              </span>
            </div>
            <h3 className="text-slate-600 text-sm">En cours</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Phone className="w-6 h-6 text-slate-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {videoCalls.filter(c => c.status === 'completed').length}
              </span>
            </div>
            <h3 className="text-slate-600 text-sm">Termines</h3>
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
                  placeholder="Rechercher par nom, telephone ou room ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="active">En cours</option>
                <option value="completed">Termine</option>
                <option value="expired">Expire</option>
                <option value="cancelled">Annule</option>
              </select>
            </div>
          </div>
        </div>

        {/* Video Calls List */}
        {filteredCalls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun appel video</h3>
            <p className="text-slate-600">
              {searchTerm || filterStatus
                ? 'Aucun appel ne correspond a vos criteres'
                : 'Vous n\'avez pas encore d\'appels video'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Room ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duree
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{call.client_name}</p>
                          <p className="text-sm text-slate-500">{call.client_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600">{call.room_id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(call.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDuration(call.duration_seconds)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {VIDEO_CALL_STATUS_LABELS[call.status] || call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(call.status === 'pending' || call.status === 'active') && (
                        <button
                          onClick={() => navigate(`/merchant/call/${call.room_id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Rejoindre
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
