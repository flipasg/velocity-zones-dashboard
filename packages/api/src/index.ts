import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { DependencyContainer } from './DependencyContainer';
import { DatabaseConfig } from './infrastructure/database/DatabaseConfig';
import { swaggerSpec } from './infrastructure/swagger/swaggerConfig';

// Create and configure Express app
function createApp() {
  const app = express();
  const dependencyContainer = new DependencyContainer();

  // Basic middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger docs
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );

  app.get('/docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  // API routes
  const httpRoutes = dependencyContainer.getHttpRoutes();
  const repController = dependencyContainer.getRepController();
  const velocityZoneController =
    dependencyContainer.getVelocityZoneController();
  const apiRouter = httpRoutes.configureRoutes(
    repController,
    velocityZoneController
  );

  app.use('/v1', apiRouter);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Resource not found',
      path: req.originalUrl,
    });
  });

  // Error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error('Error:', error);
      res.status(500).json({
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message,
        }),
      });
    }
  );

  return app;
}

// Cached app instance for serverless
let cachedApp: express.Application | null = null;
let dbInitialized = false;

async function getApp() {
  if (!dbInitialized) {
    await DatabaseConfig.initialize();
    dbInitialized = true;
  }

  if (!cachedApp) {
    cachedApp = createApp();
  }

  return cachedApp;
}

// Vercel serverless handler - this is what [...path].ts should import
export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Local development server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  DatabaseConfig.initialize()
    .then(() => {
      const app = createApp();
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📖 Docs at http://localhost:${PORT}/docs`);
      });
    })
    .catch((error) => {
      console.error('Failed to start:', error);
      process.exit(1);
    });
}
