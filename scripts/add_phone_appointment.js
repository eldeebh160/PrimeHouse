const Database = require('better-sqlite3');
const db = new Database('inventory.db');

try {
    console.log("Adding phone column to appointments...");
    db.prepare("ALTER TABLE appointments ADD COLUMN phone VARCHAR(50)").run();
    console.log("Success: phone column added.");
} catch (error) {
    if (error.message.includes("duplicate column name")) {
        console.log("Note: phone column already exists.");
    } else {
        console.error("Error migrating database:", error);
    }
}
