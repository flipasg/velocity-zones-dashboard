import fs from 'fs/promises';
import path from 'path';

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data');

function resolveDataDir(): string {
  if (process.env.API_DATA_DIR && process.env.API_DATA_DIR.trim().length > 0) {
    return process.env.API_DATA_DIR;
  }

  if (process.env.VERCEL) {
    return path.join('/tmp', 'velocity-zones-data');
  }

  return DEFAULT_DATA_DIR;
}

export interface DatabaseSchema {
  zones: {
    id: string;
    name: string;
    minVelocity: number;
    maxVelocity: number;
    color: string;
    description?: string;
  }[];
  reps: {
    id: string;
    exerciseId: string;
    velocity: number;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }[];
}

export class DatabaseConfig {
  private static dbPath: string | null = null;
  private static initialized = false;

  private static getDbPath(): string {
    if (!DatabaseConfig.dbPath) {
      DatabaseConfig.dbPath = path.join(resolveDataDir(), 'db.json');
    }
    return DatabaseConfig.dbPath;
  }

  private static async ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(DatabaseConfig.getDbPath());
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  public static async initialize(): Promise<void> {
    if (DatabaseConfig.initialized) return;

    await DatabaseConfig.ensureDataDirectory();

    try {
      await fs.access(DatabaseConfig.getDbPath());
    } catch {
      // File doesn't exist, create with default data
      const defaultData: DatabaseSchema = {
        zones: [
          {
            id: 'zone-strength',
            name: 'Strength',
            minVelocity: 0.0,
            maxVelocity: 0.3,
            color: '#ff4444',
            description: 'Heavy resistance training zone',
          },
          {
            id: 'zone-power',
            name: 'Power',
            minVelocity: 0.3,
            maxVelocity: 0.6,
            color: '#ffaa00',
            description: 'Power development zone',
          },
          {
            id: 'zone-speed-strength',
            name: 'Speed-Strength',
            minVelocity: 0.6,
            maxVelocity: 1.0,
            color: '#44ff44',
            description: 'Speed-strength development zone',
          },
          {
            id: 'zone-speed',
            name: 'Speed',
            minVelocity: 1.0,
            maxVelocity: 2.0,
            color: '#4444ff',
            description: 'Maximum speed zone',
          },
        ],
        reps: [],
      };

      await fs.writeFile(
        DatabaseConfig.getDbPath(),
        JSON.stringify(defaultData, null, 2)
      );
    }

    DatabaseConfig.initialized = true;
  }

  public static async readData(): Promise<DatabaseSchema> {
    await DatabaseConfig.initialize();
    const data = await fs.readFile(DatabaseConfig.getDbPath(), 'utf-8');
    return JSON.parse(data);
  }

  public static async writeData(data: DatabaseSchema): Promise<void> {
    await DatabaseConfig.ensureDataDirectory();
    await fs.writeFile(
      DatabaseConfig.getDbPath(),
      JSON.stringify(data, null, 2)
    );
  }
}
