# AI-Native Trading Platform 🚀

**From Idea to Trade in 60 Seconds**

An AI-first trading platform that makes institutional-grade market intelligence accessible to everyone through natural language conversation.

---

## 🎯 Vision

Democratize trading intelligence by embedding AI (Claude 4.5, GPT-5) into every interaction. Instead of juggling multiple tools, traders converse with AI to analyze markets, develop strategies, backtest, and execute trades.

## ✨ Key Features

- **Conversational Trading**: "Show me tech stocks breaking out" → AI analyzes and presents opportunities
- **Multimodal Analysis**: AI synthesizes charts, news, sentiment, fundamentals in real-time
- **AI Strategy Generator**: Describe strategy in English → AI generates code and backtests
- **Personalized Risk Management**: AI learns your patterns and warns about emotional mistakes
- **Smart Alerts**: Context-aware notifications ("NVDA hit $125 BUT volume is weak")
- **Voice Trading**: Hands-free operation for active traders

## 📁 Project Structure

```
ai-trading-platform/
├── apps/
│   ├── web/              # Next.js web application
│   └── mobile/           # React Native mobile app
├── services/
│   ├── user-service/     # Authentication, profiles, subscriptions
│   ├── trading-service/  # Order execution, portfolio management
│   ├── ai-service/       # LLM integration, analysis, strategy generation
│   └── market-data-service/ # Real-time data, news, sentiment
├── packages/
│   ├── ui/               # Shared UI components
│   ├── shared-types/     # TypeScript types
│   └── utils/            # Shared utilities
└── docs/
    ├── TRADING_PLATFORM_ANALYSIS.md  # Market research
    ├── PRD.md                        # Product requirements
    └── ARCHITECTURE.md               # Technical architecture
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- Anthropic API key (for Claude)
- Alpaca API keys (for trading)

### Installation

```bash
# Clone the repository
git clone https://github.com/akaash-nigam/msSaaS_marketTrader.git
cd msSaaS_marketTrader

# Install dependencies
pnpm install

# Set up environment variables
cp services/ai-service/.env.example services/ai-service/.env
cp apps/web/.env.example apps/web/.env.local

# Add your Anthropic API key to services/ai-service/.env
ANTHROPIC_API_KEY=your_api_key_here

# Start AI service (in one terminal)
pnpm --filter @trading-platform/ai-service dev

# Start web app (in another terminal)
pnpm --filter @trading-platform/web dev
```

Open [http://localhost:3006](http://localhost:3006) to see the app!

### Environment Variables

Create `.env` files in each service:

```bash
# services/ai-service/.env
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# services/trading-service/.env
ALPACA_API_KEY=your_key_here
ALPACA_SECRET_KEY=your_secret_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets  # paper trading

# services/market-data-service/.env
POLYGON_API_KEY=your_key_here
```

## 🏗️ Technology Stack

### Frontend
- **Web**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Mobile**: React Native (Expo)
- **Charting**: Lightweight Charts (TradingView)
- **State**: Zustand + TanStack Query

### Backend
- **Services**: Node.js (Express/Fastify), Python (FastAPI)
- **Databases**: PostgreSQL (TimescaleDB), MongoDB, Redis, ClickHouse
- **Message Queue**: RabbitMQ
- **Infrastructure**: Kubernetes, Docker

### AI/ML
- **LLMs**: Anthropic Claude 4.5, OpenAI GPT-5
- **Vector DB**: Pinecone
- **Sentiment**: FinBERT

## 📊 API Documentation

Once services are running:

- **GraphQL Playground**: http://localhost:4000/graphql
- **AI Service API Docs**: http://localhost:5000/docs
- **Trading Service API Docs**: http://localhost:3001/docs

## 🧪 Development

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build
```

## 📈 Roadmap

### Phase 1: MVP (Months 1-3) ✅ In Progress
- [x] Project setup and architecture
- [x] AI chat interface (Claude 4.5 Sonnet integration)
- [x] Stock analysis tool
- [x] Interactive candlestick charts
- [x] Watchlist functionality
- [x] Landing page
- [ ] Real market data integration
- [ ] Paper trading (Alpaca)
- [ ] User authentication

**See [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) for detailed feature planning**

### Phase 2: Intelligence (Months 4-6)
- [ ] Multimodal analysis (news + sentiment)
- [ ] AI strategy generator
- [ ] Mobile app
- [ ] Live trading
- [ ] Subscription tiers

### Phase 3: Community (Months 7-9)
- [ ] Strategy sharing
- [ ] Crowd intelligence
- [ ] Voice trading
- [ ] Multi-agent AI

### Phase 4: Scale (Months 10-12)
- [ ] Global markets
- [ ] Options analytics
- [ ] Public API
- [ ] Institutional features

## 🤝 Contributing

We're in early development. Check `docs/ARCHITECTURE.md` for technical details and `docs/PRD.md` for feature requirements.

## 📄 License

Proprietary - All rights reserved

## 📖 Available Pages

- **`/`** - AI Chat Interface
- **`/analyze`** - Stock Analysis Tool
- **`/charts`** - Interactive Charting
- **`/watchlist`** - Portfolio Watchlist
- **`/landing`** - Marketing Landing Page

## 🔗 Links

- [Feature Roadmap](./FEATURE_ROADMAP.md)
- [Product Requirements (PRD)](./docs/PRD.md)
- [Technical Architecture](./docs/ARCHITECTURE.md)
- [Market Analysis](./docs/TRADING_PLATFORM_ANALYSIS.md)

---

**Built with ❤️ and Claude 4.5**
