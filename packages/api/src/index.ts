import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { DependencyContainer } from './DependencyContainer';
import { DatabaseConfig } from './infrastructure/database/DatabaseConfig';
import { swaggerSpec } from './infrastructure/swagger/swaggerConfig';

class VelocityZonesApiServer {
  private readonly app: Express;
  private readonly port: number;
  private readonly dependencyContainer: DependencyContainer;
  private readonly basePath: string;

  constructor(port: number = 3001) {
    this.app = express();
    this.port = port;
    this.dependencyContainer = new DependencyContainer();
    // Vercel serverless functions are mounted at "/api", and the
    // path forwarded to the handler excludes that prefix. Use
    // an empty base on Vercel and "/api" locally.
    this.basePath = process.env.VERCEL ? '' : '/api';

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Normalize Vercel catch-all routing to standard paths
    if (process.env.VERCEL) {
      this.app.use((req, _res, next) => {
        const queryParams = req.query as Record<string, unknown>;
        const catchAll = (queryParams?.path ?? queryParams?.['...path']) as
          | string
          | string[]
          | undefined;

        if (catchAll) {
          const segments = Array.isArray(catchAll)
            ? catchAll
            : catchAll.split('/');
          const normalizedPath = `/${segments
            .filter(Boolean)
            .map((segment) => decodeURIComponent(segment))
            .join('/')}`;

          delete queryParams.path;
          delete queryParams['...path'];

          const remainingEntries = Object.entries(queryParams).filter(
            ([key, value]) =>
              value !== undefined &&
              value !== null &&
              key !== 'path' &&
              key !== '...path'
          );

          const searchParams = new URLSearchParams();
          for (const [key, value] of remainingEntries) {
            if (Array.isArray(value)) {
              for (const item of value) {
                searchParams.append(key, String(item));
              }
            } else {
              searchParams.append(key, String(value));
            }
          }

          const search = searchParams.toString();
          req.url = `${normalizedPath}${search ? `?${search}` : ''}`;
          req.originalUrl = req.url;
        }

        next();
      });
    }

    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      })
    );

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private configureRoutes(): void {
    const prefixes = process.env.VERCEL ? ['', '/api'] : ['/api'];

    // Health check(s)
    for (const prefix of prefixes) {
      this.app.get(`${prefix}/health`, (req, res) => {
        res.status(200).json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
        });
      });
    }

    // Swagger docs under both prefixes
    for (const prefix of prefixes) {
      this.app.use(
        `${prefix}/docs`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          explorer: true,
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'Velocity Zones API Documentation',
        })
      );

      this.app.get(`${prefix}/docs.json`, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
      });
    }

    // API routes under both prefixes
    const httpRoutes = this.dependencyContainer.getHttpRoutes();
    const repController = this.dependencyContainer.getRepController();
    const velocityZoneController =
      this.dependencyContainer.getVelocityZoneController();
    const apiRouter = httpRoutes.configureRoutes(
      repController,
      velocityZoneController
    );
    for (const prefix of prefixes) {
      this.app.use(`${prefix}/v1`, apiRouter);
    }

    // Catch-all 404
    this.app.use('*', (req, res) => {
      res.status(404).json({
        message: 'Resource not found',
        code: 'NOT_FOUND',
        statusCode: 404,
        path: req.originalUrl,
      });
    });
  }

  private configureErrorHandling(): void {
    // Global error handler
    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: express.NextFunction
      ) => {
        console.error('Global error handler:', error);

        // Don't send error details in production
        const isDevelopment = process.env.NODE_ENV === 'development';

        res.status(500).json({
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          ...(isDevelopment && { details: error.message, stack: error.stack }),
        });
      }
    );
  }

  public async startAsync(): Promise<void> {
    try {
      // Initialize database before starting server
      console.log('🗄️ Initializing database...');
      await DatabaseConfig.initialize();
      console.log('✅ Database initialized successfully');

      return new Promise((resolve, reject) => {
        try {
          const server = this.app.listen(this.port, () => {
            console.log(`🚀 Velocity Zones API Server started successfully!`);
            console.log(`📍 Server running at: http://localhost:${this.port}`);
            console.log(
              `🏥 Health check: http://localhost:${this.port}/health`
            );
            console.log(
              `📚 API base URL: http://localhost:${this.port}/api/v1`
            );
            console.log(`📖 API docs: http://localhost:${this.port}/api/docs`);
            console.log(
              `🌍 Environment: ${process.env.NODE_ENV || 'development'}`
            );
            resolve();
          });

          server.on('error', (error) => {
            console.error('❌ Server startup error:', error);
            reject(error);
          });

          // Graceful shutdown
          process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM received, shutting down gracefully...');
            server.close(() => {
              console.log('✅ Server closed successfully');
              process.exit(0);
            });
          });

          process.on('SIGINT', () => {
            console.log('🛑 SIGINT received, shutting down gracefully...');
            server.close(() => {
              console.log('✅ Server closed successfully');
              process.exit(0);
            });
          });
        } catch (error) {
          console.error('❌ Server configuration error:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }

  // Method to expose the Express app for serverless deployment
  public getApp(): express.Application {
    return this.app;
  }

  // Initialize for serverless without starting the server
  public async initializeForServerless(): Promise<void> {
    try {
      console.log('🗄️ Initializing database for serverless...');
      await DatabaseConfig.initialize();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }
}

// For Vercel serverless functions
/* eslint-disable @typescript-eslint/no-explicit-any */
let app: any = null;

async function getApp() {
  if (!app) {
    const server = new VelocityZonesApiServer();
    await server.initializeForServerless();
    app = server.getApp();
  }
  return app;
}

// Vercel serverless function handler
export async function handler(req: any, res: any) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error('Error initializing app:', error);
    if (res && res.status) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Default export for standalone server
const server = new VelocityZonesApiServer();

// Auto-start for development (only if not in production and not in Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  server.startAsync().catch((error) => {
    console.error('❌ Failed to start Velocity Zones API:', error);
    process.exit(1);
  });
}

export { VelocityZonesApiServer };
export default server;
