# AI Service

The AI service powers the conversational trading interface using Claude 4.5 Sonnet.

## Features

- **Stock Analysis**: Multimodal analysis combining technical, fundamental, and sentiment data
- **Chat Interface**: Conversational AI for market questions and trading advice
- **Strategy Generation**: Create trading strategies from natural language descriptions
- **Educational Content**: Explain complex trading concepts in simple terms

## API Endpoints

### Health Check
```bash
GET /health
```

### Analyze Stock
```bash
POST /api/v1/analyze/:symbol
Content-Type: application/json

{
  "userContext": {
    "tradingStyle": "swing",
    "riskTolerance": "moderate",
    "experience": "intermediate"
  }
}
```

Example:
```bash
curl -X POST http://localhost:5000/api/v1/analyze/NVDA \
  -H "Content-Type: application/json" \
  -d '{
    "userContext": {
      "tradingStyle": "momentum",
      "riskTolerance": "high"
    }
  }'
```

### Chat (Simple, Non-Streaming)
```bash
POST /api/v1/chat/simple
Content-Type: application/json

{
  "message": "What's the market doing today?"
}
```

### Chat (Streaming)
```bash
POST /api/v1/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Analyze NVDA for me" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "What about entry points?" }
  ]
}
```

### Generate Strategy
```bash
POST /api/v1/generate-strategy
Content-Type: application/json

{
  "description": "Buy stocks when they break above 50-day moving average with strong volume"
}
```

### Explain Concept
```bash
POST /api/v1/explain
Content-Type: application/json

{
  "concept": "RSI"
}
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Copy `.env.example` to `.env` and add your Anthropic API key:
```bash
cp .env.example .env
```

3. Get your API key from [Anthropic Console](https://console.anthropic.com/)

4. Start the service:
```bash
pnpm dev
```

The service will run on `http://localhost:5000`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `OPENAI_API_KEY`: OpenAI API key (optional fallback)
- `LOG_LEVEL`: Logging level (info/debug/error)

## Development

```bash
# Run in development mode with auto-reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Architecture

```
src/
├── index.ts              # Server setup and initialization
├── routes/
│   ├── analyze.ts        # Stock analysis endpoints
│   └── chat.ts           # Chat interface endpoints
└── services/
    └── claude.service.ts # Claude AI integration
```

## Testing with cURL

Analyze a stock:
```bash
curl -X POST http://localhost:5000/api/v1/analyze/AAPL \
  -H "Content-Type: application/json" \
  -d '{"userContext": {"tradingStyle": "day trading"}}'
```

Ask a question:
```bash
curl -X POST http://localhost:5000/api/v1/chat/simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain what a bull market is"}'
```

Generate a strategy:
```bash
curl -X POST http://localhost:5000/api/v1/generate-strategy \
  -H "Content-Type: application/json" \
  -d '{"description": "Buy dips in uptrends using RSI oversold signals"}'
```

## Next Steps

- [ ] Integrate with Market Data Service for real-time quotes
- [ ] Add sentiment analysis from news/social media
- [ ] Implement strategy backtesting
- [ ] Add caching for frequent queries
- [ ] Implement rate limiting
- [ ] Add user authentication
