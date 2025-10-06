// netlify/functions/car-count.js
// Simple function to check database without returning all data

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };
    
    try {
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                           process.env.DATABASE_URL || 
                           process.env.NEON_DATABASE_URL;
        
        if (!databaseUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'No database URL found',
                    envVarsChecked: ['NETLIFY_DATABASE_URL', 'DATABASE_URL', 'NEON_DATABASE_URL']
                })
            };
        }
        
        const sql = neon(databaseUrl);
        
        // Check if tables exist
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('cars', 'car_specs', 'car_gallery')
        `;
        
        let stats = {
            tablesExist: tables.map(t => t.table_name),
            carCount: 0,
            specsCount: 0,
            galleryCount: 0,
            sampleCars: []
        };
        
        if (tables.length > 0) {
            // Count cars
            const carCount = await sql`SELECT COUNT(*) as count FROM cars`;
            stats.carCount = parseInt(carCount[0].count);
            
            // Count specs
            try {
                const specsCount = await sql`SELECT COUNT(*) as count FROM car_specs`;
                stats.specsCount = parseInt(specsCount[0].count);
            } catch (e) {
                stats.specsCount = 'Table may not exist';
            }
            
            // Count gallery
            try {
                const galleryCount = await sql`SELECT COUNT(*) as count FROM car_gallery`;
                stats.galleryCount = parseInt(galleryCount[0].count);
            } catch (e) {
                stats.galleryCount = 'Table may not exist';
            }
            
            // Get first 3 cars (without images to keep response small)
            if (stats.carCount > 0) {
                const sampleCars = await sql`
                    SELECT 
                        id, 
                        name, 
                        status, 
                        featured,
                        LENGTH(main_image) as image_size,
                        created_at
                    FROM cars 
                    ORDER BY created_at DESC 
                    LIMIT 3
                `;
                stats.sampleCars = sampleCars;
            }
            
            // Check for large images in gallery
            const largeImages = await sql`
                SELECT 
                    car_id,
                    COUNT(*) as image_count,
                    AVG(LENGTH(image_url)) as avg_image_size
                FROM car_gallery
                GROUP BY car_id
            `;
            stats.galleryImageStats = largeImages;
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: '✅ Database connection successful!',
                stats: stats,
                warning: stats.carCount > 100 ? 'Large number of cars detected' : null
            }, null, 2)
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message,
                stack: error.stack
            }, null, 2)
        };
    }
};