'use client'

import { useState } from 'react'
import { Star, Plus, TrendingUp, TrendingDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPercent } from '@/lib/utils'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
}

// Mock data - In production, this would come from a real API
const mockStocks: Stock[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 495.50, change: 12.30, changePct: 2.55 },
  { symbol: 'AAPL', name: 'Apple Inc', price: 178.25, change: -2.15, changePct: -1.19 },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 242.80, change: 8.90, changePct: 3.80 },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.90, change: 5.20, changePct: 1.39 },
]

export default function WatchlistPage() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks)
  const [newSymbol, setNewSymbol] = useState('')

  const addStock = () => {
    if (!newSymbol.trim()) return
    // In production, fetch stock data from API
    const mockStock: Stock = {
      symbol: newSymbol.toUpperCase(),
      name: 'Company Name',
      price: 100.00,
      change: 0,
      changePct: 0
    }
    setStocks([...stocks, mockStock])
    setNewSymbol('')
  }

  const removeStock = (symbol: string) => {
    setStocks(stocks.filter(s => s.symbol !== symbol))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-4 rounded-full glass mb-6">
          <Star className="h-12 w-12 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Watchlist</span>
        </h1>
        <p className="text-xl text-gray-400">
          Track your favorite stocks
        </p>
      </motion.div>

      {/* Add Stock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && addStock()}
            placeholder="Add symbol (e.g., NVDA)"
            className="flex-1 bg-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          <button
            onClick={addStock}
            disabled={!newSymbol.trim()}
            className="px-6 py-3 rounded-xl gradient-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
      </motion.div>

      {/* Stocks Grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                    <p className="text-sm text-gray-400">{stock.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      stock.changePct >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.changePct >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {formatPercent(stock.changePct)}
                      </span>
                      <span className="text-sm">
                        ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeStock(stock.symbol)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {stocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Your watchlist is empty</p>
          <p className="text-gray-500 text-sm mt-2">Add stocks to start tracking</p>
        </motion.div>
      )}
    </div>
  )
}
