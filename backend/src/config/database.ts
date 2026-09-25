import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { ENV } from './env';

export type DBConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'fallback';

export interface DBHealthInfo {
  status: 'connected' | 'disconnected';
  databaseType: 'mongodb_atlas' | 'local_fallback';
  databaseName?: string;
  server: 'ok';
}

class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private status: DBConnectionStatus = 'disconnected';
  private connectingPromise: Promise<Db | null> | null = null;

  /**
   * Connect to MongoDB Atlas.
   * Strictly avoids logging raw credentials or connection URIs.
   */
  public async connect(): Promise<Db | null> {
    // Return active connection if already connected
    if (this.status === 'connected' && this.db && this.client) {
      return this.db;
    }

    // In-flight connection reuse
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    const rawUri = (process.env.MONGO_URI || ENV.MONGO_URI || '').trim();

    // Check if MONGO_URI is detected in environment
    if (!rawUri) {
      this.status = 'fallback';
      console.log('[Database] MONGO_URI detected: NO');
      console.log('[Database] MONGO_URI is missing from the backend secrets/environment. Please add the MongoDB Atlas URI as the backend secret named MONGO_URI.');
      console.log('[Database] Running in local persistent storage fallback mode (/data/leox-db.json).');
      return null;
    }

    console.log('[Database] MONGO_URI detected: YES');
    console.log('[Database] Connecting to MongoDB Atlas...');
    this.status = 'connecting';

    this.connectingPromise = (async () => {
      try {
        const clientOptions = {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          },
          serverSelectionTimeoutMS: 8000,
          connectTimeoutMS: 10000,
          maxPoolSize: 10,
          minPoolSize: 1,
        };

        const client = new MongoClient(rawUri, clientOptions);
        await client.connect();

        // Verify connection with admin ping
        await client.db('admin').command({ ping: 1 });

        const dbName = (process.env.MONGO_DB_NAME || ENV.MONGO_DB_NAME || 'leox').trim();
        const db = client.db(dbName);

        this.client = client;
        this.db = db;
        this.status = 'connected';

        console.log('[Database] MongoDB Atlas connected successfully.');
        return db;
      } catch (err) {
        this.status = 'disconnected';
        console.error('[Database] MongoDB connection failed.');
        console.log('[Database] Running in local persistent storage fallback mode (/data/leox-db.json).');
        return null;
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  public isConnected(): boolean {
    return this.status === 'connected' && this.db !== null;
  }

  public getDb(): Db | null {
    return this.db;
  }

  public getStatus(): DBConnectionStatus {
    return this.status;
  }

  public getHealth(): { success: boolean; server: 'ok'; database: 'connected' | 'disconnected'; databaseType: 'mongodb_atlas' | 'local_fallback' } {
    const connected = this.isConnected();
    return {
      success: connected,
      server: 'ok',
      database: connected ? 'connected' : 'disconnected',
      databaseType: connected ? 'mongodb_atlas' : 'local_fallback',
    };
  }

  public async close(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
      } catch {
        // silent close
      } finally {
        this.client = null;
        this.db = null;
        this.status = 'disconnected';
      }
    }
  }
}

export const mongoConnection = new MongoDBConnection();
export default mongoConnection;

// Clean shutdown listeners
process.on('SIGINT', async () => {
  await mongoConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoConnection.close();
  process.exit(0);
});
