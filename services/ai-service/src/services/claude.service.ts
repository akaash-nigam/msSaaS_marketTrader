import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const MODEL = 'claude-sonnet-4-5-20250929';

export interface AnalysisRequest {
  symbol: string;
  userContext?: {
    tradingStyle?: string;
    riskTolerance?: string;
    experience?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Analyze a stock using Claude with multimodal context
 */
export async function analyzeStock(request: AnalysisRequest): Promise<string> {
  const { symbol, userContext } = request;

  // In a real implementation, we would fetch:
  // - Current quote (price, volume, change)
  // - Recent news
  // - Social sentiment
  // - Technical indicators
  // For now, we'll use a comprehensive prompt

  const prompt = `Analyze ${symbol} stock for a trader.

User Profile:
- Trading Style: ${userContext?.tradingStyle || 'Swing trading'}
- Risk Tolerance: ${userContext?.riskTolerance || 'Moderate'}
- Experience: ${userContext?.experience || 'Intermediate'}

Please provide:
1. **Technical Analysis** (key levels, indicators, chart patterns)
2. **Fundamental Outlook** (brief assessment)
3. **Market Sentiment** (what's the overall mood?)
4. **Trade Idea** (entry, stop loss, target if there's an opportunity)
5. **Risk Assessment** (what could go wrong?)

Format your response in a clear, actionable way. Use confidence scores where appropriate (0-100%).`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Streaming chat interface with Claude
 */
export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  const systemPrompt = `You are an AI trading assistant for an advanced trading platform. Your role is to help traders with:

- Market analysis (technical, fundamental, sentiment)
- Strategy development and backtesting ideas
- Risk management advice
- Educational content about trading concepts
- Answering questions about stocks, markets, and economics

Guidelines:
- Be concise but thorough
- Use data and reasoning to support your analysis
- Always mention risks and uncertainties
- Never guarantee profits or promise specific outcomes
- Provide confidence scores when making predictions (0-100%)
- Format responses clearly with sections/bullets
- Be helpful, professional, and encouraging

Remember: You're a co-pilot, not an autopilot. Empower the trader to make informed decisions.`;

  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  } catch (error) {
    console.error('Error streaming from Claude:', error);
    throw error;
  }
}

/**
 * Generate a trading strategy from a natural language description
 */
export async function generateStrategy(description: string): Promise<{
  strategyName: string;
  entry Conditions: string;
  exitConditions: string;
  riskManagement: string;
  pythonCode: string;
}> {
  const prompt = `Generate a trading strategy based on this description:

"${description}"

Provide:
1. Strategy Name (catchy, descriptive)
2. Entry Conditions (specific, measurable)
3. Exit Conditions (profit target and stop loss)
4. Risk Management (position sizing, max drawdown)
5. Python Code (using pandas and numpy for backtesting)

Format as JSON with these keys: strategyName, entryConditions, exitConditions, riskManagement, pythonCode

The Python code should be production-ready and well-commented.`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      // Try to parse JSON from the response
      // Claude might wrap it in markdown code blocks
      const text = content.text;
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                       text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }

      // Fallback: return raw text if not JSON
      return {
        strategyName: 'Generated Strategy',
        entryConditions: text,
        exitConditions: '',
        riskManagement: '',
        pythonCode: ''
      };
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error generating strategy:', error);
    throw error;
  }
}

/**
 * Explain a trading concept in simple terms
 */
export async function explainConcept(concept: string): Promise<string> {
  const prompt = `Explain "${concept}" in the context of stock trading.

Provide:
1. **Simple Definition** (one sentence, for beginners)
2. **How It Works** (practical explanation)
3. **Example** (real-world scenario)
4. **Why It Matters** (why traders care about it)
5. **Common Mistakes** (what to avoid)

Keep it conversational and easy to understand.`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error explaining concept:', error);
    throw error;
  }
}
