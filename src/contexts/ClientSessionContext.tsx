import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface ClientInfo {
  name: string;
  phone: string;
  lastUpdated: string;
}

interface ScannedMerchant {
  id: string;
  name: string;
  logoUrl?: string;
  scannedAt: string;
  lastInteraction: string;
  exchangeCount: number;
  reviewCount: number;
}

interface ClientSessionContextType {
  // Client info
  clientInfo: ClientInfo | null;
  setClientInfo: (name: string, phone: string) => void;
  clearClientInfo: () => void;
  isClientLoggedIn: boolean;

  // Scanned merchants
  scannedMerchants: ScannedMerchant[];
  addScannedMerchant: (merchant: { id: string; name: string; logoUrl?: string }) => void;
  updateMerchantInteraction: (merchantId: string, type: 'exchange' | 'review') => void;
  getMerchant: (merchantId: string) => ScannedMerchant | undefined;
}

const ClientSessionContext = createContext<ClientSessionContextType | undefined>(undefined);

const CLIENT_INFO_KEY = 'swapp_client_info';
const SCANNED_MERCHANTS_KEY = 'swapp_scanned_merchants';

export function ClientSessionProvider({ children }: { children: ReactNode }) {
  // Client info state
  const [clientInfo, setClientInfoState] = useState<ClientInfo | null>(() => {
    try {
      const saved = localStorage.getItem(CLIENT_INFO_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading client info:', e);
    }
    return null;
  });

  // Scanned merchants state
  const [scannedMerchants, setScannedMerchants] = useState<ScannedMerchant[]>(() => {
    try {
      const saved = localStorage.getItem(SCANNED_MERCHANTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading scanned merchants:', e);
    }
    return [];
  });

  // Persist client info
  useEffect(() => {
    if (clientInfo) {
      localStorage.setItem(CLIENT_INFO_KEY, JSON.stringify(clientInfo));
    }
  }, [clientInfo]);

  // Persist scanned merchants
  useEffect(() => {
    localStorage.setItem(SCANNED_MERCHANTS_KEY, JSON.stringify(scannedMerchants));
  }, [scannedMerchants]);

  // Set client info
  const setClientInfo = (name: string, phone: string) => {
    setClientInfoState({
      name,
      phone,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Clear client info (logout)
  const clearClientInfo = () => {
    setClientInfoState(null);
    localStorage.removeItem(CLIENT_INFO_KEY);
  };

  // Add a scanned merchant
  const addScannedMerchant = (merchant: { id: string; name: string; logoUrl?: string }) => {
    setScannedMerchants((prev) => {
      // Check if merchant already exists
      const existing = prev.find((m) => m.id === merchant.id);
      if (existing) {
        // Update last interaction time
        return prev.map((m) =>
          m.id === merchant.id
            ? { ...m, lastInteraction: new Date().toISOString() }
            : m
        );
      }
      // Add new merchant
      return [
        {
          id: merchant.id,
          name: merchant.name,
          logoUrl: merchant.logoUrl,
          scannedAt: new Date().toISOString(),
          lastInteraction: new Date().toISOString(),
          exchangeCount: 0,
          reviewCount: 0,
        },
        ...prev,
      ];
    });
  };

  // Update merchant interaction count
  const updateMerchantInteraction = (merchantId: string, type: 'exchange' | 'review') => {
    setScannedMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              lastInteraction: new Date().toISOString(),
              exchangeCount: type === 'exchange' ? m.exchangeCount + 1 : m.exchangeCount,
              reviewCount: type === 'review' ? m.reviewCount + 1 : m.reviewCount,
            }
          : m
      )
    );
  };

  // Get a specific merchant
  const getMerchant = (merchantId: string) => {
    return scannedMerchants.find((m) => m.id === merchantId);
  };

  return (
    <ClientSessionContext.Provider
      value={{
        clientInfo,
        setClientInfo,
        clearClientInfo,
        isClientLoggedIn: !!clientInfo,
        scannedMerchants,
        addScannedMerchant,
        updateMerchantInteraction,
        getMerchant,
      }}
    >
      {children}
    </ClientSessionContext.Provider>
  );
}

export function useClientSession() {
  const context = useContext(ClientSessionContext);
  if (!context) {
    throw new Error('useClientSession must be used within a ClientSessionProvider');
  }
  return context;
}
