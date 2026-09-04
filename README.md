# ⚡ Revora AI — Autonomous Revenue Recovery Platform
> **FROM RISK TO REVENUE — From Bank Failure to Instant Settlement.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-cyan?logo=react)](https://reactjs.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Gateway%20%26%20Webhooks-0c2340?logo=razorpay)](https://razorpay.com/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Compliance](https://img.shields.io/badge/Compliance-RBI%20Fair%20Contact%20Code-emerald)](#regulatory-compliance--safety-guardrails)

**Author & Creator:** Rajeyo Haldar  
**Live Platform:** [https://ais-dev-qa5gpklfeimf36gjlefskw-887605548801.asia-southeast1.run.app](https://ais-dev-qa5gpklfeimf36gjlefskw-887605548801.asia-southeast1.run.app)

---

## 📌 Executive Summary

Modern e-commerce and subscription businesses silently lose **15% to 30% of their top-line revenue** due to:
- Payment gateway drop-offs and NPCI UPI switch latencies (504 gateway timeouts)
- 3DS challenge frictions and abandoned carts
- Failed auto-debit recurring subscriptions (e-Mandates)
- Overdue commercial Net-30 enterprise invoices and receivables

Traditional recovery systems either spam customers with static, ignored emails or trigger aggressive gateway retries that get blacklisted by issuing banks.

**Revora AI** solves this with an autonomous, bounded AI revenue defense engine. It intercepts payment failures in real time (<500ms), isolates the technical root cause, and deploys high-converting, compliant recovery workflows—including conversational **Hinglish voice agents**, **WhatsApp 1-click payment links**, and **smart failover payment rails** powered by **Razorpay**.

Every recovery action is strictly bounded by **RBI Fair Contact policies**, **stopping rules**, and an **immutable audit ledger**.

---

## 🎯 Key Objectives & Evaluation Capabilities

| Criterion | How Revora AI Solves It |
| :--- | :--- |
| **Measured Money Recovered** | Live, verifiable metrics: **Revenue at Risk**, **Revenue Recovered**, and **Recovery Win-Rate (~68%)** cryptographically validated via Razorpay Webhook signatures (`payment.captured`). |
| **Root-Cause Telemetry** | Intercepts ISO-8583 error codes, gateway timeouts (`NPCI_504`), SMS OTP delays, and bank switch outages without charging the user twice. |
| **Conversational Hinglish AI** | Real-time voice recovery agent (Priya) with dynamic, bounded waiver negotiation (up to 5%) and instant WhatsApp link dispatch. |
| **Promise-to-Pay (P2P)** | Automatically parses customer payment commitments (e.g., *"Will pay this Friday after salary"*), adds them to the P2P calendar, and halts active retries. |
| **Compliant Escalation & Stopping Rules** | Max 3 contact retries, mandatory quiet hours (7:00 PM – 9:00 AM IST), and immediate permanent halts if the customer requests cancellation or DND. |
| **Batch-Level Results** | One-click batch execution engine with parallel safety checks, cohort processing, and detailed recovery pass/fail reports. |
| **Immutable Audit Trail** | Tamper-proof ledger logging timestamps, actor IDs, and compliance flags (`PASS`, `FAIL`, `STOPPING_RULE`) for full RBI auditability. |

---

## 🏗️ Architecture & Technical Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     Client Tier (React 18)                  │
   │  - Interactive Landing Page & Dynamic ROI Calculator        │
   │  - Executive Recovery Dashboard & Real-Time Metrics         │
   │  - Revora Mobile Simulator & Hinglish Voice Engine          │
   │  - Firebase Auth (Persistent Session & Protected Routes)    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ JSON API & Telemetry
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                   Server Tier (Express + Node.js)           │
   │  - Telemetry Ingestion & Real-Time Root Cause Matrix        │
   │  - Razorpay Orders, Links & Payment Signature Verification   │
   │  - Webhook Listener with HMAC-SHA256 Signature Auth         │
   │  - AI Reasoning & Bounded Negotiation Rails                 │
   │  - Compliant Escalation Engine (RBI Cooldown Rules)         │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ Cryptographic Handshake
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                 External Integrations & Services            │
   │  - Razorpay Payment Gateway & Hosted Checkout (Test/Live)   │
   │  - Google Cloud Run (Containerized Microservices)           │
   │  - Firebase Authentication (Google Cloud Identity Toolkit)  │
   └─────────────────────────────────────────────────────────────┘
```

### Core Technologies
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend & Middleware:** Node.js, Express.js, Vite Dev Middleware, ESBuild
- **Payment & Webhooks:** Official Razorpay Node SDK, Razorpay Checkout Modal, Webhook HMAC verification
- **Authentication:** Firebase Auth (Email/Password, Session Persistence, Route Guards)
- **Compliance & Ledger:** In-memory immutable audit log with persistence sync and RFC-compliant timestamps

---

## 🚀 Core Features Walkthrough

### 1. Interactive Landing Page & ROI Engine
- **Hero Revenue Card:** Real-time incoming failure simulation showing live interception benchmarks.
- **Interactive Live Preview:** Visitors can explore the failure queue, inspect AI diagnoses, and simulate settlements directly in the browser before signing in.
- **Dynamic ROI Calculator:** Allows finance leaders to drag volume and failure rate sliders to calculate their exact annual revenue salvage potential.
- **Enterprise Trust:** Highlights RBI compliance, zero browser-exposed secrets, and bank-grade data security.

### 2. Executive Dashboard (Measured Money)
- **Revenue at Risk:** Total capital trapped in failed or dropped transactions.
- **Revenue Recovered:** Funds settled via verified webhook events (`razorpay_signature_verified`).
- **5 Failure Scenarios:**
  1. *Payment Gateway Outages* (NPCI switch drops and ISO-8583 timeouts)
  2. *Checkout Abandonment* (Cart exits and 3DS challenge friction)
  3. *Failed Subscriptions & e-Mandates* (Liquidity mismatches)
  4. *B2B Overdue Invoices* (Commercial Net-30 credit lag)
  5. *Receivables* (Aging trade accounts)

### 3. Revora Agent Studio (Hinglish Voice Recovery)
- **Sub-Second Gateway Interception:** Intercepts test/live gateway declines and modal dismissals (`[X]` exit).
- **Conversational Voice Recovery:** Outbound voice call simulation speaking natural, empathetic Hinglish:
  > *"Hi Raj, this is Priya calling from the Nike store. I noticed your payment of ₹18,000 was interrupted due to a bank switch timeout..."*
- **Dynamic Bounded Waivers:** The AI authorizes a capped 5% instant discount and dispatches an encrypted 1-click payment link via WhatsApp.
- **Instant Settlement:** One-touch payment via Google Pay, PhonePe, or Cards automatically settles the case and reconciles the ledger.

### 4. Promise-to-Pay (P2P) Tracker
- Extracts customer verbal or text commitments (e.g., *"Will pay after salary on 5th"*).
- Enters commitment into the P2P Calendar with automated payment hold.
- Automatically pauses all outreach sequences to avoid customer annoyance.

### 5. Regulatory Compliance & Stopping Rules
- **RBI Fair Practices Code:** Hard limit of max 3 contact attempts per case.
- **Quiet Hours:** Outbound recovery strictly suppressed between 7:00 PM and 9:00 AM IST.
- **Deterministic Stopping Rules:** Triggers immediate halt upon order cancellation, financial hardship declaration, or customer DND flag.

### 6. Batch Execution & Immutable Audit Ledger
- **Batch Execution:** Process cohorts of thousands of overdue accounts with safety constraint validation and batch recovery reporting.
- **Immutable Audit Trail:** Every call, message, webhook event, and gateway status transition is permanently recorded with actor IDs and compliance flags (`PASS`, `FAIL`, `STOPPING_RULE`).

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/revora-ai.git
cd revora-ai
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the configuration details:
```env
# Gemini API Key (Server-side)
GEMINI_API_KEY=your_gemini_api_key

# Razorpay Credentials (Server-side)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Firebase Authentication (Client-side)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Secret Isolation

- **Zero Client-Side Secret Exposure:** Razorpay `KEY_SECRET` and `WEBHOOK_SECRET` are strictly kept server-side inside `server.ts`.
- **Cryptographic Verification:** All webhook callbacks and checkout signatures are validated via `HMAC-SHA256` digest matching before cases are marked as settled.
- **Firebase Auth Protected Routes:** Dashboard, Queue, Batch, and Audit routes require active Firebase session tokens.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ by Rajeyo Haldar</b><br>
  <i>Revora AI — From Bank Failure to Instant Settlement.</i>
</p>
