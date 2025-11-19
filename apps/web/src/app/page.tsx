'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, TrendingUp, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const examplePrompts = [
  "Analyze NVDA stock for a swing trade",
  "What's the market doing today?",
  "Explain RSI indicator to me",
  "Generate a momentum trading strategy",
  "Compare AAPL vs MSFT for long-term"
]

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message?: string) => {
    const content = message || input
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/v1/chat/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.data.message
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Failed to connect to AI service. Make sure the AI service is running on http://localhost:5000'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 rounded-full glass mb-6">
            <Sparkles className="h-12 w-12 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">AI Trading Assistant</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            From Idea to Trade in 60 Seconds
          </p>

          {/* Example Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto mb-12">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="p-4 rounded-lg glass hover:bg-white/10 transition-all duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-400 mt-0.5 group-hover:text-purple-300 transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {prompt}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="mb-32">
        <AnimatePresence mode="popLayout">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 ${message.role === 'user' ? 'flex justify-end' : ''}`}
            >
              <div
                className={`max-w-3xl ${
                  message.role === 'user'
                    ? 'gradient-primary p-4 rounded-2xl text-white'
                    : 'glass p-6 rounded-2xl'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-gray-100">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-6 rounded-2xl max-w-3xl"
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-gray-400 text-sm">AI is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-dark border-t border-white/10 backdrop-blur-xl">
        <div className="container mx-auto max-w-5xl">
          <div className="glass rounded-2xl p-2 glow">
            <div className="flex items-end space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about stocks, markets, or trading strategies..."
                className="flex-1 bg-transparent resize-none outline-none text-gray-100 placeholder-gray-500 px-4 py-3 max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Service Status */}
          <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Make sure AI service is running on localhost:5000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
