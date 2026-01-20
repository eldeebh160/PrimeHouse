const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Load .env manually if needed, but we'll assume they have it
// For simplicity, we'll ask user to ensure variables are in .env
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length === 2) env[parts[0].trim()] = parts[1].trim();
});

const url = env.TURSO_DATABASE_URL;
const authToken = env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in your .env file.');
    process.exit(1);
}

const db = createClient({ url, authToken });

async function upload() {
    const dumpPath = path.join(process.cwd(), 'dump.sql');
    if (!fs.existsSync(dumpPath)) {
        console.error('Error: "dump.sql" not found. Run "node scripts/dump_db.js" first.');
        return;
    }

    console.log('Reading dump.sql...');
    const sql = fs.readFileSync(dumpPath, 'utf8');

    // Split by semicolons, but being careful about semicolons in strings is hard.
    // However, for a simple dump, splitting by ";\n" is usually safe.
    const statements = sql
        .split(';\n')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Uploading ${statements.length} statements to Turso...`);

    for (let i = 0; i < statements.length; i++) {
        try {
            // Re-append the semicolon
            await db.execute(statements[i] + ';');
            if (i % 10 === 0) console.log(`Progress: ${i}/${statements.length}`);
        } catch (err) {
            console.error(`Error in statement ${i}:`, err.message);
            console.error('Statement:', statements[i]);
            // Continue or stop? Usually stop on schema errors
            if (statements[i].includes('CREATE TABLE')) {
                console.error('Creation error. Stopping.');
                return;
            }
        }
    }

    console.log('Upload completed successfully!');
}

upload();
