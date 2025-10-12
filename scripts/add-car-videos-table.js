#!/usr/bin/env node
/**
 * add-car-videos-table.js
 *
 * Ensures the car_videos table exists in the Neon database so we can store
 * associated video URLs for each build.
 */

const { neon } = require('@neondatabase/serverless');

async function ensureTable() {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ NETLIFY_DATABASE_URL (or DATABASE_URL) is not set.');
        process.exit(1);
    }

    const sql = neon(databaseUrl);

    console.log('🛠️  Checking for car_videos table...');

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

    await sql`CREATE INDEX IF NOT EXISTS idx_car_videos_car_id ON car_videos(car_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_car_videos_order ON car_videos(car_id, video_order)`;

    console.log('✅ car_videos table is ready.');
}

ensureTable().catch(error => {
    console.error('❌ Failed to ensure car_videos table:', error);
    process.exit(1);
});
