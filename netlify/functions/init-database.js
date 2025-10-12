// netlify/functions/init-database.js
// Run this ONCE to create tables and add sample data

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };
    
    try {
        const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
        
        if (!dbUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'No database URL found' })
            };
        }
        
        const sql = neon(dbUrl);
        
        console.log('🔄 Checking database status...');
        
        // Check if tables exist
        const existingTables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('cars', 'car_specs', 'car_gallery', 'car_videos')
        `;
        
        let message = [];
        
        // Create tables if they don't exist
        if (existingTables.length === 0) {
            console.log('📊 Creating database tables...');
            
            // Create cars table
            await sql`
                CREATE TABLE IF NOT EXISTS cars (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    main_image TEXT,
                    status VARCHAR(50) DEFAULT 'COMPLETED',
                    featured BOOLEAN DEFAULT true,
                    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            `;
            message.push('✅ Created cars table');
            
            // Create car_specs table
            await sql`
                CREATE TABLE IF NOT EXISTS car_specs (
                    id SERIAL PRIMARY KEY,
                    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
                    zero_to_sixty VARCHAR(20),
                    top_speed VARCHAR(20),
                    horsepower VARCHAR(20),
                    engine TEXT,
                    weight VARCHAR(20),
                    custom1 VARCHAR(100),
                    custom2 VARCHAR(100),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            `;
            message.push('✅ Created car_specs table');
            
            // Create car_gallery table
            await sql`
                CREATE TABLE IF NOT EXISTS car_gallery (
                    id SERIAL PRIMARY KEY,
                    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
                    image_url TEXT NOT NULL,
                    image_order INTEGER DEFAULT 0,
                    caption TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            `;
            message.push('✅ Created car_gallery table');

            await sql`
                CREATE TABLE IF NOT EXISTS car_videos (
                    id SERIAL PRIMARY KEY,
                    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
                    video_url TEXT NOT NULL,
                    video_order INTEGER DEFAULT 0,
                    caption TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            `;
            message.push('✅ Created car_videos table');
            
            // Create indexes
            await sql`CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_cars_date_added ON cars(date_added DESC)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_car_gallery_car_id ON car_gallery(car_id)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_car_videos_car_id ON car_videos(car_id)`;
            await sql`CREATE INDEX IF NOT EXISTS idx_car_videos_order ON car_videos(car_id, video_order)`;
            
            message.push('✅ Created indexes');
        } else {
            message.push(`ℹ️ Tables already exist: ${existingTables.map(t => t.table_name).join(', ')}`);
        }
        
        // Check if there's any data
        const carCount = await sql`SELECT COUNT(*) as count FROM cars`;
        
        if (carCount[0].count === 0) {
            console.log('📝 Adding sample data...');
            
            // Insert sample cars
            const cars = [
                {
                    name: '2013 Hyundai Genesis Coupe 2.0T',
                    description: 'Built Engine With JE Forged Pistons, Brian Crower H-Beam Rods, ARP Headstuds and Main Studs',
                    status: 'COMPLETED',
                    featured: true
                },
                {
                    name: 'Twin-Turbo Supra',
                    description: '1200HP Beast • Custom Build',
                    status: 'COMPLETED',
                    featured: true
                },
                {
                    name: 'Widebody GTR',
                    description: 'Track Weapon • Full Build',
                    status: 'IN PROGRESS',
                    featured: true
                },
                {
                    name: 'Project Nightfall',
                    description: 'Stealth Build • Coming Soon',
                    status: 'IN PROGRESS',
                    featured: true
                },
                {
                    name: 'Turbo Mustang',
                    description: 'American Muscle • 900HP',
                    status: 'COMPLETED',
                    featured: true
                }
            ];
            
            for (const car of cars) {
                const [newCar] = await sql`
                    INSERT INTO cars (name, description, status, featured)
                    VALUES (${car.name}, ${car.description}, ${car.status}, ${car.featured})
                    RETURNING id, name
                `;
                
                // Add specs for each car
                if (car.name.includes('Supra')) {
                    await sql`
                        INSERT INTO car_specs (car_id, zero_to_sixty, top_speed, horsepower)
                        VALUES (${newCar.id}, '2.8s', '220mph', '1200HP')
                    `;
                } else if (car.name.includes('GTR')) {
                    await sql`
                        INSERT INTO car_specs (car_id, zero_to_sixty, horsepower, custom1)
                        VALUES (${newCar.id}, '2.5s', '1000HP', 'Track Tested')
                    `;
                } else if (car.name.includes('Mustang')) {
                    await sql`
                        INSERT INTO car_specs (car_id, zero_to_sixty, top_speed, horsepower)
                        VALUES (${newCar.id}, '3.2s', '200mph', '900HP')
                    `;
                } else if (car.name.includes('Genesis')) {
                    await sql`
                        INSERT INTO car_specs (car_id, horsepower, engine)
                        VALUES (${newCar.id}, '1000HP', '2.0T Turbo')
                    `;
                } else if (car.name.includes('Nightfall')) {
                    await sql`
                        INSERT INTO car_specs (car_id, custom1, custom2)
                        VALUES (${newCar.id}, 'Classified', 'Top Secret')
                    `;
                }
                
                message.push(`✅ Added car: ${newCar.name}`);
            }
        } else {
            message.push(`ℹ️ Database already has ${carCount[0].count} cars`);
        }
        
        // Get final count
        const finalCount = await sql`SELECT COUNT(*) as count FROM cars`;
        const featuredCount = await sql`SELECT COUNT(*) as count FROM cars WHERE featured = true`;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: '✅ Database initialization complete!',
                details: message,
                stats: {
                    totalCars: parseInt(finalCount[0].count),
                    featuredCars: parseInt(featuredCount[0].count)
                },
                nextSteps: [
                    'Your database is now ready!',
                    'Visit /.netlify/functions/api-cars to see all cars',
                    'Visit your homepage to see the carousel',
                    'Visit /featured-cars.html to see all cars'
                ]
            }, null, 2)
        };
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
            }, null, 2)
        };
    }
};
