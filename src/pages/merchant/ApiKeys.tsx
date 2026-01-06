import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MerchantLayout from '../../components/MerchantLayout';

interface ApiKey {
  id: string;
  key_name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  rate_limit_per_minute: number;
}

export default function ApiKeys() {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState<any>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [setupNeeded, setSetupNeeded] = useState(false);

  useEffect(() => {
    checkAuth();
    loadApiKeys();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/merchant/login');
      return;
    }

    const { data: merchantData } = await supabase
      .from('merchants')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (merchantData) {
      setMerchant(merchantData);
    }
  };

  const loadApiKeys = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (merchantError || !merchantData) {
        console.error('Merchant error:', merchantError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('merchant_api_keys')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not exist yet
        console.warn('API keys table error (might not exist yet):', error);
        setApiKeys([]);
        setSetupNeeded(true);
      } else {
        setApiKeys(data || []);
        setSetupNeeded(false);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'swapp_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const hashKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const createApiKey = async () => {
    if (!newKeyName.trim() || !merchant) {
      alert('Veuillez entrer un nom pour la clé API');
      return;
    }

    try {
      const apiKey = generateApiKey();
      const keyHash = await hashKey(apiKey);
      const keyPrefix = apiKey.substring(0, 12) + '...';

      console.log('Creating API key for merchant:', merchant.id);

      const { data, error } = await supabase
        .from('merchant_api_keys')
        .insert({
          merchant_id: merchant.id,
          key_name: newKeyName,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          is_active: true,
          rate_limit_per_minute: 100,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        alert('Erreur lors de la création de la clé API: ' + error.message);
        throw error;
      }

      console.log('API key created successfully:', data);
      setGeneratedKey(apiKey);
      setNewKeyName('');
      loadApiKeys();
    } catch (error: any) {
      console.error('Error creating API key:', error);
      alert('Erreur: ' + (error.message || 'Impossible de créer la clé API'));
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('merchant_api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('merchant_api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadApiKeys();
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Key className="w-7 h-7 text-blue-600" />
          Clés API
        </h1>
        <p className="text-slate-600 mt-1">
          Gérez vos clés API pour l'intégration avec des applications tierces
        </p>
      </div>

      {/* Setup Warning */}
      {setupNeeded && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Configuration requise</h3>
              <p className="text-sm text-amber-700 mt-1 mb-3">
                La table API n'existe pas encore dans votre base de données. Vous devez exécuter le script SQL de configuration.
              </p>
              <ol className="text-sm text-amber-800 space-y-2 ml-4 list-decimal">
                <li>Ouvrez votre tableau de bord Supabase</li>
                <li>Allez dans <strong>SQL Editor</strong></li>
                <li>Créez une nouvelle requête</li>
                <li>Copiez le contenu du fichier <code className="bg-amber-100 px-1 rounded">api/setup-api-keys.sql</code></li>
                <li>Collez et exécutez la requête</li>
                <li>Rafraîchissez cette page</li>
              </ol>
              <a
                href="https://supabase.com/dashboard/project/_/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
              >
                Ouvrir Supabase SQL Editor →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Link */}
      {!setupNeeded && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Code className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Documentation API</h3>
              <p className="text-sm text-blue-700 mt-1">
                Consultez notre documentation complète pour intégrer notre API dans votre application.
              </p>
              <a
                href="/api/README.md"
                target="_blank"
                className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Voir la documentation →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create API Key Button */}
      {!setupNeeded && (
        <div className="mb-6">
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Créer une nouvelle clé
          </button>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Vos clés API</h2>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-12 text-center">
            <Key className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">Aucune clé API créée</p>
            <p className="text-sm text-slate-400">
              Créez une clé API pour commencer à utiliser notre API
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{key.key_name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        key.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {key.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono bg-slate-100 px-3 py-1 rounded">
                        {key.key_prefix}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.key_prefix, key.id)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title="Copier le préfixe"
                      >
                        {copiedKey === key.id ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>Créée le {new Date(key.created_at).toLocaleDateString('fr-FR')}</p>
                      {key.last_used_at && (
                        <p>Dernière utilisation: {new Date(key.last_used_at).toLocaleString('fr-FR')}</p>
                      )}
                      <p>Limite: {key.rate_limit_per_minute} requêtes/minute</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        key.is_active
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {key.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Warning for inactive keys */}
                {!key.is_active && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Cette clé est désactivée et ne peut pas être utilisée pour les requêtes API
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Créer une nouvelle clé API
            </h2>

            {!generatedKey ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de la clé
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="ex: Application mobile, Site web..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Donnez un nom descriptif pour identifier cette clé
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewKeyModal(false);
                      setNewKeyName('');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createApiKey}
                    disabled={!newKeyName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Clé API créée avec succès!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Copiez cette clé maintenant. Elle ne sera plus affichée.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <code className="block text-sm font-mono bg-white px-3 py-2 rounded border border-green-300 break-all">
                      {generatedKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedKey, 'new-key')}
                      className="absolute top-2 right-2 p-1.5 bg-green-100 hover:bg-green-200 rounded transition-colors"
                    >
                      {copiedKey === 'new-key' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowNewKeyModal(false);
                    setGeneratedKey(null);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}
