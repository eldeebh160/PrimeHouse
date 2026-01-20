
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), 'inventory.db');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    process.exit(1);
}

const db = new Database(dbPath);

function cleanup() {
    console.log('Starting image cleanup...');

    // 1. Get all image URLs from the database
    // From products table
    const productImages = db.prepare('SELECT image_url FROM products WHERE image_url IS NOT NULL').all().map(row => row.image_url);
    // From product_images table
    const galleryImages = db.prepare('SELECT url FROM product_images WHERE url IS NOT NULL').all().map(row => row.url);
    // From categories table
    const categoryImages = db.prepare('SELECT image_url FROM categories WHERE image_url IS NOT NULL').all().map(row => row.image_url);

    const allUsedUrls = new Set([...productImages, ...galleryImages, ...categoryImages]);

    // Normalize paths to just filenames if they start with /uploads/
    const usedFilenames = new Set();
    allUsedUrls.forEach(url => {
        if (typeof url === 'string') {
            const filename = url.replace('/uploads/', '');
            usedFilenames.add(filename);
        }
    });

    console.log(`Found ${usedFilenames.size} unique images in use.`);

    // 2. List all files in public/uploads
    if (!fs.existsSync(uploadsDir)) {
        console.log('Uploads directory does not exist.');
        return;
    }

    const files = fs.readdirSync(uploadsDir);
    console.log(`Total files in uploads directory: ${files.length}`);

    let deletedCount = 0;
    let keptCount = 0;

    // 3. Delete files not in use
    files.forEach(file => {
        if (!usedFilenames.has(file)) {
            const filePath = path.join(uploadsDir, file);
            try {
                fs.unlinkSync(filePath);
                deletedCount++;
            } catch (err) {
                console.error(`Failed to delete ${file}:`, err);
            }
        } else {
            keptCount++;
        }
    });

    console.log(`Cleanup complete!`);
    console.log(`Deleted: ${deletedCount} unused images.`);
    console.log(`Kept: ${keptCount} images in use.`);
}

cleanup();
db.close();
