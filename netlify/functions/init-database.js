// netlify/functions/init-database.js
// Run this once to create the vehicle_information table and seed sample data

const { neon } = require('@neondatabase/serverless');

const SAMPLE_PROJECTS = [
    {
        year: 2013,
        make: 'Hyundai',
        model: 'Genesis Coupe 2.0T',
        name: '2013 Hyundai Genesis Coupe 2.0T',
        description: 'Built engine with JE forged pistons, Brian Crower H-beam rods, ARP head and main studs, and a precision turbo upgrade.',
        mechanics: 'Nightmare Racing Team',
        status: 'COMPLETED',
        mainImage: null,
        gallery: [],
        videos: [],
        specs: {
            horsepower: '1000HP',
            engine: '2.0T Turbo',
            zeroToSixty: '3.1s'
        }
    },
    {
        year: 1998,
        make: 'Toyota',
        model: 'Supra',
        name: 'Twin-Turbo Supra Build',
        description: '1200HP street and strip monster featuring forged internals, dual fuel systems, and full standalone management.',
        mechanics: 'Carlos Vega',
        status: 'IN PROGRESS',
        mainImage: null,
        gallery: [],
        videos: [],
        specs: {
            horsepower: '1200HP',
            topSpeed: '220mph'
        }
    },
    {
        year: 2024,
        make: 'Ford',
        model: 'Mustang Dark Horse',
        name: 'Project Nightfall',
        description: 'Stealth-themed build with full exhaust, coilovers, aero, and custom calibration for track duty.',
        mechanics: 'Nightmare Racing Fabrication',
        status: 'COMING SOON',
        mainImage: null,
        gallery: [],
        videos: [],
        specs: {
            custom1: 'Widebody prep underway'
        }
    }
];

const toJson = (value, fallback) => JSON.stringify(value ?? fallback);

exports.handler = async () => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

        if (!dbUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'No database URL found' })
            };
        }

        const sql = neon(dbUrl);
        const messages = [];

        console.log('🔄 Checking database status...');

        await sql`CREATE TABLE IF NOT EXISTS vehicle_information (
            id BIGSERIAL PRIMARY KEY,
            year INTEGER,
            make TEXT,
            model TEXT,
            name TEXT NOT NULL,
            description TEXT,
            mechanics TEXT,
            main_image TEXT,
            status TEXT DEFAULT 'COMPLETED',
            date_added TIMESTAMPTZ DEFAULT NOW(),
            gallery JSONB DEFAULT '[]'::jsonb,
            videos JSONB DEFAULT '[]'::jsonb,
            specs JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )`;
        messages.push('✅ Ensured vehicle_information table');

        await sql`CREATE INDEX IF NOT EXISTS idx_vehicle_information_status ON vehicle_information(status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_vehicle_information_date_added ON vehicle_information(date_added DESC)`;
        messages.push('✅ Ensured vehicle_information indexes');

        const [{ count }] = await sql`SELECT COUNT(*)::INTEGER AS count FROM vehicle_information`;

        if (count === 0) {
            console.log('📝 Seeding sample vehicle records...');
            for (const project of SAMPLE_PROJECTS) {
                await sql`
                    INSERT INTO vehicle_information (year, make, model, name, description, mechanics, main_image, status, gallery, videos, specs)
                    VALUES (
                        ${project.year},
                        ${project.make},
                        ${project.model},
                        ${project.name},
                        ${project.description},
                        ${project.mechanics},
                        ${project.mainImage},
                        ${project.status},
                        ${toJson(project.gallery, [])}::jsonb,
                        ${toJson(project.videos, [])}::jsonb,
                        ${toJson(project.specs, {})}::jsonb
                    )
                `;
                messages.push(`✅ Added project: ${project.name}`);
            }
        } else {
            messages.push(`ℹ️ vehicle_information already has ${count} records`);
        }

        const [{ total }] = await sql`SELECT COUNT(*)::INTEGER AS total FROM vehicle_information`;
        const [{ completed }] = await sql`
            SELECT COUNT(*)::INTEGER AS completed
            FROM vehicle_information
            WHERE UPPER(status) = 'COMPLETED'
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(
                {
                    success: true,
                    message: '✅ Database initialization complete!',
                    details: messages,
                    stats: {
                        totalVehicles: total,
                        completedProjects: completed
                    },
                    nextSteps: [
                        'Your database is now ready!',
                        'Visit /.netlify/functions/api-cars to fetch all projects',
                        'Use the admin panel to add or edit vehicle information',
                        'Visit /src/pages/featured-cars.html to view the public projects page'
                    ]
                },
                null,
                2
            )
        };
    } catch (error) {
        console.error('❌ Database initialization failed:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(
                {
                    success: false,
                    error: error.message,
                    stack: error.stack
                },
                null,
                2
            )
        };
    }
};
