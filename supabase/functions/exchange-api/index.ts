import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-merchant-id',
}

interface ExchangeCreateRequest {
  client: {
    name: string
    phone: string
    email?: string
    address: string
    city: string
    governorate_id?: number
    delegation?: string
    postal_code?: string
    country?: string
  }
  product: {
    name: string
    sku?: string
    price?: number
    category?: string
  }
  exchange: {
    reason: string
    description?: string
    payment_type: 'free' | 'paid'
    payment_amount: number
  }
  media?: {
    video_url?: string
    video?: string
    images?: string[]
  }
  metadata?: {
    order_id?: string
    order_date?: string
    custom_fields?: Record<string, any>
  }
}

// Generate unique exchange code
function generateExchangeCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `EXC-${timestamp}-${random}`
}

// Validate API key and get merchant
async function validateApiKey(supabase: any, apiKey: string, merchantId: string) {
  try {
    // Check if merchant exists and API key is valid
    const { data: merchant, error } = await supabase
      .from('merchants')
      .select('id, name, email, api_key_hash, api_enabled')
      .eq('id', merchantId)
      .single()

    if (error || !merchant) {
      return { valid: false, error: 'Invalid merchant ID' }
    }

    if (!merchant.api_enabled) {
      return { valid: false, error: 'API access disabled for this merchant' }
    }

    // In production, compare hashed API key
    // For now, we'll use a simple comparison
    // You should implement proper API key hashing
    const { data: apiKeyData } = await supabase
      .from('merchant_api_keys')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('key_hash', apiKey) // Should be hashed
      .eq('is_active', true)
      .single()

    if (!apiKeyData) {
      return { valid: false, error: 'Invalid API key' }
    }

    return { valid: true, merchant }
  } catch (err) {
    return { valid: false, error: 'Authentication error' }
  }
}

// Create exchange
async function createExchange(
  supabase: any,
  merchantId: string,
  requestData: ExchangeCreateRequest
) {
  try {
    const exchangeCode = generateExchangeCode()

    // Prepare exchange data
    const exchangeData = {
      merchant_id: merchantId,
      exchange_code: exchangeCode,
      client_name: requestData.client.name,
      client_phone: requestData.client.phone,
      client_email: requestData.client.email || null,
      client_address: requestData.client.address,
      client_city: requestData.client.city,
      client_governorate_id: requestData.client.governorate_id || null,
      client_delegation: requestData.client.delegation || requestData.client.postal_code,
      client_postal_code: requestData.client.postal_code || '',
      client_country: requestData.client.country || 'Tunisie',
      product_name: requestData.product.name,
      product_sku: requestData.product.sku || null,
      product_price: requestData.product.price || 0,
      product_category: requestData.product.category || null,
      reason: requestData.exchange.reason,
      description: requestData.exchange.description || null,
      payment_status: requestData.exchange.payment_type,
      payment_amount: requestData.exchange.payment_amount,
      video: requestData.media?.video || null,
      video_url: requestData.media?.video_url || null,
      images: requestData.media?.images || null,
      status: 'pending',
      metadata: requestData.metadata || null,
      api_created: true,
      created_at: new Date().toISOString(),
    }

    // Insert exchange
    const { data: exchange, error } = await supabase
      .from('exchanges')
      .insert(exchangeData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to create exchange')
    }

    // Return response
    return {
      success: true,
      data: {
        exchange_id: exchange.id,
        exchange_code: exchangeCode,
        status: 'pending',
        qr_code_url: `${Deno.env.get('APP_URL')}/client/tracking/${exchangeCode}`,
        tracking_url: `${Deno.env.get('APP_URL')}/client/tracking/${exchangeCode}`,
        created_at: exchange.created_at,
      },
      message: 'Exchange request created successfully',
    }
  } catch (err: any) {
    console.error('Create exchange error:', err)
    return {
      success: false,
      error: {
        code: 'CREATION_ERROR',
        message: err.message || 'Failed to create exchange',
      },
    }
  }
}

// Get exchange status
async function getExchangeStatus(supabase: any, merchantId: string, exchangeCode: string) {
  try {
    const { data: exchange, error } = await supabase
      .from('exchanges')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('exchange_code', exchangeCode)
      .single()

    if (error || !exchange) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Exchange not found',
        },
      }
    }

    return {
      success: true,
      data: {
        exchange_code: exchange.exchange_code,
        status: exchange.status,
        client_name: exchange.client_name,
        product_name: exchange.product_name,
        reason: exchange.reason,
        created_at: exchange.created_at,
        updated_at: exchange.updated_at,
      },
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve exchange',
      },
    }
  }
}

// List exchanges
async function listExchanges(
  supabase: any,
  merchantId: string,
  params: any
) {
  try {
    const page = parseInt(params.page || '1')
    const limit = Math.min(parseInt(params.limit || '20'), 100)
    const offset = (page - 1) * limit

    let query = supabase
      .from('exchanges')
      .select('exchange_code, client_name, product_name, status, created_at', { count: 'exact' })
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status)
    }
    if (params.from_date) {
      query = query.gte('created_at', params.from_date)
    }
    if (params.to_date) {
      query = query.lte('created_at', params.to_date)
    }

    const { data: exchanges, error, count } = await query

    if (error) {
      throw error
    }

    return {
      success: true,
      data: {
        exchanges: exchanges || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list exchanges',
      },
    }
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/exchange-api', '')
    const method = req.method

    // Get headers
    const authHeader = req.headers.get('Authorization')
    const merchantId = req.headers.get('X-Merchant-ID')

    if (!authHeader || !merchantId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing Authorization header or Merchant ID',
          },
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const apiKey = authHeader.replace('Bearer ', '')

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate API key
    const { valid, error: authError, merchant } = await validateApiKey(supabase, apiKey, merchantId)

    if (!valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: authError || 'Invalid credentials',
          },
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Route handling
    let response

    // POST /create - Create exchange
    if (path === '/create' && method === 'POST') {
      const requestData: ExchangeCreateRequest = await req.json()
      response = await createExchange(supabase, merchantId, requestData)
    }

    // GET /status/:code - Get exchange status
    else if (path.startsWith('/status/') && method === 'GET') {
      const exchangeCode = path.split('/')[2]
      response = await getExchangeStatus(supabase, merchantId, exchangeCode)
    }

    // GET /list - List exchanges
    else if (path === '/list' && method === 'GET') {
      const params = Object.fromEntries(url.searchParams)
      response = await listExchanges(supabase, merchantId, params)
    }

    // Unknown route
    else {
      response = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found',
        },
      }
    }

    const status = response.success ? 200 : (response.error?.code === 'NOT_FOUND' ? 404 : 400)

    return new Response(JSON.stringify(response), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: err.message || 'Internal server error',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
