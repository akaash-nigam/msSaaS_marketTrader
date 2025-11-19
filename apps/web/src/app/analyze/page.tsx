'use client'

import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyzePage() {
  const [symbol, setSymbol] = useState('')
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeStock = async () => {
    if (!symbol.trim()) return

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch(`http://localhost:5000/api/v1/analyze/${symbol.toUpperCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext: {
            tradingStyle: 'swing trading',
            riskTolerance: 'moderate',
            experience: 'intermediate'
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.data.analysis)
      } else {
        throw new Error('Failed to analyze stock')
      }
    } catch (err) {
      setError('Failed to connect to AI service. Make sure it\'s running on localhost:5000')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeStock()
    }
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
          <TrendingUp className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Stock Analysis</span>
        </h1>
        <p className="text-xl text-gray-400">
          Get AI-powered insights for any stock
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 mb-8 glow"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter stock symbol (e.g., NVDA, AAPL, TSLA)"
              className="w-full bg-white/5 rounded-xl pl-12 pr-4 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={analyzeStock}
            disabled={!symbol.trim() || isLoading}
            className="px-8 py-4 rounded-xl gradient-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Popular Stocks */}
      {!analysis && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Popular Stocks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD'].map((s) => (
              <button
                key={s}
                onClick={() => { setSymbol(s); analyzeStock() }}
                className="glass rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">{s}</span>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-xl p-6 border border-red-500/20 mb-8"
        >
          <div className="flex items-start space-x-3">
            <TrendingDown className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Analysis Failed</h3>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{symbol} Analysis</h2>
              <p className="text-gray-400">AI-generated insights</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-100 leading-relaxed">
              {analysis}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => { setAnalysis(null); setSymbol('') }}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300"
            >
              Analyze Another Stock
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
