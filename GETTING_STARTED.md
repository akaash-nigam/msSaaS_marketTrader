# Getting Started with AI Trading Platform

Welcome! This guide will help you set up and run the AI-native trading platform.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** ([Download](https://nodejs.org/))
- **pnpm 8+** (Install: `npm install -g pnpm`)
- **Anthropic API Key** ([Get one](https://console.anthropic.com/))
- **Git** (for version control)

Optional:
- **Docker** (for running databases locally)
- **Alpaca API Key** (for paper/live trading - [Sign up](https://alpaca.markets/))

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Navigate to project directory
cd marketTrader

# Install all dependencies
pnpm install
```

### 2. Configure AI Service

```bash
# Navigate to AI service
cd services/ai-service

# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# You can use nano, vim, or any text editor:
nano .env
```

Add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Start the AI Service

```bash
# Install dependencies (if not already done from root)
pnpm install

# Start in development mode
pnpm dev
```

You should see:
```
🚀 AI Service running on http://localhost:5000
```

### 4. Test the API

Open a new terminal and try these commands:

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Analyze a Stock:**
```bash
curl -X POST http://localhost:5000/api/v1/analyze/NVDA \
  -H "Content-Type: application/json" \
  -d '{
    "userContext": {
      "tradingStyle": "swing trading",
      "riskTolerance": "moderate"
    }
  }'
```

**Ask a Question:**
```bash
curl -X POST http://localhost:5000/api/v1/chat/simple \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the market doing today?"}'
```

**Explain a Concept:**
```bash
curl -X POST http://localhost:5000/api/v1/explain \
  -H "Content-Type: application/json" \
  -d '{"concept": "RSI indicator"}'
```

**Generate a Strategy:**
```bash
curl -X POST http://localhost:5000/api/v1/generate-strategy \
  -H "Content-Type: application/json" \
  -d '{"description": "Buy stocks when RSI is oversold and sell when overbought"}'
```

## Project Structure

```
marketTrader/
├── docs/                     # Documentation
│   ├── TRADING_PLATFORM_ANALYSIS.md
│   ├── PRD.md
│   └── ARCHITECTURE.md
├── services/
│   └── ai-service/          # ✅ AI service (Claude integration)
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   └── services/
│       └── README.md
├── apps/
│   ├── web/                 # 🚧 Next.js web app (coming soon)
│   └── mobile/              # 🚧 React Native app (coming soon)
├── packages/                # 🚧 Shared packages (coming soon)
└── README.md
```

## What's Implemented

### ✅ Phase 1 - AI Service (Complete)

The core AI service is fully functional with:

- **Stock Analysis**: Natural language stock analysis using Claude 4.5
- **Chat Interface**: Conversational AI for trading questions
- **Strategy Generation**: Create strategies from descriptions
- **Educational Content**: Explain trading concepts

### 🚧 Coming Next

- **Web Frontend**: React/Next.js UI for the trading platform
- **Trading Service**: Alpaca/Zerodha integration for live trading
- **Market Data Service**: Real-time quotes, news, sentiment
- **User Service**: Authentication and profiles

## Development Workflow

### Running the AI Service

```bash
cd services/ai-service

# Development mode (auto-reload)
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

### Making Changes

1. Edit files in `services/ai-service/src/`
2. The service will auto-reload (in dev mode)
3. Test your changes with cURL or Postman

### Adding New Features

Example: Add a new endpoint

1. Create a new route in `src/routes/`
2. Register it in `src/index.ts`
3. Test with cURL
4. Update README with new endpoint

## Troubleshooting

### "Module not found" errors

```bash
# Clean install
rm -rf node_modules
pnpm install
```

### API Key not working

- Verify your `.env` file is in `services/ai-service/`
- Check the key starts with `sk-ant-`
- Ensure no extra spaces or quotes
- Restart the service after changing `.env`

### Port already in use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

## Next Steps

### For Developers

1. **Read the docs**: Check `docs/ARCHITECTURE.md` for system design
2. **Explore the code**: Start with `services/ai-service/src/index.ts`
3. **Add features**: See `docs/PRD.md` for planned features
4. **Run tests**: `pnpm test` (when tests are added)

### For Traders

The platform is in early development. Once the web frontend is complete, you'll be able to:

- Chat with AI about market conditions
- Get stock analysis in seconds
- Generate and backtest trading strategies
- Execute trades (paper and live)
- Track your performance with AI insights

## API Examples

### Example 1: Market Overview

```bash
curl -X POST http://localhost:5000/api/v1/chat/simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Give me a market overview for today"}'
```

### Example 2: Stock Comparison

```bash
curl -X POST http://localhost:5000/api/v1/chat/simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Compare NVDA vs AMD for a swing trade"}'
```

### Example 3: Strategy Ideas

```bash
curl -X POST http://localhost:5000/api/v1/generate-strategy \
  -H "Content-Type: application/json" \
  -d '{"description": "Momentum trading strategy for tech stocks using MACD and volume"}'
```

## Resources

- **Anthropic API Docs**: https://docs.anthropic.com/
- **Claude Models**: https://www.anthropic.com/claude
- **FastifyJS Docs**: https://www.fastify.io/
- **TypeScript Docs**: https://www.typescriptlang.org/

## Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check `docs/` folder for detailed guides
- **Code Comments**: Most files have inline documentation

## License

Proprietary - All rights reserved

---

**Built with Claude 4.5 Sonnet** 🚀

Last Updated: October 9, 2025
