# System Architecture
# AI-Native Trading Platform

**Version**: 1.0
**Date**: October 9, 2025
**Status**: Design Phase

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [API Design](#api-design)
6. [Database Schema](#database-schema)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Architecture](#security-architecture)
9. [Scalability Strategy](#scalability-strategy)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├────────────────┬────────────────┬───────────────────────────────┤
│   Web App      │   Mobile App   │   Voice Interface (Future)    │
│  (Next.js)     │ (React Native) │                               │
└────────┬───────┴────────┬───────┴───────────────────────────────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────▼────────┐
         │   CDN/Edge      │ (Cloudflare)
         │   Static Assets │
         └────────┬────────┘
                  │
    ┌─────────────▼─────────────┐
    │     API GATEWAY (Kong)    │
    │  - Rate Limiting          │
    │  - Authentication         │
    │  - Load Balancing         │
    └─────────────┬─────────────┘
                  │
    ┌─────────────▼─────────────────────────────────┐
    │         MICROSERVICES LAYER                   │
    ├───────────┬──────────┬──────────┬─────────────┤
    │   User    │ Trading  │ Market   │  AI         │
    │  Service  │ Service  │  Data    │ Service     │
    │           │          │ Service  │             │
    ├───────────┼──────────┼──────────┼─────────────┤
    │ Strategy  │  Alert   │Analytics │ Backtesting │
    │  Service  │ Service  │ Service  │  Engine     │
    └─────┬─────┴────┬─────┴────┬─────┴─────┬───────┘
          │          │          │           │
    ┌─────▼──────────▼──────────▼───────────▼───────┐
    │            DATA LAYER                          │
    ├────────────┬───────────┬──────────┬────────────┤
    │ PostgreSQL │  MongoDB  │  Redis   │ ClickHouse │
    │(TimescaleDB│  (Docs)   │ (Cache)  │ (Analytics)│
    └────────────┴───────────┴──────────┴────────────┘

    ┌─────────────────────────────────────────────────┐
    │         EXTERNAL SERVICES                       │
    ├──────────┬──────────┬──────────┬───────────────┤
    │ Anthropic│  OpenAI  │ Polygon  │ Alpaca/IB/    │
    │ (Claude) │  (GPT)   │ (Data)   │ Zerodha       │
    └──────────┴──────────┴──────────┴───────────────┘
```

### Design Principles

1. **Microservices Architecture**: Loosely coupled services for independent scaling and deployment
2. **Event-Driven**: Use message queues for async communication
3. **API-First**: All functionality exposed via well-documented APIs
4. **Real-Time First**: WebSocket for live data, fallback to polling
5. **Security by Design**: Zero-trust architecture, encryption everywhere
6. **Observability**: Comprehensive logging, metrics, tracing
7. **Resilience**: Circuit breakers, retries, graceful degradation

---

## System Components

### 1. API Gateway (Kong)

**Purpose**: Single entry point for all client requests

**Responsibilities**:
- **Authentication**: Verify JWTs, API keys
- **Rate Limiting**: Prevent abuse (per-user, per-IP)
- **Load Balancing**: Distribute traffic across service instances
- **Request Routing**: Route to appropriate microservice
- **API Versioning**: Support v1, v2 APIs simultaneously
- **CORS**: Handle cross-origin requests

**Technology**: Kong (open-source API gateway)

**Configuration Example**:
```yaml
services:
  - name: user-service
    url: http://user-service:3000
    routes:
      - paths: [/api/v1/users]
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          policy: local
```

---

### 2. User Service

**Purpose**: Manage user accounts, authentication, profiles

**Responsibilities**:
- User registration (email/password, OAuth)
- Authentication (JWT issuance)
- Profile management (preferences, settings)
- Subscription management (Free, Pro, Elite)
- MFA (multi-factor authentication)

**Tech Stack**:
- **Runtime**: Node.js (Express)
- **Database**: PostgreSQL (user data)
- **Auth**: Auth0 (OAuth provider) or custom JWT
- **Payments**: Stripe API

**API Endpoints**:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/subscriptions` - Create subscription

**Database Schema** (PostgreSQL):
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for OAuth users
  full_name VARCHAR(255),
  oauth_provider VARCHAR(50), -- 'google', 'apple', NULL
  oauth_id VARCHAR(255),
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'pro', 'elite'
  subscription_status VARCHAR(20), -- 'active', 'canceled', 'past_due'
  subscription_id VARCHAR(255), -- Stripe subscription ID
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_status);
```

---

### 3. Trading Service

**Purpose**: Execute trades, manage positions, broker integration

**Responsibilities**:
- Place orders (market, limit, stop, etc.)
- Cancel/modify orders
- Fetch positions and portfolio
- Calculate P&L (profit & loss)
- Integrate with brokers (Alpaca, IB, Zerodha)
- Pre-trade risk checks (buying power, limits)

**Tech Stack**:
- **Runtime**: Node.js (Fastify for performance)
- **Database**: PostgreSQL (orders, positions)
- **Message Queue**: RabbitMQ (order events)
- **WebSocket**: Real-time order status updates

**API Endpoints**:
- `POST /api/v1/orders` - Place order
- `DELETE /api/v1/orders/:id` - Cancel order
- `GET /api/v1/positions` - Get current positions
- `GET /api/v1/portfolio` - Get portfolio summary (P&L, allocations)

**Database Schema**:
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  broker VARCHAR(50) NOT NULL, -- 'alpaca', 'interactive_brokers', 'zerodha'
  broker_order_id VARCHAR(255), -- Order ID from broker
  symbol VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
  type VARCHAR(20) NOT NULL, -- 'market', 'limit', 'stop', 'stop_limit'
  quantity INTEGER NOT NULL,
  filled_quantity INTEGER DEFAULT 0,
  price DECIMAL(10, 2), -- NULL for market orders
  stop_price DECIMAL(10, 2), -- For stop orders
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'filled', 'canceled', 'rejected'
  time_in_force VARCHAR(10) DEFAULT 'day', -- 'day', 'gtc', 'ioc'
  created_at TIMESTAMP DEFAULT NOW(),
  filled_at TIMESTAMP,
  avg_fill_price DECIMAL(10, 2)
);

CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  broker VARCHAR(50) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  avg_cost DECIMAL(10, 2) NOT NULL,
  current_price DECIMAL(10, 2),
  market_value DECIMAL(12, 2),
  unrealized_pl DECIMAL(10, 2), -- Unrealized P&L
  unrealized_pl_pct DECIMAL(5, 2),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_positions_unique ON positions(user_id, broker, symbol);
```

**Broker Integration Pattern** (Strategy pattern):
```typescript
// trading-service/src/brokers/broker-interface.ts
export interface BrokerAdapter {
  placeOrder(order: Order): Promise<BrokerOrderResponse>;
  cancelOrder(orderId: string): Promise<void>;
  getPositions(userId: string): Promise<Position[]>;
  getAccount(userId: string): Promise<AccountInfo>;
}

// Implementations
class AlpacaBroker implements BrokerAdapter { ... }
class InteractiveBrokersBroker implements BrokerAdapter { ... }
class ZerodhaBroker implements BrokerAdapter { ... }
```

---

### 4. Market Data Service

**Purpose**: Fetch and stream real-time and historical market data

**Responsibilities**:
- Real-time price updates (WebSocket streams)
- Historical OHLCV data (REST API)
- News feeds (Benzinga, NewsAPI)
- Social sentiment (Twitter, Reddit)
- Earnings calendar
- Cache frequently accessed data

**Tech Stack**:
- **Runtime**: Node.js (for WebSocket) + Python (for data processing)
- **Database**: TimescaleDB (time-series data)
- **Cache**: Redis (quote cache, 1-second TTL)
- **Message Queue**: Kafka (high-throughput event streaming)

**API Endpoints**:
- `GET /api/v1/quotes/:symbol` - Get current quote
- `GET /api/v1/history/:symbol` - Get historical data (OHLCV)
- `GET /api/v1/news/:symbol` - Get recent news
- `WS /api/v1/stream/quotes` - Real-time quote stream

**Data Pipeline**:
```
Polygon.io WebSocket → Kafka → Market Data Service → Redis Cache → Clients
                                     ↓
                              TimescaleDB (historical)
```

**Database Schema** (TimescaleDB):
```sql
CREATE TABLE stock_quotes (
  time TIMESTAMPTZ NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  open DECIMAL(10, 2),
  high DECIMAL(10, 2),
  low DECIMAL(10, 2),
  close DECIMAL(10, 2),
  volume BIGINT,
  vwap DECIMAL(10, 2) -- Volume-weighted average price
);

SELECT create_hypertable('stock_quotes', 'time');
CREATE INDEX idx_quotes_symbol_time ON stock_quotes(symbol, time DESC);

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20),
  title TEXT NOT NULL,
  content TEXT,
  source VARCHAR(100),
  url TEXT,
  sentiment DECIMAL(3, 2), -- -1 to +1 (bearish to bullish)
  published_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_symbol_time ON news(symbol, published_at DESC);
```

---

### 5. AI Service

**Purpose**: Interface with LLMs for analysis, strategy generation, chat

**Responsibilities**:
- Natural language query processing
- Stock analysis (multimodal: charts, news, sentiment)
- Strategy generation from descriptions
- Code generation (Python, Pine Script)
- Personalized recommendations
- Prompt management and optimization

**Tech Stack**:
- **Runtime**: Python (FastAPI) - better for AI/ML libraries
- **LLM SDKs**: Anthropic SDK (Claude), OpenAI SDK (GPT)
- **Vector DB**: Pinecone or Weaviate (semantic search)
- **Cache**: Redis (response caching for common queries)

**API Endpoints**:
- `POST /api/v1/ai/chat` - Conversational interface
- `POST /api/v1/ai/analyze/:symbol` - Analyze a stock
- `POST /api/v1/ai/generate-strategy` - Generate strategy from description
- `POST /api/v1/ai/explain` - Explain a concept (educational)

**Architecture**:
```
Client Request
  ↓
AI Service (FastAPI)
  ↓
Prompt Builder (injects context: user preferences, market data)
  ↓
LLM API (Claude 4.5 or GPT-5)
  ↓ (streaming response)
Client (real-time tokens)
```

**Example Code** (Python):
```python
# ai-service/src/services/llm_service.py
from anthropic import Anthropic
import os

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

async def analyze_stock(symbol: str, user_context: dict) -> str:
    # Fetch market data
    quote = await get_quote(symbol)
    news = await get_news(symbol)
    sentiment = await get_sentiment(symbol)

    # Build prompt
    prompt = f"""Analyze {symbol} for a trader.

Current Price: ${quote['price']} ({quote['change_pct']}%)
Volume: {quote['volume']} ({quote['avg_volume_ratio']}x average)

Recent News:
{news[:3]}  # Top 3 news items

Social Sentiment: {sentiment['score']} ({sentiment['label']})

User Context:
- Trading Style: {user_context['trading_style']}
- Risk Tolerance: {user_context['risk_tolerance']}

Provide:
1. Technical analysis (key levels, indicators)
2. Fundamental outlook (brief)
3. Sentiment analysis
4. Trade idea (entry, stop, target) if opportunity exists
5. Risk assessment
"""

    # Stream response
    with client.messages.stream(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            yield text  # Stream to client
```

**Cost Optimization**:
- Cache responses for identical queries (1-hour TTL)
- Use smaller models for simple tasks (e.g., sentiment = FinBERT, not GPT)
- Batch requests where possible
- Rate limit free tier (10 queries/day)

---

### 6. Strategy Service

**Purpose**: Manage trading strategies, backtesting

**Responsibilities**:
- Store user strategies (custom and AI-generated)
- Execute backtests (historical simulation)
- Deploy strategies to live/paper trading
- Monitor deployed strategies

**Tech Stack**:
- **Runtime**: Python (for backtesting libraries)
- **Database**: PostgreSQL (strategies), MongoDB (backtest results)
- **Backtesting Engine**: Custom (based on vectorized pandas) or QuantConnect LEAN

**API Endpoints**:
- `POST /api/v1/strategies` - Create strategy
- `POST /api/v1/strategies/:id/backtest` - Run backtest
- `POST /api/v1/strategies/:id/deploy` - Deploy to live/paper trading
- `GET /api/v1/strategies/:id/performance` - Get live performance

**Database Schema**:
```sql
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  entry_conditions JSONB NOT NULL, -- e.g., [{"indicator": "RSI", "operator": "<", "value": 30}]
  exit_conditions JSONB NOT NULL,
  position_sizing VARCHAR(50), -- 'fixed', 'percent_portfolio', 'risk_based'
  position_size DECIMAL(10, 2),
  stop_loss_pct DECIMAL(5, 2),
  take_profit_pct DECIMAL(5, 2),
  code TEXT, -- Generated Python or Pine Script
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'backtested', 'deployed'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_strategies_user ON strategies(user_id);
```

**Backtest Results** (MongoDB for flexibility):
```json
{
  "strategy_id": "uuid",
  "backtest_id": "uuid",
  "parameters": {
    "start_date": "2020-01-01",
    "end_date": "2024-12-31",
    "initial_capital": 100000,
    "commission": 0.001
  },
  "results": {
    "total_return_pct": 87.3,
    "annualized_return_pct": 16.2,
    "sharpe_ratio": 1.4,
    "max_drawdown_pct": -14.2,
    "win_rate": 61,
    "total_trades": 342,
    "avg_win_pct": 4.2,
    "avg_loss_pct": -2.8,
    "profit_factor": 2.1
  },
  "equity_curve": [
    {"date": "2020-01-01", "value": 100000},
    {"date": "2020-01-02", "value": 100500},
    ...
  ],
  "trades": [
    {
      "entry_date": "2020-01-15",
      "exit_date": "2020-01-20",
      "symbol": "AAPL",
      "side": "long",
      "entry_price": 295.50,
      "exit_price": 308.20,
      "quantity": 100,
      "pnl": 1270,
      "pnl_pct": 4.3
    },
    ...
  ]
}
```

---

### 7. Alert Service

**Purpose**: Manage user alerts and notifications

**Responsibilities**:
- Create/update/delete alerts
- Monitor market data for alert conditions
- Send notifications (push, email, SMS)
- Context enrichment (AI analysis when alert fires)

**Tech Stack**:
- **Runtime**: Node.js
- **Database**: PostgreSQL (alert definitions), Redis (alert state)
- **Notifications**: Firebase Cloud Messaging (push), SendGrid (email)

**API Endpoints**:
- `POST /api/v1/alerts` - Create alert
- `GET /api/v1/alerts` - List user alerts
- `DELETE /api/v1/alerts/:id` - Delete alert

**Database Schema**:
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  conditions JSONB NOT NULL, -- e.g., [{"type": "price", "operator": ">", "value": 180}]
  notification_methods JSONB, -- ["push", "email"]
  enabled BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMP, -- Last time alert fired
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_symbol ON alerts(symbol) WHERE enabled = TRUE;
```

**Alert Processing Loop**:
```typescript
// alert-service/src/workers/alert-monitor.ts
setInterval(async () => {
  const activeAlerts = await db.query('SELECT * FROM alerts WHERE enabled = TRUE');

  for (const alert of activeAlerts) {
    const quote = await getQuote(alert.symbol);

    if (evaluateConditions(alert.conditions, quote)) {
      // Alert triggered!
      const aiContext = await aiService.analyzeStock(alert.symbol);

      await sendNotification(alert.user_id, {
        title: `Alert: ${alert.symbol} ${alert.conditions[0].value}`,
        body: aiContext.summary,
        data: { alert_id: alert.id, symbol: alert.symbol }
      });

      await db.query('UPDATE alerts SET triggered_at = NOW() WHERE id = $1', [alert.id]);
    }
  }
}, 5000); // Check every 5 seconds
```

---

### 8. Analytics Service

**Purpose**: Generate insights, reports, user analytics

**Responsibilities**:
- Portfolio performance analytics
- Trade analytics (win rate, P&L breakdown)
- User behavior analytics (for product improvement)
- Generate weekly/monthly reports

**Tech Stack**:
- **Runtime**: Python (pandas, numpy for number crunching)
- **Database**: ClickHouse (fast aggregations)
- **Scheduler**: Apache Airflow (cron jobs for reports)

**Example Query** (ClickHouse):
```sql
-- Get user win rate and P&L by month
SELECT
  toStartOfMonth(filled_at) AS month,
  COUNT(*) AS total_trades,
  SUM(CASE WHEN unrealized_pl > 0 THEN 1 ELSE 0 END) / COUNT(*) AS win_rate,
  SUM(unrealized_pl) AS total_pnl
FROM orders
WHERE user_id = 'uuid' AND status = 'filled'
GROUP BY month
ORDER BY month DESC;
```

---

## Technology Stack

### Frontend

**Web Application**:
- **Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript
- **State Management**: Zustand (lightweight) + TanStack Query (server state)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Charting**: Lightweight Charts (TradingView library, WebGL-based)
- **Real-time**: WebSocket (native) + Server-Sent Events
- **Forms**: React Hook Form + Zod (validation)
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit), Playwright (E2E)

**Mobile Application**:
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **Charts**: react-native-wagmi-charts
- **Notifications**: Firebase Cloud Messaging

---

### Backend

**Microservices**:
- **User Service**: Node.js (Express)
- **Trading Service**: Node.js (Fastify - higher performance)
- **Market Data Service**: Node.js (WebSocket server) + Python (data processing)
- **AI Service**: Python (FastAPI)
- **Strategy Service**: Python (backtesting, NumPy/Pandas)
- **Alert Service**: Node.js (Express)
- **Analytics Service**: Python (pandas, ClickHouse client)

**API Layer**:
- **GraphQL**: Apollo Server (for flexible frontend queries)
- **REST**: Express/Fastify
- **WebSocket**: ws library (Node.js)

---

### Databases

- **PostgreSQL** (v16+): User data, orders, positions, strategies
  - Extension: **TimescaleDB** for time-series market data
- **MongoDB** (v7+): AI conversation history, backtest results (flexible schema)
- **Redis** (v7+): Session storage, caching, pub/sub
- **ClickHouse** (v24+): Analytics, high-speed aggregations

---

### Message Queue

- **RabbitMQ** or **Apache Kafka**:
  - Order events (placed, filled, canceled)
  - Market data events (price updates)
  - Alert events (triggered)
  - Async job processing (backtests, reports)

---

### AI/ML

- **LLMs**: Anthropic Claude API, OpenAI GPT API
- **Vector DB**: Pinecone or Weaviate
- **ML Libraries**: scikit-learn, TensorFlow (if custom models needed)
- **Sentiment Analysis**: FinBERT (Hugging Face)

---

### Infrastructure

**Cloud Provider**: AWS or GCP

**Compute**:
- **Kubernetes** (EKS/GKE): Container orchestration
- **Docker**: Containerization
- **Serverless**: AWS Lambda / Cloud Functions (for AI inference, event processing)

**Storage**:
- **S3/Cloud Storage**: Historical data backups, user uploads
- **EBS/Persistent Disk**: Database volumes

**Networking**:
- **CDN**: Cloudflare (static assets, DDoS protection)
- **Load Balancer**: ALB/NLB (AWS) or Cloud Load Balancing (GCP)
- **DNS**: Route 53 or Cloud DNS

**Observability**:
- **Logging**: Datadog or ELK Stack
- **Metrics**: Datadog or Prometheus + Grafana
- **Tracing**: Datadog APM or Jaeger
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom

**CI/CD**:
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions or GitLab CI
- **Container Registry**: Docker Hub or ECR/GCR
- **Deployment**: ArgoCD (GitOps) or Spinnaker

---

## Data Flow

### Real-Time Market Data Flow

```
Polygon.io WebSocket
  ↓
Market Data Service (Node.js WebSocket server)
  ↓
Parse & Validate
  ↓
├─→ Redis (cache, 1-sec TTL) → API Gateway → Clients
└─→ Kafka (event stream) → TimescaleDB (historical storage)
                         → Alert Service (check alert conditions)
```

### Trading Flow

```
Client (Web/Mobile)
  ↓
API Gateway
  ↓
Trading Service
  ↓
Pre-trade Checks (buying power, limits)
  ↓
Broker Adapter (Alpaca/IB/Zerodha)
  ↓
Broker API
  ↓
Order Confirmation
  ↓
WebSocket → Client (real-time status update)
  ↓
PostgreSQL (persist order)
  ↓
RabbitMQ → Analytics Service (update stats)
```

### AI Analysis Flow

```
Client: "Analyze NVDA"
  ↓
API Gateway → AI Service
  ↓
AI Service fetches context:
  ├─→ Market Data Service (price, volume)
  ├─→ News API (recent news)
  ├─→ Sentiment API (social sentiment)
  └─→ User Preferences DB (trading style, risk tolerance)
  ↓
Build Prompt (inject all context)
  ↓
LLM API (Claude/GPT) → Streaming Response
  ↓
AI Service → API Gateway → Client (token-by-token)
  ↓
Cache in Redis (1-hour TTL for identical queries)
```

---

## API Design

### GraphQL Schema Example

```graphql
type User {
  id: ID!
  email: String!
  fullName: String
  subscriptionTier: SubscriptionTier!
  createdAt: DateTime!
}

enum SubscriptionTier {
  FREE
  PRO
  ELITE
}

type Quote {
  symbol: String!
  price: Float!
  change: Float!
  changePct: Float!
  volume: Int!
  timestamp: DateTime!
}

type Position {
  symbol: String!
  quantity: Int!
  avgCost: Float!
  currentPrice: Float!
  unrealizedPL: Float!
  unrealizedPLPct: Float!
}

type Order {
  id: ID!
  symbol: String!
  side: OrderSide!
  type: OrderType!
  quantity: Int!
  price: Float
  status: OrderStatus!
  createdAt: DateTime!
  filledAt: DateTime
}

enum OrderSide { BUY, SELL }
enum OrderType { MARKET, LIMIT, STOP, STOP_LIMIT }
enum OrderStatus { PENDING, FILLED, CANCELED, REJECTED }

type Query {
  me: User
  quote(symbol: String!): Quote
  positions: [Position!]!
  orders(limit: Int = 50): [Order!]!
}

type Mutation {
  placeOrder(input: OrderInput!): Order!
  cancelOrder(id: ID!): Boolean!
}

input OrderInput {
  symbol: String!
  side: OrderSide!
  type: OrderType!
  quantity: Int!
  price: Float
  stopPrice: Float
}

type Subscription {
  quoteUpdates(symbols: [String!]!): Quote!
  orderUpdates: Order!
}
```

---

## Database Schema

See individual service sections above for detailed schemas. Key tables:

1. **users** (User Service)
2. **orders** (Trading Service)
3. **positions** (Trading Service)
4. **stock_quotes** (Market Data Service, TimescaleDB)
5. **news** (Market Data Service)
6. **strategies** (Strategy Service)
7. **alerts** (Alert Service)

---

## Deployment Architecture

### Kubernetes Cluster Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Namespace: ingress                                   │  │
│  │  - NGINX Ingress Controller                           │  │
│  │  - SSL/TLS Termination (Let's Encrypt)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Namespace: api                                       │  │
│  │  - API Gateway (Kong) [3 replicas]                    │  │
│  │  - User Service [2 replicas]                          │  │
│  │  - Trading Service [3 replicas] (high traffic)        │  │
│  │  - Market Data Service [5 replicas] (WebSocket)       │  │
│  │  - AI Service [2 replicas]                            │  │
│  │  - Strategy Service [2 replicas]                      │  │
│  │  - Alert Service [2 replicas]                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Namespace: data                                      │  │
│  │  - PostgreSQL (StatefulSet, 3 replicas)               │  │
│  │  - MongoDB (StatefulSet, 3 replicas)                  │  │
│  │  - Redis (StatefulSet, 3 replicas)                    │  │
│  │  - RabbitMQ (StatefulSet, 3 replicas)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Namespace: monitoring                                │  │
│  │  - Prometheus                                         │  │
│  │  - Grafana                                            │  │
│  │  - Jaeger (tracing)                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Horizontal Pod Autoscaling (HPA)

```yaml
# trading-service-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: trading-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: trading-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Security Architecture

### Authentication Flow (JWT)

```
1. User → POST /api/v1/auth/login {email, password}
2. User Service validates credentials
3. User Service generates JWT:
   {
     "sub": "user_id",
     "email": "user@example.com",
     "tier": "pro",
     "exp": 1735689600 (24 hours)
   }
4. User Service returns JWT to client
5. Client stores JWT (localStorage or secure cookie)
6. Client includes JWT in Authorization header: "Bearer <token>"
7. API Gateway validates JWT (checks signature, expiration)
8. API Gateway forwards request to microservice with user context
```

### Broker Credential Storage

```
User connects broker (e.g., Alpaca)
  ↓
OAuth flow to Alpaca → Get access token
  ↓
Encrypt access token (AES-256)
  ↓
Store in HashiCorp Vault (NOT database)
  ↓
Trading Service fetches from Vault when needed
```

### Data Encryption

- **In Transit**: TLS 1.3 for all HTTP/WebSocket connections
- **At Rest**: AES-256 for database encryption (PostgreSQL, MongoDB)
- **PII**: Additional encryption layer for sensitive data (email, phone)

---

## Scalability Strategy

### Horizontal Scaling

- **Stateless Services**: All microservices are stateless (session in Redis)
- **Load Balancing**: API Gateway distributes requests across instances
- **Auto-Scaling**: HPA based on CPU/memory usage

### Database Scaling

- **Read Replicas**: PostgreSQL read replicas for analytics queries
- **Sharding**: MongoDB sharding for large collections (backtest results)
- **Caching**: Redis for frequently accessed data (quotes, user profiles)

### WebSocket Scaling

- **Sticky Sessions**: Load balancer routes same user to same WebSocket server
- **Redis Pub/Sub**: Broadcast messages across WebSocket servers

### CDN for Static Assets

- **Cloudflare**: Cache HTML, CSS, JS, images at edge locations
- **Reduces latency**: Users download from nearest edge server

---

**Next Steps**:
1. Set up project structure
2. Implement core services (User, Trading, Market Data)
3. Deploy to Kubernetes (staging environment)
4. Integrate AI service (Claude API)
5. Build frontend (Next.js web app)

---

*Document End*
