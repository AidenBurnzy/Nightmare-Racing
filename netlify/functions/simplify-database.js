// Run this to simplify the database structure
// Remove unnecessary columns and simplify tables

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                           process.env.DATABASE_URL || 
                           process.env.NEON_DATABASE_URL;

        if (!databaseUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database configuration missing' })
            };
        }

        const sql = neon(databaseUrl);
        const message = [];

        // Backup existing data first
        const existingCars = await sql`SELECT * FROM cars`;
        const existingGallery = await sql`SELECT * FROM car_gallery`;
        
        // Drop the car_specs table (no longer needed)
        await sql`DROP TABLE IF EXISTS car_specs CASCADE`;
        message.push('✅ Removed car_specs table');

        // Simplify cars table - remove unnecessary columns
        // Keep: id, name, description, main_image (cover photo), status, featured, date_added
        
        // Add build_status column if it doesn't exist
        try {
            await sql`ALTER TABLE cars ADD COLUMN IF NOT EXISTS build_status VARCHAR(50) DEFAULT 'COMPLETED'`;
            message.push('✅ Added build_status column');
        } catch (e) {
            message.push('ℹ️ build_status column already exists');
        }

        // Update existing status values to build_status
        await sql`UPDATE cars SET build_status = status WHERE build_status IS NULL`;
        message.push('✅ Migrated status to build_status');

        // Remove unused columns (if they exist)
        try {
            await sql`ALTER TABLE cars DROP COLUMN IF EXISTS created_at`;
            await sql`ALTER TABLE cars DROP COLUMN IF EXISTS updated_at`;
            message.push('✅ Removed unused timestamp columns');
        } catch (e) {
            message.push('ℹ️ Timestamp columns already removed');
        }

        // Simplify car_gallery table - keep: id, car_id, image_url, image_order
        try {
            await sql`ALTER TABLE car_gallery DROP COLUMN IF EXISTS caption`;
            await sql`ALTER TABLE car_gallery DROP COLUMN IF EXISTS created_at`;
            message.push('✅ Simplified car_gallery table');
        } catch (e) {
            message.push('ℹ️ car_gallery already simplified');
        }

        // Update indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_cars_build_status ON cars(build_status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_cars_date_added ON cars(date_added DESC)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_car_gallery_order ON car_gallery(car_id, image_order)`;
        message.push('✅ Updated indexes');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Database simplified successfully!',
                details: message,
                structure: {
                    cars: 'id, name, description, main_image (cover), build_status, featured, date_added',
                    car_gallery: 'id, car_id, image_url, image_order'
                }
            })
        };

    } catch (error) {
        console.error('Database simplification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to simplify database',
                details: error.message
            })
        };
    }
};