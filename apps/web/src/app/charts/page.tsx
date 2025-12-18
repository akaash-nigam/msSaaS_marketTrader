'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, Calendar, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

const popularStocks = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD']

const timeframes = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' },
]

// Generate sample OHLC data for demonstration
const generateSampleData = (symbol: string, days: number = 30) => {
  const data = []
  const now = new Date()
  let basePrice = Math.random() * 100 + 50 // Random price between 50-150

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic OHLC data
    const open = basePrice
    const change = (Math.random() - 0.5) * 10
    const high = open + Math.abs(change) * Math.random()
    const low = open - Math.abs(change) * Math.random()
    const close = open + change

    data.push({
      time: date.getTime() / 1000,
      open,
      high,
      low,
      close,
    })

    basePrice = close
  }

  return data
}

export default function ChartsPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState('1m')
  const [isLoading, setIsLoading] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current) return

    setIsLoading(true)

    // Simulate loading chart data
    setTimeout(() => {
      const days = timeframe === '1d' ? 1 : timeframe === '1w' ? 7 : timeframe === '1m' ? 30 : timeframe === '3m' ? 90 : timeframe === '1y' ? 365 : 1825
      const data = generateSampleData(symbol, days)
      seriesRef.current?.setData(data as any)
      chartRef.current?.timeScale().fitContent()
      setIsLoading(false)
    }, 500)
  }, [symbol, timeframe])

  const currentPrice = seriesRef.current ? 127.45 : 0
  const priceChange = 2.34
  const priceChangePercent = 1.87

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Live Charts</span>
            </h1>
            <p className="text-xl text-gray-400">
              Real-time market data and technical analysis
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        {/* Search and Quick Select */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL, NVDA)"
                className="w-full bg-white/5 rounded-xl pl-12 pr-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Popular Stocks */}
          <div className="flex flex-wrap gap-2 mt-4">
            {popularStocks.map((stock) => (
              <button
                key={stock}
                onClick={() => setSymbol(stock)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  symbol === stock
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {stock}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        {/* Stock Info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{symbol}</h2>
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </span>
              <span
                className={`text-xl font-semibold ${
                  priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (
                {priceChangePercent >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex rounded-lg bg-white/5 p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === tf.value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
        </div>
      </motion.div>

      {/* Market Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Open', value: '$125.23' },
          { label: 'High', value: '$128.92' },
          { label: 'Low', value: '$124.87' },
          { label: 'Volume', value: '45.2M' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 glass rounded-xl p-4 border border-blue-500/20"
      >
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Demo Data</p>
            <p>
              This chart displays simulated data for demonstration purposes. In production,
              this would connect to a real market data API to show live prices and historical data.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
