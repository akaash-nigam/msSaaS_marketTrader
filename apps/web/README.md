# AI Trading Platform - Web App

Beautiful, modern web interface for the AI trading platform.

## Features

- **AI Chat Interface** - Conversational trading assistant powered by Claude 4.5
- **Stock Analysis** - Deep analysis of any stock with AI insights
- **Watchlist** - Track your favorite stocks
- **Modern UI** - Glassmorphism, dark mode, smooth animations
- **Responsive** - Works on desktop, tablet, and mobile

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Environment Variables

Create `.env.local`:

```bash
# AI Service URL
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5000
```

## Prerequisites

Make sure the AI service is running:

```bash
cd ../../services/ai-service
pnpm dev
```

The AI service should be running on `http://localhost:5000`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: React Query (TanStack Query)
- **Charts**: Lightweight Charts (TradingView)

## Pages

### 1. AI Chat (`/`)
- Conversational interface with Claude
- Example prompts for quick start
- Streaming responses (future)
- Message history

### 2. Stock Analysis (`/analyze`)
- Search any stock symbol
- AI-powered analysis
- Popular stocks quick access
- Technical + fundamental insights

### 3. Watchlist (`/watchlist`)
- Add/remove stocks
- Real-time price updates (future)
- Change percentage tracking
- Quick actions

### 4. Charts (`/charts`) - Coming Soon
- Interactive price charts
- Multiple timeframes
- Technical indicators
- Drawing tools

## Design System

### Colors

```css
/* Primary Gradient */
from-blue-500 via-purple-500 to-pink-500

/* Success */
text-green-400

/* Danger */
text-red-400

/* Glass Effect */
bg-white/10 backdrop-blur-xl border border-white/20
```

### Components

All components use:
- Glassmorphism effects
- Smooth transitions
- Dark theme optimized
- Responsive design

## Development

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # AI chat interface
│   ├── analyze/
│   │   └── page.tsx        # Stock analysis
│   ├── watchlist/
│   │   └── page.tsx        # Watchlist
│   └── globals.css         # Global styles
├── components/
│   └── navigation.tsx      # Main navigation
└── lib/
    └── utils.ts            # Utility functions
```

## API Integration

The app connects to the AI service at `localhost:5000`:

```typescript
// Example: Analyze stock
const response = await fetch('http://localhost:5000/api/v1/analyze/NVDA', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userContext: {
      tradingStyle: 'swing trading',
      riskTolerance: 'moderate'
    }
  })
})
```

## Next Steps

- [ ] Add real-time stock data (Polygon.io API)
- [ ] Implement interactive charts
- [ ] Add streaming for chat responses
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Strategy builder UI
- [ ] Mobile app (React Native)

## Troubleshooting

**AI service connection error:**
- Make sure the AI service is running on port 5000
- Check `services/ai-service/` is started with `pnpm dev`

**Styling not working:**
- Run `pnpm install` to ensure Tailwind is installed
- Check `tailwind.config.ts` is properly configured

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Screenshots

The app features:
- Animated gradient backgrounds
- Glassmorphism cards
- Smooth page transitions
- Beautiful loading states
- Responsive mobile layout

---

Built with ❤️ and Claude 4.5
