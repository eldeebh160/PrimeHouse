import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'inventory.db');
const db = new Database(dbPath);

console.log('Initializing advanced database schema at ' + dbPath);

npm run devicePixelRati
const schema = `
  -- DROP old tables for fresh start
  DROP TABLE IF EXISTS product_variants;
  DROP TABLE IF EXISTS product_images;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS discounts;
  DROP TABLE IF EXISTS appointments;

  -- Categories
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT
  );

  -- Products
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    features TEXT, -- Added features field
    price REAL NOT NULL,
    sale_price REAL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT 0, -- Added is_featured field
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  -- Product Multiple Images
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  -- Product Variants
  CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    price REAL, -- Added price field for variants
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  -- Appointments
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_date TEXT,
    interest TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Discounts
  CREATE TABLE IF NOT EXISTS discounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      description TEXT,
      discount_percent REAL,
      active BOOLEAN DEFAULT 1
  );
`;

db.exec(schema);

console.log('Database schema reset. All data cleared.');

// Optional: Seed default categories if you want them back
const seedCategories = true;
if (seedCategories) {
  const categories = ['Massage Chairs', 'Living Room', 'Seating', 'Tables', 'Accessories'];
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
  categories.forEach(cat => {
    insertCategory.run(cat, cat.toLowerCase().replace(/ /g, '-'));
  });
  console.log('Default categories seeded.');
}

console.log('Database initialization done.');
