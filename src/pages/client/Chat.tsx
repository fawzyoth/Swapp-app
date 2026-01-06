import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MessageSquare, Send, Clock, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ClientLayout from '../../components/ClientLayout';

export default function ClientChat() {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageSubscription = useRef<any>(null);

  useEffect(() => {
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

  const fetchExchanges = async () => {
    try {
      // Get client phone from session storage
      const clientPhone = sessionStorage.getItem('client_phone');
      if (!clientPhone) {
        setLoading(false);
        return;
      }

      // Optimize: Only select needed fields and limit results
      const { data } = await supabase
        .from('exchanges')
        .select('id, exchange_code, reason, status, created_at, merchant_id')
        .eq('client_phone', clientPhone)
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
          sender_type: 'client',
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
      at_depot: { label: 'Au dépôt', class: 'bg-orange-100 text-orange-800' },
    };
    return statusMap[status] || { label: status, class: 'bg-slate-100 text-slate-800' };
  }, []);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messagerie</h1>
        <p className="text-slate-600 mt-1">Communiquez avec le marchand</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-200px)] flex overflow-hidden">
        <div className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Mes échanges</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {exchanges.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Aucun échange</p>
              </div>
            ) : (
              exchanges.map((exchange) => {
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
                      <h3 className="font-semibold text-slate-900 truncate">{exchange.exchange_code}</h3>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                        {formatDate(exchange.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 truncate">{exchange.reason}</p>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">{selectedExchange.exchange_code}</h2>
                    <p className="text-sm text-slate-600">{selectedExchange.reason}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusDisplay(selectedExchange.status).class}`}>
                    {getStatusDisplay(selectedExchange.status).label}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">Aucun message</p>
                    <p className="text-sm">Démarrez la conversation avec le marchand</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.sender_type === 'client'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-900'
                        } rounded-2xl px-4 py-2`}>
                          {msg.sender_type === 'merchant' && (
                            <p className="text-xs font-semibold mb-1 opacity-75">Marchand</p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            msg.sender_type === 'client' ? 'text-blue-100' : 'text-slate-500'
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
                <p className="text-lg">Sélectionnez un échange</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
