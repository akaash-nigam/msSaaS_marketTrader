'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, BarChart3, Bot, Star, Zap, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Analysis',
    description: 'Chat with Claude 4.5 Sonnet to get instant market insights and trading ideas',
  },
  {
    icon: TrendingUp,
    title: 'Smart Stock Analysis',
    description: 'Deep dive into any stock with AI-generated analysis tailored to your strategy',
  },
  {
    icon: BarChart3,
    title: 'Professional Charts',
    description: 'Interactive candlestick charts with multiple timeframes and technical indicators',
  },
  {
    icon: Star,
    title: 'Custom Watchlists',
    description: 'Track your favorite stocks and get real-time updates on price movements',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'From idea to analysis in under 60 seconds with our optimized AI pipeline',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Enterprise-grade security',
  },
]

const stats = [
  { value: '<60s', label: 'Idea to Trade' },
  { value: '24/7', label: 'AI Assistant' },
  { value: '100%', label: 'Free to Start' },
  { value: '∞', label: 'Possibilities' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Powered by Claude 4.5 Sonnet</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              From <span className="text-gradient">Idea to Trade</span>
              <br />
              in 60 Seconds
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              The first AI-native trading platform. Analyze markets, generate strategies,
              and make smarter trades with the power of Claude AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="group px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 glow"
              >
                <span>Start Trading Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/charts"
                className="px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all duration-200"
              >
                View Live Charts
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Trade Smarter</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for traders, by traders. Powered by the world's most advanced AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="inline-block p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors mb-6">
                  <feature.icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to better trading decisions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Ask Your Question',
                description: 'Chat with our AI about any stock, strategy, or market condition',
              },
              {
                step: '02',
                title: 'Get AI Analysis',
                description: 'Receive instant, comprehensive analysis powered by Claude 4.5',
              },
              {
                step: '03',
                title: 'Make Your Trade',
                description: 'Execute with confidence backed by AI-driven insights',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-start gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-lg text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl" />
            </div>

            <Clock className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Trade <span className="text-gradient">Smarter</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of traders using AI to make better investment decisions.
              Start free, no credit card required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 glow group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-gradient">TradeAI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 TradeAI. Powered by Claude 4.5 Sonnet. Built for traders.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
