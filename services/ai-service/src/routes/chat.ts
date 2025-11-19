import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { streamChat, ChatMessage } from '../services/claude.service';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).min(1)
});

export async function chatRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/chat
   * Conversational interface with Claude (streaming)
   */
  fastify.post<{
    Body: { messages: ChatMessage[] };
  }>('/chat', async (request, reply) => {
    try {
      const { messages } = request.body;

      // Validate input
      const validated = ChatRequestSchema.parse({ messages });

      fastify.log.info(`Chat request with ${validated.messages.length} messages`);

      // Set up Server-Sent Events for streaming
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      // Stream the response
      for await (const chunk of streamChat(validated.messages)) {
        reply.raw.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      reply.raw.write('data: [DONE]\n\n');
      reply.raw.end();
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      // For streaming errors, we can't send JSON
      reply.raw.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      reply.raw.end();
    }
  });

  /**
   * POST /api/v1/chat/simple
   * Non-streaming chat endpoint (simpler for testing)
   */
  fastify.post<{
    Body: { message: string };
  }>('/chat/simple', async (request, reply) => {
    try {
      const { message } = request.body;

      if (!message || typeof message !== 'string') {
        return reply.code(400).send({
          success: false,
          error: 'Message is required'
        });
      }

      fastify.log.info(`Simple chat: ${message.substring(0, 50)}...`);

      let fullResponse = '';
      for await (const chunk of streamChat([{ role: 'user', content: message }])) {
        fullResponse += chunk;
      }

      return {
        success: true,
        data: {
          message: fullResponse,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to process chat'
      });
    }
  });
}
