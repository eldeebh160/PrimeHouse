const Database = require('better-sqlite3');
const db = new Database('inventory.db');

const table = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='product_images'").get();
console.log(table ? table.sql : 'Table product_images not found');

const columns = db.prepare("PRAGMA table_info(product_images)").all();
console.log(JSON.stringify(columns, null, 2));
