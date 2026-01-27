const Database = require('better-sqlite3');
const db = new Database('inventory.db');

try {
    db.prepare('ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id)').run();
    console.log('Successfully added parent_id column');
} catch (e) {
    if (e.message.includes('duplicate column name')) {
        console.log('Column already exists');
    } else {
        console.error('Migration failed:', e.message);
    }
}
