const Database = require('better-sqlite3');
const db = new Database('inventory.db');

try {
    console.log("Adding display_order column to product_images...");
    db.prepare("ALTER TABLE product_images ADD COLUMN display_order INTEGER DEFAULT 0").run();
    console.log("Success: display_order column added.");
} catch (error) {
    if (error.message.includes("duplicate column name")) {
        console.log("Note: display_order column already exists.");
    } else {
        console.error("Error migrating database:", error);
    }
}
