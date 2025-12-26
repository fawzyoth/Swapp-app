// JAX Delivery API Service
// Documentation: https://core.jax-delivery.com/api

const JAX_API_BASE = "https://core.jax-delivery.com/api";

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
  success: boolean;
  message?: string;
  ean?: string; // JAX tracking code (e.g., "SOU2215617325044")
  colis_id?: number;
  error?: string;
}

// Create exchange colis in JAX system
export const createJaxExchangeColis = async (
  token: string,
  data: JaxColisRequest,
): Promise<JaxColisResponse> => {
  try {
    const response = await fetch(
      `${JAX_API_BASE}/user/colis/add?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(
        `JAX API error: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    return result;
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

// Helper to build JAX request from exchange data
export const buildJaxRequestFromExchange = (
  exchange: {
    exchange_code: string;
    client_name: string;
    client_phone: string;
    client_address?: string;
    client_city?: string;
    product_name?: string;
    reason: string;
    payment_amount?: number;
  },
  merchant: {
    name: string;
    phone: string;
    business_address?: string;
    business_city?: string;
  },
): JaxColisRequest => {
  const clientGovId = getGovernorateId(exchange.client_city || "");
  const merchantGovId = getGovernorateId(merchant.business_city || "");

  return {
    referenceExterne: exchange.exchange_code,
    nomContact: exchange.client_name,
    tel: exchange.client_phone.replace(/\s/g, ""),
    tel2: exchange.client_phone.replace(/\s/g, ""),
    adresseLivraison: exchange.client_address || "",
    governorat: clientGovId.toString(),
    delegation: exchange.client_city || "",
    description: `Échange: ${exchange.product_name || "Produit"} - ${exchange.reason}`,
    cod: (exchange.payment_amount || 0).toString(),
    echange: 1, // This is an exchange
    gouvernorat_pickup: merchantGovId,
    adresse_pickup: merchant.business_address || "",
    expediteur_phone: parseInt(merchant.phone.replace(/\s/g, ""), 10) || 0,
    expediteur_name: merchant.name,
  };
};
