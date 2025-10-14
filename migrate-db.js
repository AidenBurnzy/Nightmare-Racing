// migrate-db.js - Run database migration directly
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
        }
    });
}

async function runMigration() {
    try {
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

        if (!databaseUrl) {
            console.error('❌ No database URL found in environment variables');
            process.exit(1);
        }

        console.log('🔗 Connecting to database...');
        const sql = neon(databaseUrl);

        console.log('🔄 Adding year, make, and model columns to cars table...');

        // Add year, make, and model columns to cars table
        await sql`
            ALTER TABLE cars 
            ADD COLUMN IF NOT EXISTS year INTEGER,
            ADD COLUMN IF NOT EXISTS make VARCHAR(100),
            ADD COLUMN IF NOT EXISTS model VARCHAR(100)
        `;

        console.log('✅ Migration completed successfully!');
        console.log('');
        console.log('Changes applied:');
        console.log('  - Added year column (INTEGER)');
        console.log('  - Added make column (VARCHAR(100))');
        console.log('  - Added model column (VARCHAR(100))');
        console.log('');
        console.log('✨ Your database is now ready to use Year, Make, and Model fields!');

        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('');
        console.error('Error details:', error);
        process.exit(1);
    }
}

runMigration();
