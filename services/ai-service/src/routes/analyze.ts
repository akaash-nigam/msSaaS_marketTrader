import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { analyzeStock, generateStrategy, explainConcept } from '../services/claude.service';

const AnalyzeRequestSchema = z.object({
  symbol: z.string().min(1).max(10),
  userContext: z.object({
    tradingStyle: z.string().optional(),
    riskTolerance: z.string().optional(),
    experience: z.string().optional()
  }).optional()
});

const GenerateStrategySchema = z.object({
  description: z.string().min(10)
});

const ExplainConceptSchema = z.object({
  concept: z.string().min(1)
});

export async function analyzeRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/analyze/:symbol
   * Analyze a stock with Claude AI
   */
  fastify.post<{
    Params: { symbol: string };
    Body: { userContext?: any };
  }>('/analyze/:symbol', async (request, reply) => {
    try {
      const { symbol } = request.params;
      const { userContext } = request.body || {};

      // Validate input
      const validated = AnalyzeRequestSchema.parse({
        symbol: symbol.toUpperCase(),
        userContext
      });

      fastify.log.info(`Analyzing ${validated.symbol} for user`);

      const analysis = await analyzeStock(validated);

      return {
        success: true,
        data: {
          symbol: validated.symbol,
          analysis,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to analyze stock'
      });
    }
  });

  /**
   * POST /api/v1/generate-strategy
   * Generate a trading strategy from natural language
   */
  fastify.post<{
    Body: { description: string };
  }>('/generate-strategy', async (request, reply) => {
    try {
      const { description } = request.body;

      // Validate input
      const validated = GenerateStrategySchema.parse({ description });

      fastify.log.info(`Generating strategy: ${description}`);

      const strategy = await generateStrategy(validated.description);

      return {
        success: true,
        data: strategy
      };
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to generate strategy'
      });
    }
  });

  /**
   * POST /api/v1/explain
   * Explain a trading concept
   */
  fastify.post<{
    Body: { concept: string };
  }>('/explain', async (request, reply) => {
    try {
      const { concept } = request.body;

      // Validate input
      const validated = ExplainConceptSchema.parse({ concept });

      fastify.log.info(`Explaining concept: ${concept}`);

      const explanation = await explainConcept(validated.concept);

      return {
        success: true,
        data: {
          concept: validated.concept,
          explanation,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to explain concept'
      });
    }
  });
}
