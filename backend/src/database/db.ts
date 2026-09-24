import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import { mongoConnection } from './connection';

// Resolve project root whether CWD is workspace root or backend/
function getProjectRootDir(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'data')) || fs.existsSync(path.join(cwd, 'frontend'))) {
    return cwd;
  }
  const parent = path.resolve(cwd, '..');
  if (fs.existsSync(path.join(parent, 'data')) || fs.existsSync(path.join(parent, 'frontend'))) {
    return parent;
  }
  return cwd;
}

const ROOT_DIR = getProjectRootDir();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'leox-db.json');

export interface DBState {
  admins: any[];
  bookings: any[];
  inquiries: any[];
  portfolio: any[];
  reels: any[];
  services: any[];
  packages: any[];
  testimonials: any[];
  gallery: any[];
  messages: any[];
  settings: any;
}

const defaultState: DBState = {
  admins: [],
  bookings: [],
  inquiries: [],
  portfolio: [],
  reels: [],
  services: [],
  packages: [],
  testimonials: [],
  gallery: [],
  messages: [],
  settings: null,
};

class DatabaseManager {
  private state: DBState = { ...defaultState };
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const uploadsDir = path.join(ROOT_DIR, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
      } else {
        this.state = { ...defaultState };
        this.save();
      }
      this.initialized = true;
    } catch (err) {
      console.error('[DB] Failed to initialize file database, using in-memory state:', err);
      this.state = { ...defaultState };
      this.initialized = true;
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error persisting database state:', err);
    }
  }

  public getState(): DBState {
    return this.state;
  }
}

export const dbManager = new DatabaseManager();

/**
 * Builds a query filter for matching an entity by string id or MongoDB ObjectId
 */
function buildIdQuery(id: string): any {
  const orList: any[] = [{ id }, { _id: id }];
  if (typeof id === 'string' && ObjectId.isValid(id) && id.length === 24) {
    try {
      orList.push({ _id: new ObjectId(id) });
    } catch {}
  }
  return { $or: orList };
}

// Generic Document Model helper providing unified MongoDB Atlas + Fallback Local async API
export class Collection<T extends { id?: string; _id?: string; createdAt?: string; updatedAt?: string }> {
  private key: keyof DBState;

  constructor(key: keyof DBState) {
    this.key = key;
  }

  private normalizeDoc(doc: any): T {
    if (!doc) return doc;
    const stringId = doc.id || (doc._id ? doc._id.toString() : '');
    const mongoIdStr = doc._id ? doc._id.toString() : (doc.id || '');
    return {
      ...doc,
      id: stringId,
      _id: mongoIdStr,
    } as T;
  }

  private getItems(): T[] {
    const state = dbManager.getState();
    if (!Array.isArray(state[this.key])) {
      (state[this.key] as any) = [];
    }
    return state[this.key] as unknown as T[];
  }

  async find(filter?: Partial<Record<string, any>>): Promise<T[]> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        let mongoFilter: any = {};
        if (filter && Object.keys(filter).length > 0) {
          mongoFilter = { ...filter };
          if (mongoFilter.id) {
            const idVal = mongoFilter.id;
            delete mongoFilter.id;
            mongoFilter.$or = buildIdQuery(idVal).$or;
          }
        }
        const docs = await col.find(mongoFilter).sort({ createdAt: -1 }).toArray();
        return docs.map(d => this.normalizeDoc(d));
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB find error, falling back to local:`, err);
      }
    }

    // Local JSON fallback
    const items = this.getItems();
    if (!filter || Object.keys(filter).length === 0) {
      return [...items];
    }
    return items.filter((item: any) => {
      for (const [k, v] of Object.entries(filter)) {
        if (v === undefined) continue;
        if (item[k] !== v && item[`_${k}`] !== v) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter: Partial<Record<string, any>>): Promise<T | null> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        let mongoFilter: any = {};
        if (filter && Object.keys(filter).length > 0) {
          mongoFilter = { ...filter };
          if (mongoFilter.id) {
            const idVal = mongoFilter.id;
            delete mongoFilter.id;
            mongoFilter.$or = buildIdQuery(idVal).$or;
          }
        }
        const doc = await col.findOne(mongoFilter);
        return doc ? this.normalizeDoc(doc) : null;
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB findOne error, falling back to local:`, err);
      }
    }

    const list = await this.find(filter);
    return list.length > 0 ? list[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        const doc = await col.findOne(buildIdQuery(id));
        return doc ? this.normalizeDoc(doc) : null;
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB findById error, falling back to local:`, err);
      }
    }

    const items = this.getItems();
    const found = items.find((item: any) => item.id === id || item._id === id);
    return found ? this.normalizeDoc(found) : null;
  }

  async create(data: Partial<T>): Promise<T> {
    const now = new Date().toISOString();
    const id = (data as any).id || (data as any)._id || 'lx_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    
    const docToInsert = {
      ...data,
      id,
      _id: id,
      createdAt: (data as any).createdAt || now,
      updatedAt: now,
    };

    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        await col.insertOne(docToInsert as any);
        const items = this.getItems();
        items.unshift(docToInsert as unknown as T);
        dbManager.save();
        return this.normalizeDoc(docToInsert);
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB create error, falling back to local:`, err);
      }
    }

    // Local JSON fallback
    const items = this.getItems();
    const newItem = { ...docToInsert } as unknown as T;
    items.unshift(newItem);
    dbManager.save();
    return newItem;
  }

  async findByIdAndUpdate(id: string, update: Partial<T>): Promise<T | null> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        const query = buildIdQuery(id);
        const updateData = {
          ...update,
          updatedAt: new Date().toISOString(),
        };
        await col.updateOne(query, { $set: updateData });
        const updated = await col.findOne(query);
        // Sync local
        const items = this.getItems();
        const index = items.findIndex((item: any) => item.id === id || item._id === id);
        if (index !== -1 && updated) {
          items[index] = this.normalizeDoc(updated);
          dbManager.save();
        }
        return updated ? this.normalizeDoc(updated) : null;
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB findByIdAndUpdate error, falling back to local:`, err);
      }
    }

    // Local JSON fallback
    const items = this.getItems();
    const index = items.findIndex((item: any) => item.id === id || item._id === id);
    if (index === -1) return null;

    const existing = items[index];
    const updated = {
      ...existing,
      ...update,
      id: existing.id || id,
      _id: existing._id || id,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    dbManager.save();
    return updated;
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        const query = buildIdQuery(id);
        const existing = await col.findOne(query);
        if (existing) {
          await col.deleteOne(query);
          return this.normalizeDoc(existing);
        }
        return null;
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB findByIdAndDelete error, falling back to local:`, err);
      }
    }

    // Local JSON fallback
    const items = this.getItems();
    const index = items.findIndex((item: any) => item.id === id || item._id === id);
    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    dbManager.save();
    return deleted;
  }

  async countDocuments(filter?: Partial<Record<string, any>>): Promise<number> {
    const mongoDb = mongoConnection.getDb();
    if (mongoDb) {
      try {
        const col = mongoDb.collection(this.key);
        let mongoFilter: any = {};
        if (filter && Object.keys(filter).length > 0) {
          mongoFilter = { ...filter };
          if (mongoFilter.id) {
            const idVal = mongoFilter.id;
            delete mongoFilter.id;
            mongoFilter.$or = buildIdQuery(idVal).$or;
          }
        }
        return await col.countDocuments(mongoFilter);
      } catch (err) {
        console.error(`[Collection:${this.key}] MongoDB countDocuments error, falling back to local:`, err);
      }
    }

    const matches = await this.find(filter);
    return matches.length;
  }
}

export { ROOT_DIR, DATA_DIR, DB_FILE };

