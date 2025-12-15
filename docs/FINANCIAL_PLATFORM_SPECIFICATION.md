# SWAPP Financial Platform - Complete Specification

## 1. Executive Summary

### Purpose
A dedicated financial management platform for SWAPP's finance team to:
- Track all money flows across the platform
- Reconcile payments between all parties
- Generate and manage invoices
- Validate settlements and payouts
- Audit complete payment history
- Detect discrepancies and anomalies

### Why Separate from Operations?
| Concern | Operations Platform | Financial Platform |
|---------|---------------------|-------------------|
| Users | Merchants, Delivery Persons, Clients | Finance Team Only |
| Data Access | Own data only | All financial data |
| Mutations | Create exchanges, verify deliveries | Read-only + financial approvals |
| Time Sensitivity | Real-time | End-of-day/period |
| Audit Trail | Basic logging | Complete immutable ledger |
| Security | Standard auth | Enhanced compliance controls |

---

## 2. User Roles & Permissions

### 2.1 Finance Admin (CFO / Finance Director)
- Full read access to all financial data
- Approve high-value payouts (>5000 TND)
- Generate and sign invoices
- Override disputed transactions
- Access audit logs
- Configure financial rules

### 2.2 Finance Officer (Accountant)
- Read access to all transactions
- Process daily reconciliations
- Approve standard payouts (<5000 TND)
- Generate reports
- Flag anomalies for review

### 2.3 Finance Auditor (External/Internal)
- Read-only access to all data
- Export audit reports
- View complete transaction history
- Access compliance logs

### Permission Matrix
| Action | Admin | Officer | Auditor |
|--------|-------|---------|---------|
| View all transactions | ✓ | ✓ | ✓ |
| Approve payouts <5000 | ✓ | ✓ | ✗ |
| Approve payouts >5000 | ✓ | ✗ | ✗ |
| Generate invoices | ✓ | ✓ | ✗ |
| Create adjustments | ✓ | ✓ | ✗ |
| Override disputes | ✓ | ✗ | ✗ |
| Configure rules | ✓ | ✗ | ✗ |
| Export data | ✓ | ✓ | ✓ |
| View audit logs | ✓ | ✓ | ✓ |

---

## 3. Core Financial Objects

### 3.1 Ledger (Double-Entry Accounting)

Every financial movement creates TWO ledger entries:
```
DEBIT: Source account loses money
CREDIT: Destination account gains money
```

Example: Client pays 50 TND to Delivery Person
```
Entry 1: DEBIT  client_escrow     50 TND
Entry 2: CREDIT delivery_wallet   50 TND
```

### 3.2 Account Types (Chart of Accounts)

| Account Code | Name | Type | Description |
|--------------|------|------|-------------|
| 1000 | Client Escrow | Liability | Money held from clients |
| 1100 | Delivery Partner Wallet | Liability | Owed to delivery partners |
| 1200 | Merchant Wallet | Liability | Owed to merchants |
| 1300 | Delivery Company Wallet | Liability | Owed to delivery companies |
| 2000 | SWAPP Operating | Asset | Our operating account |
| 2100 | SWAPP Bank | Asset | Our bank account |
| 3000 | Exchange Fee Revenue | Revenue | 9 TND per exchange |
| 3100 | Commission Revenue | Revenue | Other commissions |
| 4000 | Delivery Cost | Expense | Paid to delivery partners |
| 9000 | Suspense | Suspense | Unreconciled amounts |

### 3.3 Wallet Structure

Each party has a virtual wallet:

```typescript
Wallet {
  id: UUID
  owner_type: 'delivery_person' | 'delivery_company' | 'merchant' | 'swapp'
  owner_id: UUID (nullable for SWAPP)
  balance: number // Current available balance
  pending_in: number // Incoming pending
  pending_out: number // Outgoing pending
  currency: 'TND'
  created_at: timestamp
  updated_at: timestamp
}
```

### 3.4 Transaction Types

| Type | From | To | Trigger |
|------|------|-----|---------|
| `client_collection` | Client | Delivery Wallet | Payment collected |
| `swapp_fee` | Delivery Wallet | SWAPP Revenue | Exchange verified |
| `merchant_credit` | Delivery Wallet | Merchant Wallet | Exchange verified |
| `dp_to_company` | Delivery Wallet | Company Wallet | Daily settlement |
| `company_to_swapp` | Company Wallet | SWAPP Bank | Weekly settlement |
| `merchant_payout` | Merchant Wallet | Merchant Bank | Bi-weekly payout |
| `adjustment_credit` | SWAPP Suspense | Any Wallet | Manual correction |
| `adjustment_debit` | Any Wallet | SWAPP Suspense | Manual correction |
| `refund` | Merchant Wallet | Client | Exchange cancelled |

---

## 4. Money Flows

### 4.1 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SWAPP MONEY FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLIENT                                                                     │
│    │                                                                        │
│    │ Pays 50 TND (cash/card)                                               │
│    ▼                                                                        │
│  ┌──────────────────┐                                                       │
│  │ DELIVERY PERSON  │ ←── Collects money, verifies exchange               │
│  │ Wallet: +50 TND  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           │ Automatic split on verification:                               │
│           │                                                                 │
│           ├────────────────────┐                                           │
│           │                    │                                           │
│           ▼                    ▼                                           │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │ SWAPP REVENUE   │  │ MERCHANT WALLET │                                  │
│  │ +9 TND (fee)    │  │ +41 TND         │                                  │
│  └─────────────────┘  └────────┬────────┘                                  │
│                                │                                           │
│                                │ Bi-weekly payout                          │
│                                ▼                                           │
│                       ┌─────────────────┐                                  │
│                       │ MERCHANT BANK   │                                  │
│                       │ Bank Transfer   │                                  │
│                       └─────────────────┘                                  │
│                                                                             │
│  Meanwhile (Daily):                                                         │
│                                                                             │
│  ┌──────────────────┐         ┌─────────────────────┐                      │
│  │ DELIVERY PERSON  │────────►│ DELIVERY COMPANY    │                      │
│  │ Wallet: -50 TND  │ Daily   │ Wallet: +50 TND     │                      │
│  │ (settled)        │ Handoff │                     │                      │
│  └──────────────────┘         └──────────┬──────────┘                      │
│                                          │                                 │
│                                          │ Weekly settlement               │
│                                          ▼                                 │
│                               ┌─────────────────────┐                      │
│                               │ SWAPP BANK          │                      │
│                               │ Receives cash       │                      │
│                               └─────────────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Detailed Flow: Client → Delivery Person

**Trigger**: Delivery person verifies exchange and marks payment collected

**Ledger Entries**:
```
1. DEBIT:  1000 Client Escrow        50.00 TND
   CREDIT: 1100 Delivery Wallet      50.00 TND
   
2. DEBIT:  1100 Delivery Wallet       9.00 TND (SWAPP fee)
   CREDIT: 3000 Exchange Fee Revenue  9.00 TND
   
3. DEBIT:  1100 Delivery Wallet      41.00 TND (merchant amount)
   CREDIT: 1200 Merchant Wallet      41.00 TND
```

**Result**:
- Delivery Person Wallet: 0 TND (passed through)
- SWAPP Revenue: +9 TND
- Merchant Wallet: +41 TND

### 4.3 Flow: Delivery Person → Delivery Company

**Trigger**: End of day cash handoff

**Process**:
1. Delivery person returns to hub with collected cash
2. Supervisor counts and confirms amount
3. System records settlement

**Ledger Entries**:
```
DEBIT:  1100 Delivery Wallet       50.00 TND
CREDIT: 1300 Delivery Company      50.00 TND
```

### 4.4 Flow: Delivery Company → SWAPP

**Trigger**: Weekly bank deposit by delivery company

**Process**:
1. Company deposits cash to SWAPP bank account
2. Finance confirms bank statement match
3. System records settlement

**Ledger Entries**:
```
DEBIT:  1300 Delivery Company      500.00 TND
CREDIT: 2100 SWAPP Bank            500.00 TND
```

### 4.5 Flow: Merchant Payout

**Trigger**: Bi-weekly payment cycle (1st-15th, 16th-end)

**Process**:
1. System calculates merchant balance
2. Finance approves payout
3. Bank transfer executed
4. System records payment

**Ledger Entries**:
```
DEBIT:  1200 Merchant Wallet       410.00 TND
CREDIT: 2100 SWAPP Bank            410.00 TND
(Bank transfer to merchant)
```

---

## 5. Reconciliation Logic

### 5.1 Daily Reconciliation

**Time**: Every day at 23:59

**Steps**:
1. **Collection Verification**
   ```sql
   -- All collections today
   SELECT SUM(amount_collected) FROM delivery_verifications
   WHERE DATE(created_at) = CURRENT_DATE AND payment_collected = true
   
   -- Must equal ledger entries
   SELECT SUM(amount) FROM ledger_entries
   WHERE type = 'client_collection' AND DATE(created_at) = CURRENT_DATE
   ```

2. **Delivery Person Settlement**
   ```sql
   -- Each delivery person's collected vs settled
   FOR each delivery_person:
     collected = SUM(collections today)
     settled = SUM(settlements today)
     pending = collected - settled
     
     IF pending > 0:
       FLAG: "Unsettled cash: {pending} TND"
   ```

3. **Discrepancy Detection**
   ```
   IF ledger.collections != verifications.total:
     CREATE anomaly_alert(
       type: 'collection_mismatch',
       expected: verifications.total,
       actual: ledger.collections,
       difference: ABS(expected - actual)
     )
   ```

### 5.2 Weekly Reconciliation

**Time**: Every Sunday at 23:59

**Steps**:
1. **Delivery Company Cash Position**
   ```sql
   expected_cash = SUM(dp_to_company this week)
   actual_deposit = SUM(company_to_swapp this week)
   pending = expected_cash - actual_deposit
   
   IF pending > threshold:
     ALERT: "Delivery company owes {pending} TND"
   ```

2. **SWAPP Fee Verification**
   ```sql
   exchanges_verified = COUNT(verified exchanges this week)
   expected_fees = exchanges_verified * 9 TND
   actual_fees = SUM(swapp_fee transactions)
   
   IF expected_fees != actual_fees:
     ALERT: "Fee discrepancy: {difference} TND"
   ```

### 5.3 Monthly Reconciliation

**Time**: 1st of each month

**Steps**:
1. **Bank Statement Match**
   - Import bank statement
   - Match each bank transaction to ledger entry
   - Flag unmatched transactions

2. **Merchant Payment Verification**
   - All pending payments from previous month
   - Verify payment status vs bank records
   - Flag unpaid merchants

3. **Generate Month-End Reports**
   - P&L statement
   - Balance sheet snapshot
   - Cash flow statement

---

## 6. Invoicing System

### 6.1 Merchant Invoices

**Frequency**: Bi-weekly (1st-15th, 16th-end)

**Invoice Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│                    FACTURE / INVOICE                        │
│                    SWAPP TUNISIA                            │
├─────────────────────────────────────────────────────────────┤
│ Invoice #: INV-2025-12-P2-001                               │
│ Date: 15/12/2025                                            │
│ Period: 01/12/2025 - 15/12/2025                             │
│                                                             │
│ Merchant: TechStore SARL                                    │
│ Tax ID: 1234567/A/M/000                                     │
│ Address: 123 Rue de Commerce, Tunis                         │
├─────────────────────────────────────────────────────────────┤
│ DETAIL DES OPERATIONS                                       │
├──────────────────┬─────────┬───────────┬───────────────────┤
│ Code Échange     │ Client  │ Encaissé  │ Frais SWAPP       │
├──────────────────┼─────────┼───────────┼───────────────────┤
│ EXC-2025-001     │ Ahmed B.│  50.00 TND│      9.00 TND     │
│ EXC-2025-002     │ Sami K. │  35.00 TND│      9.00 TND     │
│ EXC-2025-003     │ Leila M.│   9.00 TND│      9.00 TND     │
├──────────────────┴─────────┼───────────┼───────────────────┤
│                      TOTAL │  94.00 TND│     27.00 TND     │
├────────────────────────────┴───────────┴───────────────────┤
│                                                             │
│ Montant Encaissé:                           94.00 TND       │
│ Frais SWAPP (9 TND × 3):                   -27.00 TND       │
│ ──────────────────────────────────────────────────────       │
│ MONTANT NET A VERSER:                       67.00 TND       │
│                                                             │
│ Mode de Paiement: Virement Bancaire                         │
│ Référence: PAY-2025-P24-001                                 │
│ Date Versement: 18/12/2025                                  │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Delivery Company Monthly Invoice

**Frequency**: Monthly

**Invoice Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│              FACTURE PARTENAIRE LIVRAISON                   │
│                    SWAPP TUNISIA                            │
├─────────────────────────────────────────────────────────────┤
│ Invoice #: DCI-2025-12-001                                  │
│ Date: 01/01/2026                                            │
│ Period: 01/12/2025 - 31/12/2025                             │
│                                                             │
│ Delivery Partner: Express Delivery SARL                     │
│ Tax ID: 9876543/A/M/000                                     │
├─────────────────────────────────────────────────────────────┤
│ RESUME DES ENCAISSEMENTS                                    │
├──────────────────────────────────────────────────────────────┤
│ Total Échanges Traités:                        450          │
│ Total Encaissé par Livreurs:            12,500.00 TND       │
│ Total Remis à SWAPP:                    12,500.00 TND       │
│ ──────────────────────────────────────────────────────       │
│ SOLDE:                                       0.00 TND       │
├──────────────────────────────────────────────────────────────┤
│ DETAIL PAR LIVREUR                                          │
├───────────────────┬──────────────┬───────────────┬──────────┤
│ Livreur           │ Échanges     │ Encaissé      │ Remis    │
├───────────────────┼──────────────┼───────────────┼──────────┤
│ Mohamed A.        │     120      │   3,200.00 TND│ 3,200.00 │
│ Fatma B.          │      95      │   2,800.00 TND│ 2,800.00 │
│ Ahmed C.          │     105      │   3,100.00 TND│ 3,100.00 │
│ ...               │     ...      │        ...    │    ...   │
├───────────────────┴──────────────┴───────────────┴──────────┤
│                                                             │
│ Status: RECONCILED                                          │
│ Verified by: Finance Officer                                │
│ Date: 02/01/2026                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Settlement & Payout Management

### 7.1 Settlement Types

| Type | Frequency | From | To | Method |
|------|-----------|------|-----|--------|
| Daily Cash | Daily | Delivery Person | Company Hub | Cash handoff |
| Weekly Deposit | Weekly | Delivery Company | SWAPP Bank | Bank deposit |
| Merchant Payout | Bi-weekly | SWAPP | Merchant | Bank transfer |
| Adjustment | As needed | SWAPP | Any party | Internal transfer |

### 7.2 Payout Workflow

```
PAYOUT REQUEST INITIATED
       │
       ▼
┌──────────────────┐
│ Validation Check │
│ - Balance >= Amount
│ - No disputes pending
│ - KYC verified
└────────┬─────────┘
         │
    PASS │ FAIL ──► REJECT with reason
         │
         ▼
┌──────────────────┐
│ Approval Check   │
│ - Amount < 5000: Officer can approve
│ - Amount >= 5000: Admin required
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Execute Payout   │
│ - Create ledger entries
│ - Queue bank transfer
│ - Send notification
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Confirm Receipt  │
│ - Bank confirms transfer
│ - Update status to PAID
│ - Close payout
└──────────────────┘
```

### 7.3 Payout Status Flow

```
PENDING → APPROVED → PROCESSING → COMPLETED
    │         │           │
    └─REJECTED└───────────└─FAILED
                              │
                              └─→ RETRY (max 3)
```

---

## 8. Audit, History & Compliance

### 8.1 Audit Trail Requirements

Every financial action must log:
```typescript
AuditLog {
  id: UUID
  timestamp: DateTime
  user_id: UUID
  user_role: string
  action: string // 'create', 'approve', 'reject', 'adjust'
  entity_type: string // 'transaction', 'payout', 'invoice'
  entity_id: UUID
  old_value: JSON // Previous state
  new_value: JSON // New state
  ip_address: string
  user_agent: string
  reason: string // Required for adjustments
}
```

### 8.2 Immutability Rules

1. **No Deletions**: Financial records are never deleted
2. **Adjustments Only**: Corrections create new adjustment entries
3. **Version History**: All changes tracked with before/after state
4. **Signed Records**: Critical records have hash signatures

### 8.3 Compliance Requirements

| Requirement | Implementation |
|-------------|---------------|
| Data Retention | 10 years minimum |
| Access Logging | All views logged |
| Export Controls | Watermarked exports |
| Separation of Duties | Approval thresholds |
| Reconciliation | Daily/Weekly/Monthly |

---

## 9. Alerts & Anomaly Detection

### 9.1 Alert Types

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Collection Mismatch | Ledger != Verifications | HIGH | Block settlements |
| Large Transaction | Amount > 1000 TND | MEDIUM | Flag for review |
| Unsettled Cash | End of day balance > 0 | HIGH | Notify supervisor |
| Duplicate Transaction | Same exchange, same amount | CRITICAL | Auto-block |
| Missing Settlement | 2+ days pending | HIGH | Escalate to admin |
| Failed Payout | Bank rejection | HIGH | Notify finance |
| Reconciliation Gap | Weekly mismatch > 100 TND | HIGH | Trigger audit |

### 9.2 Anomaly Detection Rules

```typescript
// Rule 1: Unusual collection pattern
IF delivery_person.daily_collections > (average * 3):
  CREATE alert('unusual_volume', delivery_person_id)

// Rule 2: Delayed settlements
IF settlement.created_at < (now - 48_hours) AND status = 'pending':
  CREATE alert('delayed_settlement', settlement_id)

// Rule 3: Round number detection (potential fraud)
IF transaction.amount % 100 == 0 AND transaction.amount > 500:
  FLAG for manual review

// Rule 4: Velocity check
IF delivery_person.collections_last_hour > 10:
  CREATE alert('high_velocity', delivery_person_id)
```

---

## 10. Reports for Finance

### 10.1 Daily Reports

| Report | Content |
|--------|---------|
| Daily Collections | All collections grouped by delivery person |
| Daily Settlements | All settlements with status |
| Cash Position | Unsettled amounts per delivery person |
| Anomaly Summary | All alerts triggered today |

### 10.2 Weekly Reports

| Report | Content |
|--------|---------|
| Weekly P&L | Revenue vs expenses |
| Delivery Company Statement | Collections, deposits, balance |
| Merchant Balances | Pending amounts per merchant |
| Reconciliation Status | Matched vs unmatched transactions |

### 10.3 Monthly Reports

| Report | Content |
|--------|---------|
| Monthly Financial Statement | Complete P&L |
| Merchant Invoices Summary | All invoices generated |
| Delivery Partner Performance | Volume, accuracy, timeliness |
| Audit Report | All adjustments, overrides |
| Cash Flow Statement | Money in/out by category |

### 10.4 On-Demand Reports

- Transaction search by date range
- Merchant history export
- Delivery person financial history
- Dispute resolution report
- Tax report (VAT summary)

---

## 11. Data Model (Database Schema)

### 11.1 Core Tables

```sql
-- Wallets (virtual accounts)
CREATE TABLE finance_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN (
    'delivery_person', 'delivery_company', 'merchant', 'swapp'
  )),
  owner_id UUID, -- NULL for SWAPP
  balance DECIMAL(12,2) DEFAULT 0,
  pending_in DECIMAL(12,2) DEFAULT 0,
  pending_out DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'TND',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_type, owner_id)
);

-- Chart of Accounts
CREATE TABLE finance_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- e.g., '1000', '2100'
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'asset', 'liability', 'revenue', 'expense', 'equity', 'suspense'
  )),
  parent_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Double-Entry Ledger
CREATE TABLE finance_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL, -- Groups debit/credit pairs
  account_code TEXT NOT NULL REFERENCES finance_accounts(code),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'TND',
  description TEXT,
  reference_type TEXT, -- 'exchange', 'settlement', 'payout'
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Financial Transactions (high-level view)
CREATE TABLE finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'client_collection', 'swapp_fee', 'merchant_credit',
    'dp_to_company', 'company_to_swapp', 'merchant_payout',
    'adjustment_credit', 'adjustment_debit', 'refund'
  )),
  from_wallet_id UUID REFERENCES finance_wallets(id),
  to_wallet_id UUID REFERENCES finance_wallets(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'failed', 'cancelled'
  )),
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ
);

-- Delivery Company (new table)
CREATE TABLE delivery_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tax_id TEXT,
  address TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  bank_account TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link delivery persons to companies
ALTER TABLE delivery_persons ADD COLUMN company_id UUID REFERENCES delivery_companies(id);

-- Payouts
CREATE TABLE finance_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_type TEXT NOT NULL CHECK (payout_type IN (
    'merchant_payout', 'delivery_company_payout', 'refund'
  )),
  recipient_type TEXT NOT NULL,
  recipient_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'processing', 'completed', 'failed', 'rejected'
  )),
  payment_method TEXT, -- 'bank_transfer', 'cash', 'check'
  payment_reference TEXT,
  bank_account TEXT,
  period_start DATE,
  period_end DATE,
  invoice_id UUID,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  notes TEXT
);

-- Invoices
CREATE TABLE finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN (
    'merchant_invoice', 'delivery_company_invoice'
  )),
  recipient_type TEXT NOT NULL,
  recipient_id UUID NOT NULL,
  recipient_name TEXT,
  recipient_tax_id TEXT,
  recipient_address TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'generated', 'sent', 'paid', 'cancelled'
  )),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Invoice Line Items
CREATE TABLE finance_invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES finance_invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12,2),
  total_amount DECIMAL(12,2) NOT NULL,
  reference_type TEXT, -- 'exchange', 'fee'
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reconciliation Records
CREATE TABLE finance_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_type TEXT NOT NULL CHECK (reconciliation_type IN (
    'daily', 'weekly', 'monthly'
  )),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'failed', 'requires_review'
  )),
  expected_amount DECIMAL(12,2),
  actual_amount DECIMAL(12,2),
  discrepancy DECIMAL(12,2),
  discrepancy_items JSONB, -- Array of mismatched items
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomalies & Alerts
CREATE TABLE finance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'investigating', 'resolved', 'dismissed'
  )),
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE finance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  reason TEXT
);

-- Finance Users (separate from regular users)
CREATE TABLE finance_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'auditor')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.2 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_ledger_transaction ON finance_ledger_entries(transaction_id);
CREATE INDEX idx_ledger_account ON finance_ledger_entries(account_code);
CREATE INDEX idx_ledger_date ON finance_ledger_entries(created_at);
CREATE INDEX idx_transactions_type ON finance_transactions(transaction_type);
CREATE INDEX idx_transactions_status ON finance_transactions(status);
CREATE INDEX idx_transactions_date ON finance_transactions(created_at);
CREATE INDEX idx_wallets_owner ON finance_wallets(owner_type, owner_id);
CREATE INDEX idx_payouts_status ON finance_payouts(status);
CREATE INDEX idx_payouts_recipient ON finance_payouts(recipient_type, recipient_id);
CREATE INDEX idx_invoices_recipient ON finance_invoices(recipient_type, recipient_id);
CREATE INDEX idx_alerts_status ON finance_alerts(status);
CREATE INDEX idx_audit_entity ON finance_audit_log(entity_type, entity_id);
```

### 11.3 RLS Policies

```sql
-- Enable RLS on all finance tables
ALTER TABLE finance_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_ledger_entries ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Only finance users can access
CREATE POLICY "Finance users only" ON finance_transactions
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM finance_users WHERE is_active = true)
  );
```

---

## 12. MVP vs Phase 2 Scope

### MVP (Phase 1) - 4-6 weeks

| Feature | Priority | Status |
|---------|----------|--------|
| Wallet system | P0 | Build |
| Ledger entries | P0 | Build |
| Transaction recording | P0 | Build |
| Daily reconciliation view | P0 | Build |
| Merchant invoice generation | P1 | Build |
| Payout management | P1 | Build |
| Basic alerts | P1 | Build |
| Audit log | P1 | Build |
| Finance user auth | P1 | Build |

**MVP Deliverables**:
- Finance dashboard with wallet balances
- Transaction list with filters
- Daily reconciliation report
- Merchant invoice generation
- Manual payout approval workflow
- Basic alert system
- Complete audit trail

### Phase 2 - 4-6 weeks after MVP

| Feature | Priority |
|---------|----------|
| Delivery company management | P1 |
| Automated reconciliation | P1 |
| Bank statement import | P2 |
| Anomaly detection ML | P2 |
| Advanced reporting | P2 |
| PDF invoice generation | P2 |
| Email notifications | P2 |
| Mobile finance app | P3 |
| API for external systems | P3 |

---

## 13. Implementation Roadmap

### Week 1-2: Foundation
- [ ] Create finance database tables
- [ ] Implement wallet system
- [ ] Build ledger entry system
- [ ] Create finance user auth

### Week 3-4: Core Features
- [ ] Build transaction recording
- [ ] Implement daily reconciliation
- [ ] Create finance dashboard
- [ ] Add basic alerts

### Week 5-6: Invoicing & Payouts
- [ ] Merchant invoice generation
- [ ] Payout approval workflow
- [ ] Audit log implementation
- [ ] Testing & bug fixes

### Post-MVP
- [ ] Delivery company features
- [ ] Advanced reconciliation
- [ ] Reporting enhancements
- [ ] External integrations

---

## 14. Technical Architecture

### Separation from Operations

```
┌─────────────────────────────────────────────────────────────┐
│                    SWAPP PLATFORM                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐        │
│  │ OPERATIONS APP      │    │ FINANCE APP         │        │
│  │ (Existing)          │    │ (New)               │        │
│  │                     │    │                     │        │
│  │ - Merchants         │    │ - Finance Users     │        │
│  │ - Delivery Persons  │    │ - Wallets           │        │
│  │ - Clients           │    │ - Ledger            │        │
│  │ - Exchanges         │    │ - Reconciliation    │        │
│  │                     │    │ - Invoices          │        │
│  └──────────┬──────────┘    └──────────┬──────────┘        │
│             │                          │                    │
│             │    ┌─────────────────┐   │                    │
│             └───►│ SHARED DATABASE │◄──┘                    │
│                  │ (Supabase)      │                        │
│                  │                 │                        │
│                  │ - exchanges     │                        │
│                  │ - merchants     │                        │
│                  │ - delivery_*    │                        │
│                  │ - finance_*     │◄── NEW TABLES          │
│                  └─────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Access Pattern

- **Operations App**: CRUD on operational tables
- **Finance App**: READ on operational tables, CRUD on finance tables
- **Triggers**: Operations changes → Finance ledger entries

---

## 15. Key Decisions

1. **Double-Entry Ledger**: Every transaction has balanced debit/credit
2. **Immutable Records**: No deletions, only adjustments
3. **Wallet Abstraction**: Virtual accounts for all parties
4. **Separate Auth**: Finance users != operational users
5. **Daily Reconciliation**: Catch issues early
6. **Invoice Generation**: Formal documentation for compliance
7. **Audit Everything**: Complete traceability

---

## 16. Next Steps

1. **Review this specification** with stakeholders
2. **Confirm MVP scope** and priorities
3. **Create database migration** for new tables
4. **Build finance user authentication**
5. **Implement core wallet/ledger system**
6. **Build finance dashboard UI**
7. **Test with sample data**
8. **Deploy and train finance team**
