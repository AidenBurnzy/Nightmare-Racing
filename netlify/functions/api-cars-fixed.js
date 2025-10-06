// api-cars.js - API endpoints for car data
// Direct database connection for Netlify Functions

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // Get database URL from environment variables
        const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
        
        if (!databaseUrl) {
            console.error('❌ No database URL found in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'DATABASE_URL environment variable not set'
                })
            };
        }
        
        console.log('✅ Database URL found, connecting...');
        const sql = neon(databaseUrl);
        
        // Handle GET request - fetch all cars
        if (event.httpMethod === 'GET') {
            console.log('📡 Fetching cars from database...');
            
            const cars = await sql`
                SELECT 
                    c.*,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'horsepower', cs.horsepower,
                                'engine', cs.engine,
                                'zeroToSixty', cs.zero_to_sixty,
                                'topSpeed', cs.top_speed,
                                'custom1', cs.custom1,
                                'custom2', cs.custom2,
                                'custom3', cs.custom3
                            )
                        ) FILTER (WHERE cs.car_id IS NOT NULL),
                        '[]'::json
                    ) as specs_array,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'url', cg.image_url,
                                'caption', cg.caption
                            )
                        ) FILTER (WHERE cg.car_id IS NOT NULL),
                        '[]'::json
                    ) as gallery_array
                FROM cars c
                LEFT JOIN car_specs cs ON c.id = cs.car_id
                LEFT JOIN car_gallery cg ON c.id = cg.car_id
                GROUP BY c.id
                ORDER BY c.created_at DESC
            `;
            
            // Transform data to match frontend format
            const transformedCars = cars.map(car => ({
                id: car.id,
                name: car.name,
                description: car.description,
                mainImage: car.main_image,
                gallery: car.gallery_array || [],
                specs: car.specs_array && car.specs_array.length > 0 ? car.specs_array[0] : {},
                status: car.status,
                featured: car.featured,
                dateAdded: car.created_at,
                createdAt: car.created_at,
                updatedAt: car.updated_at
            }));
            
            console.log(`✅ Successfully fetched ${transformedCars.length} cars`);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(transformedCars)
            };
        }
        
        // Handle other HTTP methods (POST, PUT, DELETE) - for future implementation
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                error: 'Method not allowed',
                message: `${event.httpMethod} method not implemented yet`
            })
        };
        
    } catch (error) {
        console.error('❌ Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Database connection failed',
                message: error.message,
                details: 'Check Netlify function logs for more information'
            })
        };
    }
};