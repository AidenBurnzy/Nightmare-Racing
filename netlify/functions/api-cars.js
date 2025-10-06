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
        // Netlify Neon extension uses NETLIFY_DATABASE_URL
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || 
                           process.env.DATABASE_URL || 
                           process.env.NEON_DATABASE_URL;
        
        if (!databaseUrl) {
            console.error('❌ No database URL found in environment variables');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'NETLIFY_DATABASE_URL environment variable not set',
                    hint: 'Make sure the Neon extension is enabled in your Netlify dashboard'
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
                                'custom2', cs.custom2
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
        
        // Handle POST request - add new car
        if (event.httpMethod === 'POST') {
            console.log('📝 Adding new car...');
            const carData = JSON.parse(event.body);
            
            // Insert car
            const [newCar] = await sql`
                INSERT INTO cars (name, description, main_image, status, featured, date_added)
                VALUES (
                    ${carData.name}, 
                    ${carData.description}, 
                    ${carData.mainImage || null}, 
                    ${carData.status || 'COMPLETED'}, 
                    ${carData.featured !== false}, 
                    ${carData.dateAdded || new Date().toISOString()}
                )
                RETURNING *
            `;
            
            // Insert specs if provided
            if (carData.specs && Object.keys(carData.specs).length > 0) {
                await sql`
                    INSERT INTO car_specs (
                        car_id, zero_to_sixty, top_speed, horsepower, 
                        engine, weight, custom1, custom2
                    )
                    VALUES (
                        ${newCar.id}, 
                        ${carData.specs.zeroToSixty || null}, 
                        ${carData.specs.topSpeed || null},
                        ${carData.specs.horsepower || null}, 
                        ${carData.specs.engine || null},
                        ${carData.specs.weight || null}, 
                        ${carData.specs.custom1 || null},
                        ${carData.specs.custom2 || null}
                    )
                `;
            }
            
            // Insert gallery images if provided
            if (carData.gallery && Array.isArray(carData.gallery) && carData.gallery.length > 0) {
                for (let i = 0; i < carData.gallery.length; i++) {
                    const image = carData.gallery[i];
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const caption = typeof image === 'object' ? image.caption : null;
                    
                    await sql`
                        INSERT INTO car_gallery (car_id, image_url, image_order, caption)
                        VALUES (${newCar.id}, ${imageUrl}, ${i}, ${caption})
                    `;
                }
            }
            
            console.log(`✅ Successfully added car: ${newCar.name}`);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    id: newCar.id,
                    name: newCar.name,
                    description: newCar.description,
                    mainImage: newCar.main_image,
                    status: newCar.status,
                    featured: newCar.featured,
                    dateAdded: newCar.created_at
                })
            };
        }
        
        // Handle PUT request - update car
        if (event.httpMethod === 'PUT') {
            const pathParts = event.path.split('/');
            const carId = pathParts[pathParts.length - 1];
            const carData = JSON.parse(event.body);
            
            console.log(`📝 Updating car ${carId}...`);
            
            // Update car basic info
            await sql`
                UPDATE cars 
                SET name = ${carData.name}, 
                    description = ${carData.description},
                    main_image = ${carData.mainImage}, 
                    status = ${carData.status},
                    featured = ${carData.featured}, 
                    updated_at = NOW()
                WHERE id = ${carId}
            `;
            
            // Update or insert specs
            if (carData.specs) {
                const existingSpecs = await sql`
                    SELECT * FROM car_specs WHERE car_id = ${carId}
                `;
                
                if (existingSpecs.length > 0) {
                    await sql`
                        UPDATE car_specs 
                        SET zero_to_sixty = ${carData.specs.zeroToSixty || null},
                            top_speed = ${carData.specs.topSpeed || null},
                            horsepower = ${carData.specs.horsepower || null},
                            engine = ${carData.specs.engine || null},
                            weight = ${carData.specs.weight || null},
                            custom1 = ${carData.specs.custom1 || null},
                            custom2 = ${carData.specs.custom2 || null}
                        WHERE car_id = ${carId}
                    `;
                } else {
                    await sql`
                        INSERT INTO car_specs (
                            car_id, zero_to_sixty, top_speed, horsepower,
                            engine, weight, custom1, custom2
                        )
                        VALUES (
                            ${carId}, 
                            ${carData.specs.zeroToSixty || null},
                            ${carData.specs.topSpeed || null},
                            ${carData.specs.horsepower || null},
                            ${carData.specs.engine || null},
                            ${carData.specs.weight || null},
                            ${carData.specs.custom1 || null},
                            ${carData.specs.custom2 || null}
                        )
                    `;
                }
            }
            
            console.log(`✅ Successfully updated car ${carId}`);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Car updated successfully' })
            };
        }
        
        // Handle DELETE request
        if (event.httpMethod === 'DELETE') {
            const pathParts = event.path.split('/');
            const carId = pathParts[pathParts.length - 1];
            
            console.log(`🗑️ Deleting car ${carId}...`);
            
            // Delete car (cascade will handle specs and gallery)
            await sql`DELETE FROM cars WHERE id = ${carId}`;
            
            console.log(`✅ Successfully deleted car ${carId}`);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Car deleted successfully' })
            };
        }
        
        // Handle other HTTP methods
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                error: 'Method not allowed',
                message: `${event.httpMethod} method not supported`
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