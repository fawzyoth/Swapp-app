// JAX Delivery API Service
// Documentation: https://core.jax-delivery.com/api
//
// Flow:
// 1. Create colis (/user/colis/add) - when merchant prints bordereau
// 2. Create pickup (/client/createByean) - scheduled for Wednesday/Sunday only

const JAX_API_BASE = "https://core.jax-delivery.com/api";

// Pickup days: Wednesday (3) and Sunday (0)
const PICKUP_DAYS = [0, 3]; // Sunday = 0, Wednesday = 3

// Default JAX token for all merchants (temporary - should be per-merchant in production)
export const DEFAULT_JAX_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NvcmUuamF4LWRlbGl2ZXJ5LmNvbS9hcGkvdXRpbGlzYXRldXJzL0xvbmdUb2tlbiIsImlhdCI6MTc2Njc2NjI5MSwiZXhwIjoxODI5ODM4MjkxLCJuYmYiOjE3NjY3NjYyOTEsImp0aSI6IjY4T1RuNDB2aVN2VzdpMHQiLCJzdWIiOiIzNDIyIiwicHJ2IjoiZDA5MDViY2Y2NWE2ZDk5MmQ5MGNiZmU0NjIyNmJkMzEzYWU1MTkzZiJ9.2OZPJSLbCALAMgmrUR41u1CNk5e6Ozagc5pHFMHBj_4";

// JAX Governorate mapping (city name -> JAX governorate ID)
// You may need to adjust these IDs based on JAX API response from /api/gouvernorats
export const GOVERNORATE_MAP: Record<string, number> = {
  // Tunis region
  tunis: 1,
  ariana: 2,
  "ben arous": 3,
  manouba: 4,
  // North
  bizerte: 5,
  beja: 6,
  jendouba: 7,
  kef: 8,
  siliana: 9,
  // North-East
  nabeul: 10,
  zaghouan: 11,
  // Center
  sousse: 12,
  monastir: 13,
  mahdia: 14,
  sfax: 15,
  kairouan: 16,
  kasserine: 17,
  "sidi bouzid": 18,
  // South
  gabes: 19,
  medenine: 20,
  tataouine: 21,
  gafsa: 22,
  tozeur: 23,
  kebili: 24,
};

// Get governorate ID from city name
export const getGovernorateId = (city: string): number => {
  if (!city) return 1; // Default to Tunis
  const normalizedCity = city.toLowerCase().trim();

  // Direct match
  if (GOVERNORATE_MAP[normalizedCity]) {
    return GOVERNORATE_MAP[normalizedCity];
  }

  // Partial match
  for (const [key, id] of Object.entries(GOVERNORATE_MAP)) {
    if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
      return id;
    }
  }

  return 1; // Default to Tunis
};

// JAX Colis creation request
export interface JaxColisRequest {
  referenceExterne: string; // Your exchange code
  nomContact: string; // Client name
  tel: string; // Client phone
  tel2?: string; // Secondary phone
  adresseLivraison: string; // Delivery address
  governorat: string; // Governorate ID (as string)
  delegation: string; // Delegation/area
  description: string; // Product description
  cod: string; // Cash on delivery amount (as string)
  echange: number; // 0 = normal, 1 = exchange
  gouvernorat_pickup: number; // Pickup governorate ID
  adresse_pickup: string; // Pickup address
  expediteur_phone: number; // Merchant phone
  expediteur_name: string; // Merchant name
}

// JAX API Response
export interface JaxColisResponse {
  success?: boolean;
  message?: string;
  code?: string; // JAX tracking code (e.g., "TUN3043305243138")
  ean?: string; // Alternative field name for tracking code
  colis_id?: number;
  error?: string;
  referenceExterne?: string;
}

// Create exchange colis in JAX system
export const createJaxExchangeColis = async (
  token: string,
  data: JaxColisRequest,
): Promise<JaxColisResponse> => {
  try {
    const response = await fetch(`${JAX_API_BASE}/user/colis/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Log the response for debugging
    console.log("JAX API Response:", result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || `JAX API error: ${response.status}`,
      };
    }

    // JAX API returns 'code' field for the tracking number
    // Normalize response to include success flag and ean field
    return {
      ...result,
      success: true,
      ean: result.code || result.ean, // Use 'code' field as 'ean'
    };
  } catch (error) {
    console.error("JAX API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Get colis status from JAX
export const getJaxColisStatus = async (
  token: string,
  ean: string,
): Promise<any> => {
  try {
    const response = await fetch(
      `${JAX_API_BASE}/user/colis/getstatubyean/${ean}?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`JAX API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("JAX Status Error:", error);
    return null;
  }
};

// Get all governorates from JAX (for mapping)
export const getJaxGouvernorats = async (token: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${JAX_API_BASE}/gouvernorats?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`JAX API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("JAX Gouvernorats Error:", error);
    return [];
  }
};

// ============================================
// PICKUP SCHEDULING (Wednesday & Sunday only)
// ============================================

// JAX Pickup Request
export interface JaxPickupRequest {
  adresse: string; // Pickup address
  nbrColis: string; // Number of colis
  colis_statut: string; // Status (10 = ready for pickup)
  colis_list: string[]; // List of EAN codes
  note?: string; // Optional note
  gouvernorat_id: number; // Pickup governorate
}

// JAX Pickup Response
export interface JaxPickupResponse {
  success?: boolean;
  message?: string;
  pickup_id?: number;
  error?: string;
}

// Check if today is a pickup day (Wednesday or Sunday)
export const isPickupDay = (): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return PICKUP_DAYS.includes(dayOfWeek);
};

// Get next pickup date (Wednesday or Sunday)
export const getNextPickupDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Calculate days until next Wednesday (3) and Sunday (0)
  let daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
  let daysUntilSunday = (0 - dayOfWeek + 7) % 7;

  // If today is the pickup day and it's before cutoff, use today
  if (daysUntilWednesday === 0) daysUntilWednesday = 0;
  if (daysUntilSunday === 0) daysUntilSunday = 0;

  // If both are 0 (today is a pickup day), return today
  // Otherwise pick the closest future day
  let daysToAdd: number;
  if (daysUntilWednesday === 0) {
    daysToAdd = 0;
  } else if (daysUntilSunday === 0) {
    daysToAdd = 0;
  } else {
    daysToAdd = Math.min(daysUntilWednesday, daysUntilSunday);
  }

  const pickupDate = new Date(today);
  pickupDate.setDate(today.getDate() + daysToAdd);
  return pickupDate;
};

// Format date for display
export const formatPickupDate = (date: Date): string => {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const dayName = days[date.getDay()];
  const dateStr = date.toLocaleDateString("fr-TN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${dayName} ${dateStr}`;
};

// Create pickup request in JAX (schedules actual pickup)
export const createJaxPickup = async (
  token: string,
  data: JaxPickupRequest,
): Promise<JaxPickupResponse> => {
  try {
    const response = await fetch(`${JAX_API_BASE}/client/createByean`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("JAX Pickup Response:", result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || `JAX API error: ${response.status}`,
      };
    }

    return {
      ...result,
      success: true,
    };
  } catch (error) {
    console.error("JAX Pickup Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Create pickup for multiple colis
export const schedulePickupForColis = async (
  token: string,
  eanList: string[],
  pickupAddress: string,
  gouvernoratId: number,
  note?: string,
): Promise<JaxPickupResponse> => {
  if (eanList.length === 0) {
    return { success: false, error: "Aucun colis à ramasser" };
  }

  const pickupRequest: JaxPickupRequest = {
    adresse: pickupAddress,
    nbrColis: eanList.length.toString(),
    colis_statut: "10", // Ready for pickup
    colis_list: eanList,
    note: note || "Pickup scheduled via SWAPP",
    gouvernorat_id: gouvernoratId,
  };

  return createJaxPickup(token, pickupRequest);
};

// Validation error for JAX request
export class JaxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JaxValidationError";
  }
}

// Helper to build JAX request from exchange data
export const buildJaxRequestFromExchange = (
  exchange: {
    exchange_code?: string;
    client_name?: string;
    client_phone?: string;
    client_address?: string;
    client_governorate_id?: number;
    client_city?: string; // Governorate name (for backward compatibility)
    client_delegation?: string;
    client_postal_code?: string; // Fallback for delegation (when client_delegation column doesn't exist)
    product_name?: string;
    reason?: string;
    payment_amount?: number;
  },
  merchant:
    | {
        name?: string;
        business_name?: string; // Nom commercial from branding settings
        phone?: string;
        business_address?: string;
        business_city?: string;
      }
    | null
    | undefined,
): JaxColisRequest => {
  // Validate required fields - throw errors instead of using fallbacks
  if (!exchange?.exchange_code) {
    throw new JaxValidationError("Code d'échange manquant");
  }
  if (!exchange?.client_name) {
    throw new JaxValidationError("Nom du client manquant");
  }
  if (!exchange?.client_phone) {
    throw new JaxValidationError("Téléphone du client manquant");
  }
  if (!exchange?.client_address) {
    throw new JaxValidationError("Adresse du client manquante");
  }
  if (!exchange?.client_governorate_id && !exchange?.client_city) {
    throw new JaxValidationError("Gouvernorat du client manquant");
  }

  // Check for delegation - can be in client_delegation or client_postal_code (fallback)
  const clientDelegation =
    exchange?.client_delegation || exchange?.client_postal_code;
  if (!clientDelegation) {
    throw new JaxValidationError("Délégation du client manquante");
  }

  // Use business_name (Nom commercial) or fallback to name
  const merchantName = merchant?.business_name || merchant?.name;
  if (!merchantName) {
    throw new JaxValidationError(
      "Nom commercial du marchand manquant (Paramètres > Marque)",
    );
  }
  if (!merchant?.phone) {
    throw new JaxValidationError("Téléphone du marchand manquant");
  }
  if (!merchant?.business_address) {
    throw new JaxValidationError(
      "Adresse du marchand manquante (Paramètres > Marque)",
    );
  }

  // Use governorate_id if available, otherwise try to get it from city name
  const clientGovId =
    exchange.client_governorate_id ||
    getGovernorateId(exchange.client_city || "");
  const merchantGovId = getGovernorateId(merchant.business_city || "");

  const clientPhone = exchange.client_phone.replace(/\s/g, "");
  const merchantPhone = merchant.phone.replace(/\s/g, "");

  return {
    referenceExterne: exchange.exchange_code,
    nomContact: exchange.client_name,
    tel: clientPhone,
    tel2: clientPhone,
    adresseLivraison: exchange.client_address,
    governorat: clientGovId.toString(),
    delegation: clientDelegation,
    description: `Échange: ${exchange.product_name || "Produit"} - ${exchange.reason || "Échange"}`,
    cod: (exchange.payment_amount || 0).toString(),
    echange: 1, // This is an exchange
    gouvernorat_pickup: merchantGovId,
    adresse_pickup: merchant.business_address,
    expediteur_phone: parseInt(merchantPhone, 10),
    expediteur_name: merchantName,
  };
};
