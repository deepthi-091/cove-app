import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('cove.db');
  await _initSchema(_db);
  return _db;
}

async function _initSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS cached_products (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      cached_at INTEGER NOT NULL
    )
  `);
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      image TEXT,
      color TEXT,
      size TEXT
    )
  `);
}

const PRODUCT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const sqliteProducts = {
  async saveAll(products: any[]): Promise<void> {
    const db = await getDb();
    const now = Date.now();
    await db.runAsync('DELETE FROM cached_products');
    for (const p of products) {
      await db.runAsync(
        'INSERT INTO cached_products (id, data, cached_at) VALUES (?, ?, ?)',
        [p.id, JSON.stringify(p), now]
      );
    }
  },

  async getAll(): Promise<any[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ data: string; cached_at: number }>(
      'SELECT data, cached_at FROM cached_products'
    );
    const now = Date.now();
    const fresh = rows.filter(r => now - r.cached_at < PRODUCT_CACHE_TTL);
    return fresh.map(r => JSON.parse(r.data));
  },

  async isFresh(): Promise<boolean> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ cached_at: number }>(
      'SELECT cached_at FROM cached_products LIMIT 1'
    );
    if (!row) return false;
    return Date.now() - row.cached_at < PRODUCT_CACHE_TTL;
  },

  async clear(): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM cached_products');
  },
};

export const sqliteCart = {
  async saveAll(items: any[]): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM cart_items');
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO cart_items (id, name, price, quantity, image, color, size) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.name, item.price, item.quantity, item.image || null, item.color || null, item.size || null]
      );
    }
  },

  async getAll(): Promise<any[]> {
    const db = await getDb();
    return db.getAllAsync<any>('SELECT * FROM cart_items');
  },

  async clear(): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM cart_items');
  },
};
