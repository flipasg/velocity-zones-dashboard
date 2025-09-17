import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { DependencyContainer } from './DependencyContainer';
import { DatabaseConfig } from './infrastructure/database/DatabaseConfig';
import { swaggerSpec } from './infrastructure/swagger/swaggerConfig';

const app = express();
const dependencyContainer = new DependencyContainer();

// Normalize Vercel catch-all query (?path=...)
app.use((req, _res, next) => {
  const query = req.query as Record<string, unknown> | undefined;
  if (!query) {
    next();
    return;
  }

  const raw = (query.path ?? (query as Record<string, unknown>)['...path']) as
    | string
    | string[]
    | undefined;

  if (!raw) {
    next();
    return;
  }

  const segments = Array.isArray(raw) ? raw : raw.split('/');
  const normalizedPath = `/${segments
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join('/')}`;

  delete (query as Record<string, unknown>)['path'];
  delete (query as Record<string, unknown>)['...path'];

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const entry of value) {
        searchParams.append(key, String(entry));
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const search = searchParams.toString();
  req.url = `${normalizedPath}${search ? `?${search}` : ''}`;
  req.originalUrl = req.url;

  next();
});

// Ensure the in-memory database is initialised for the first request
let dbInitialised = false;
app.use(async (_req, _res, next) => {
  if (dbInitialised) {
    next();
    return;
  }

  try {
    await DatabaseConfig.initialize();
    dbInitialised = true;
    next();
  } catch (error) {
    next(error);
  }
});

// Core middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logging for visibility
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

app.get('/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

// Domain routes
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
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
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

// Export Express app for Vercel
export default app;

// Local development server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  DatabaseConfig.initialize()
    .then(() => {
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
