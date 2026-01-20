const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'inventory.db');
const db = new Database(dbPath);

const outputPath = path.join(process.cwd(), 'dump.sql');
const stream = fs.createWriteStream(outputPath, { flags: 'w' });

console.log('Starting database dump...');
stream.write('BEGIN TRANSACTION;\n');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

for (const table of tables) {
    const tableName = table.name;
    console.log(`Dumping table: ${tableName}`);

    // Get schema
    const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name = ?`).get(tableName);
    stream.write(`${schema.sql};\n`);

    // Get data
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();

    for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            // Escape single quotes for SQL
            return `'${String(val).replace(/'/g, "''")}'`;
        });

        const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
        stream.write(sql);
    }
}

stream.write('COMMIT;\n');
stream.end();

console.log(`Dump completed successfully to: ${outputPath}`);
console.log('You can now upload "dump.sql" to Turso.');
