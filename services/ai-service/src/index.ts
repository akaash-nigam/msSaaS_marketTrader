import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { analyzeRoutes } from './routes/analyze';
import { chatRoutes } from './routes/chat';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    // Register CORS
    await server.register(cors, {
      origin: true, // Allow all origins in development
      credentials: true
    });

    // Health check
    server.get('/health', async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'ai-service'
      };
    });

    // Register routes
    await server.register(analyzeRoutes, { prefix: '/api/v1' });
    await server.register(chatRoutes, { prefix: '/api/v1' });

    // Start server
    await server.listen({ port: PORT, host: '0.0.0.0' });
    server.log.info(`🚀 AI Service running on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
