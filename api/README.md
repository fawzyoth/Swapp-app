# SWAPP Exchange API Documentation

## Overview
The SWAPP Exchange API allows third-party applications to create and manage product exchange requests programmatically. This API enables partners to integrate exchange functionality into their e-commerce platforms, mobile apps, or other systems.

## Base URL
```
https://your-supabase-project.supabase.co/functions/v1
```

## Authentication
All API requests require authentication using an API key in the header:

```http
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

### Getting API Keys
1. Log into your merchant dashboard
2. Navigate to Settings > API Keys
3. Generate a new API key
4. Copy and securely store your API key

## Endpoints

### 1. Create Exchange Request

Creates a new exchange request with product details, reason, client information, and media files.

**Endpoint:** `POST /exchange-api/create`

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

**Request Body:**
```json
{
  "client": {
    "name": "Ahmed Ben Ali",
    "phone": "+216 55 123 456",
    "email": "ahmed@example.com",
    "address": "15 Rue de la Liberté, Tunis 1000",
    "city": "Tunis",
    "governorate_id": 1,
    "delegation": "La Marsa",
    "postal_code": "1000",
    "country": "Tunisie"
  },
  "product": {
    "name": "T-Shirt Nike - Taille L",
    "sku": "NIKE-TSH-L-001",
    "price": 89.99,
    "category": "Vêtements"
  },
  "exchange": {
    "reason": "Taille incorrecte",
    "description": "Le client a commandé une taille L mais a besoin d'une taille M",
    "payment_type": "free",
    "payment_amount": 0
  },
  "media": {
    "video_url": "https://storage.example.com/videos/exchange-123.mp4",
    "images": [
      "https://storage.example.com/images/product-front.jpg",
      "https://storage.example.com/images/product-defect.jpg"
    ]
  },
  "metadata": {
    "order_id": "ORD-2024-001",
    "order_date": "2024-01-15",
    "custom_fields": {
      "warehouse": "Tunis-Central",
      "notes": "Urgent exchange"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exchange_id": "uuid-here",
    "exchange_code": "EXC-2024-001",
    "status": "pending",
    "qr_code_url": "https://swapp.tn/client/exchange/EXC-2024-001",
    "tracking_url": "https://swapp.tn/client/tracking/EXC-2024-001",
    "created_at": "2024-01-20T10:30:00Z"
  },
  "message": "Exchange request created successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "client.phone",
        "message": "Phone number is required"
      }
    ]
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API key or merchant ID"
  }
}
```

---

### 2. Get Exchange Status

Retrieves the current status and details of an exchange request.

**Endpoint:** `GET /exchange-api/status/{exchange_code}`

**Headers:**
```http
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exchange_code": "EXC-2024-001",
    "status": "validated",
    "client_name": "Ahmed Ben Ali",
    "product_name": "T-Shirt Nike - Taille L",
    "reason": "Taille incorrecte",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-20T10:30:00Z"
      },
      {
        "status": "validated",
        "timestamp": "2024-01-20T14:45:00Z"
      }
    ]
  }
}
```

---

### 3. Update Exchange

Updates an existing exchange request (before merchant approval).

**Endpoint:** `PATCH /exchange-api/update/{exchange_code}`

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

**Request Body:**
```json
{
  "exchange": {
    "reason": "Updated reason",
    "description": "Updated description"
  },
  "media": {
    "video_url": "https://storage.example.com/videos/updated-video.mp4"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exchange_code": "EXC-2024-001",
    "updated_at": "2024-01-20T15:00:00Z"
  },
  "message": "Exchange updated successfully"
}
```

---

### 4. List Exchanges

Retrieves a list of exchanges with pagination and filtering.

**Endpoint:** `GET /exchange-api/list`

**Query Parameters:**
- `status` (optional): Filter by status (pending, validated, rejected, completed)
- `from_date` (optional): Filter exchanges created after this date (ISO 8601)
- `to_date` (optional): Filter exchanges created before this date (ISO 8601)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Example Request:**
```http
GET /exchange-api/list?status=pending&page=1&limit=20
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exchanges": [
      {
        "exchange_code": "EXC-2024-001",
        "client_name": "Ahmed Ben Ali",
        "product_name": "T-Shirt Nike - Taille L",
        "status": "pending",
        "created_at": "2024-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

### 5. Upload Media

Uploads video or images for an exchange request.

**Endpoint:** `POST /exchange-api/media/upload`

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_KEY
X-Merchant-ID: YOUR_MERCHANT_ID
```

**Request Body (multipart/form-data):**
```
exchange_code: EXC-2024-001
media_type: video | image
file: [binary file data]
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "media_url": "https://storage.supabase.co/swapp/exchanges/video-uuid.mp4",
    "media_type": "video",
    "size_bytes": 2048000,
    "uploaded_at": "2024-01-20T10:35:00Z"
  }
}
```

---

### 6. Webhook Configuration

Configure webhooks to receive real-time updates about exchange status changes.

**Endpoint:** `POST /exchange-api/webhooks/configure`

**Request Body:**
```json
{
  "webhook_url": "https://your-app.com/webhooks/swapp",
  "events": [
    "exchange.created",
    "exchange.validated",
    "exchange.rejected",
    "exchange.completed"
  ],
  "secret": "your-webhook-secret"
}
```

**Webhook Payload Example:**
```json
{
  "event": "exchange.validated",
  "timestamp": "2024-01-20T14:45:00Z",
  "data": {
    "exchange_code": "EXC-2024-001",
    "status": "validated",
    "merchant_id": "uuid-here"
  },
  "signature": "hmac-sha256-signature"
}
```

---

## Rate Limits

- **Standard Plan**: 100 requests per minute
- **Premium Plan**: 1000 requests per minute

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Status Flow

Exchanges follow this status flow:

```
pending → validated → ready_for_pickup → in_transit → delivery_verified → completed
                  ↘ rejected
```

**Status Descriptions:**
- `pending`: Awaiting merchant approval
- `validated`: Approved by merchant
- `rejected`: Denied by merchant
- `ready_for_pickup`: Ready for delivery pickup
- `in_transit`: Being delivered to client
- `delivery_verified`: Verified by delivery person
- `completed`: Exchange completed
- `returned`: Product returned to merchant

---

## Code Examples

### JavaScript (Node.js)

```javascript
const axios = require('axios');

const API_BASE_URL = 'https://your-project.supabase.co/functions/v1';
const API_KEY = 'your-api-key';
const MERCHANT_ID = 'your-merchant-id';

async function createExchange(exchangeData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/exchange-api/create`,
      exchangeData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'X-Merchant-ID': MERCHANT_ID
        }
      }
    );

    console.log('Exchange created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Example usage
const exchangeData = {
  client: {
    name: "Ahmed Ben Ali",
    phone: "+216 55 123 456",
    email: "ahmed@example.com",
    address: "15 Rue de la Liberté, Tunis 1000",
    city: "Tunis",
    governorate_id: 1,
    delegation: "La Marsa",
    postal_code: "1000"
  },
  product: {
    name: "T-Shirt Nike - Taille L",
    sku: "NIKE-TSH-L-001",
    price: 89.99
  },
  exchange: {
    reason: "Taille incorrecte",
    payment_type: "free",
    payment_amount: 0
  },
  media: {
    video_url: "https://example.com/video.mp4",
    images: ["https://example.com/image1.jpg"]
  }
};

createExchange(exchangeData);
```

### Python

```python
import requests

API_BASE_URL = 'https://your-project.supabase.co/functions/v1'
API_KEY = 'your-api-key'
MERCHANT_ID = 'your-merchant-id'

def create_exchange(exchange_data):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}',
        'X-Merchant-ID': MERCHANT_ID
    }

    response = requests.post(
        f'{API_BASE_URL}/exchange-api/create',
        json=exchange_data,
        headers=headers
    )

    if response.status_code == 200:
        print('Exchange created:', response.json())
        return response.json()
    else:
        print('Error:', response.json())
        raise Exception(response.json())

# Example usage
exchange_data = {
    "client": {
        "name": "Ahmed Ben Ali",
        "phone": "+216 55 123 456",
        "email": "ahmed@example.com",
        "address": "15 Rue de la Liberté, Tunis 1000",
        "city": "Tunis",
        "governorate_id": 1,
        "delegation": "La Marsa",
        "postal_code": "1000"
    },
    "product": {
        "name": "T-Shirt Nike - Taille L",
        "sku": "NIKE-TSH-L-001",
        "price": 89.99
    },
    "exchange": {
        "reason": "Taille incorrecte",
        "payment_type": "free",
        "payment_amount": 0
    },
    "media": {
        "video_url": "https://example.com/video.mp4",
        "images": ["https://example.com/image1.jpg"]
    }
}

create_exchange(exchange_data)
```

### PHP

```php
<?php

$apiBaseUrl = 'https://your-project.supabase.co/functions/v1';
$apiKey = 'your-api-key';
$merchantId = 'your-merchant-id';

function createExchange($exchangeData) {
    global $apiBaseUrl, $apiKey, $merchantId;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "$apiBaseUrl/exchange-api/create");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($exchangeData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "Authorization: Bearer $apiKey",
        "X-Merchant-ID: $merchantId"
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        echo "Exchange created: " . $response;
        return json_decode($response, true);
    } else {
        echo "Error: " . $response;
        throw new Exception($response);
    }
}

// Example usage
$exchangeData = [
    'client' => [
        'name' => 'Ahmed Ben Ali',
        'phone' => '+216 55 123 456',
        'email' => 'ahmed@example.com',
        'address' => '15 Rue de la Liberté, Tunis 1000',
        'city' => 'Tunis',
        'governorate_id' => 1,
        'delegation' => 'La Marsa',
        'postal_code' => '1000'
    ],
    'product' => [
        'name' => 'T-Shirt Nike - Taille L',
        'sku' => 'NIKE-TSH-L-001',
        'price' => 89.99
    ],
    'exchange' => [
        'reason' => 'Taille incorrecte',
        'payment_type' => 'free',
        'payment_amount' => 0
    ],
    'media' => [
        'video_url' => 'https://example.com/video.mp4',
        'images' => ['https://example.com/image1.jpg']
    ]
];

createExchange($exchangeData);
?>
```

---

## Testing

Use our sandbox environment for testing:
```
Base URL: https://your-project.supabase.co/functions/v1/sandbox
```

Test API Key: `test_key_xxxxxxxxxxxxx`

---

## Support

For API support, contact:
- Email: api-support@swapp.tn
- Documentation: https://docs.swapp.tn/api
- Status Page: https://status.swapp.tn
