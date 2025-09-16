import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { DependencyContainer } from './DependencyContainer';

class VelocityZonesApiServer {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly dependencyContainer: DependencyContainer;

  constructor(port: number = 3001) {
    this.app = express();
    this.port = port;
    this.dependencyContainer = new DependencyContainer();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
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
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
      });
    });

    // API routes
    const httpRoutes = this.dependencyContainer.getHttpRoutes();
    const repController = this.dependencyContainer.getRepController();
    const velocityZoneController =
      this.dependencyContainer.getVelocityZoneController();

    const apiRouter = httpRoutes.configureRoutes(
      repController,
      velocityZoneController
    );
    this.app.use('/api/v1', apiRouter);

    // Catch-all route for undefined endpoints
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
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.port, () => {
          console.log(`🚀 Velocity Zones API Server started successfully!`);
          console.log(`📍 Server running at: http://localhost:${this.port}`);
          console.log(`🏥 Health check: http://localhost:${this.port}/health`);
          console.log(`📚 API base URL: http://localhost:${this.port}/api/v1`);
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
        console.error('❌ Failed to start server:', error);
        reject(error);
      }
    });
  }
}

// Default export
const server = new VelocityZonesApiServer();

// Auto-start for development
server.startAsync().catch((error) => {
  console.error('❌ Failed to start Velocity Zones API:', error);
  process.exit(1);
});

export { VelocityZonesApiServer };
export default VelocityZonesApiServer;
