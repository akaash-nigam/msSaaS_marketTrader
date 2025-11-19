#!/bin/bash

echo "🚀 Starting AI Trading Platform Dashboard..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✨ Starting Next.js development server on port 3006..."
echo "🌐 Open http://localhost:3006 in your browser"
echo ""

npm run dev
