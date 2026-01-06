import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Search, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MerchantLayout from '../../components/MerchantLayout';

export default function MerchantChat() {
  const navigate = useNavigate();
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageSubscription = useRef<any>(null);

  useEffect(() => {
    checkAuth();
    fetchExchanges();

    return () => {
      // Cleanup subscription on unmount
      if (messageSubscription.current) {
        messageSubscription.current.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedExchange) {
      fetchMessages(selectedExchange.id);
      subscribeToMessages(selectedExchange.id);
    }

    return () => {
      // Cleanup previous subscription when exchange changes
      if (messageSubscription.current) {
        messageSubscription.current.unsubscribe();
      }
    };
  }, [selectedExchange?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/merchant/login');
    }
  };

  const fetchExchanges = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Optimize: Get merchant ID first
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (!merchantData) return;

      // Optimize: Only select needed fields and filter by merchant
      const { data } = await supabase
        .from('exchanges')
        .select('id, exchange_code, client_name, client_phone, status, created_at')
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to most recent 50 exchanges

      if (data) {
        setExchanges(data);
        if (data.length > 0 && !selectedExchange) {
          setSelectedExchange(data[0]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (exchangeId: string) => {
    try {
      // Optimize: Limit to last 100 messages
      const { data } = await supabase
        .from('messages')
        .select('id, message, sender_type, created_at')
        .eq('exchange_id', exchangeId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) {
        setMessages(data.reverse()); // Reverse to show oldest first
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Real-time subscription for new messages
  const subscribeToMessages = (exchangeId: string) => {
    messageSubscription.current = supabase
      .channel(`messages:${exchangeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `exchange_id=eq.${exchangeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
  };

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedExchange) return;

    const messageText = newMessage;
    setNewMessage(''); // Clear immediately for better UX

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          exchange_id: selectedExchange.id,
          sender_type: 'merchant',
          message: messageText,
        });

      if (error) {
        console.error('Error sending message:', error);
        setNewMessage(messageText); // Restore message on error
      }
    } catch (error) {
      console.error('Error:', error);
      setNewMessage(messageText); // Restore message on error
    }
  }, [newMessage, selectedExchange]);

  // Memoize filtered exchanges to avoid recalculation on every render
  const filteredExchanges = useMemo(() => {
    if (!searchTerm) return exchanges;

    const term = searchTerm.toLowerCase();
    return exchanges.filter(ex =>
      ex.client_name?.toLowerCase().includes(term) ||
      ex.exchange_code?.toLowerCase().includes(term) ||
      ex.client_phone?.includes(term)
    );
  }, [exchanges, searchTerm]);

  const formatTime = useCallback((date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const formatDate = useCallback((date: string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  }, []);

  const getStatusDisplay = useCallback((status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
      validated: { label: 'Validé', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeté', class: 'bg-red-100 text-red-800' },
      completed: { label: 'Complété', class: 'bg-blue-100 text-blue-800' },
      in_transit: { label: 'En transit', class: 'bg-purple-100 text-purple-800' },
    };
    return statusMap[status] || { label: status, class: 'bg-slate-100 text-slate-800' };
  }, []);

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
          <h1 className="text-2xl font-bold text-slate-900">Messagerie</h1>
          <p className="text-slate-600 mt-1">Communiquez avec vos clients</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-200px)] flex overflow-hidden">
          <div className="w-1/3 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un échange..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredExchanges.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>{searchTerm ? 'Aucun résultat' : 'Aucune conversation'}</p>
              </div>
            ) : (
              filteredExchanges.map((exchange) => {
                const statusDisplay = getStatusDisplay(exchange.status);
                return (
                  <div
                    key={exchange.id}
                    onClick={() => setSelectedExchange(exchange)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                      selectedExchange?.id === exchange.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{exchange.client_name}</h3>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                        {formatDate(exchange.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1 truncate">{exchange.exchange_code}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusDisplay.class}`}>
                      {statusDisplay.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedExchange ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-slate-900">{selectedExchange.client_name}</h2>
                <p className="text-sm text-slate-600">{selectedExchange.exchange_code}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">Aucun message</p>
                    <p className="text-sm">Démarrez la conversation avec votre client</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === 'merchant' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.sender_type === 'merchant'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-900'
                        } rounded-2xl px-4 py-2`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            msg.sender_type === 'merchant' ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{formatTime(msg.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MerchantLayout>
  );
}
