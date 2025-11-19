# Quick Start - AI Trading Platform

## 🚀 Resume Development (2 Commands)

### Terminal 1: Start AI Service
```bash
cd /Users/aakashnigam/Desktop/better/marketTrader/services/ai-service
npm run dev
```

### Terminal 2: Start Dashboard
```bash
cd /Users/aakashnigam/Desktop/better/marketTrader/apps/web
rm -rf node_modules package-lock.json  # Only needed first time
npm install
npm run dev
```

**Then open**: http://localhost:3006

---

## 📚 Key Documents

1. **SESSION_SUMMARY.md** - What we built this session
2. **PROJECT_STATUS.md** - Current state & roadmap
3. **DASHBOARD_GUIDE.md** - How to use the UI
4. **ARCHITECTURE.md** - Technical design
5. **PRD.md** - All features planned

---

## 🔑 Required

- **Anthropic API Key**: Get from https://console.anthropic.com/
- Add to: `services/ai-service/.env`

---

## ✅ What's Working

- AI Service on port 5000
- Beautiful dark theme dashboard
- AI chat, stock analysis, watchlist

---

## ⚠️ Known Issue

**Fixed**: React version downgraded from 19 → 18 in package.json
**Action**: Run `npm install` in apps/web folder

---

## 🎯 Next Steps

1. Get dashboard running
2. Test AI chat
3. Add real-time stock data
4. Build trading service

---

**Project**: 15% complete to MVP
**Status**: Foundation solid, ready to build features
