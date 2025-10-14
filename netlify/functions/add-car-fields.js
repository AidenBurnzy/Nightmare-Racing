// add-car-fields.js - Database migration to add year, make, and model fields
// Run this once to update your database schema

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

        if (!databaseUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'Database URL not found in environment variables'
                })
            };
        }

        const sql = neon(databaseUrl);

        console.log('🔄 Starting database migration...');

        // Add year, make, and model columns to cars table
        await sql`
            ALTER TABLE cars 
            ADD COLUMN IF NOT EXISTS year INTEGER,
            ADD COLUMN IF NOT EXISTS make VARCHAR(100),
            ADD COLUMN IF NOT EXISTS model VARCHAR(100)
        `;

        console.log('✅ Migration completed successfully!');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Database migration completed successfully',
                changes: [
                    'Added year column (INTEGER)',
                    'Added make column (VARCHAR(100))',
                    'Added model column (VARCHAR(100))'
                ]
            })
        };

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Migration failed',
                message: error.message,
                details: error.toString()
            })
        };
    }
};
