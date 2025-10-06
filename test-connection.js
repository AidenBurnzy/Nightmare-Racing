// test-connection.js - Quick test to verify Neon database connection
// Run this to test your database connection and setup

import { neon } from '@neondatabase/serverless';

async function testConnection() {
    try {
        console.log('🔍 Testing Neon database connection...');
        
        // Check if DATABASE_URL is available
        if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
            console.error('❌ No DATABASE_URL found in environment variables');
            console.log('📝 You need to:');
            console.log('   1. Go to your Netlify dashboard');
            console.log('   2. Go to Site settings → Environment variables');
            console.log('   3. Add DATABASE_URL with your Neon connection string');
            console.log('   4. The connection string looks like: postgresql://username:password@host/database');
            return;
        }

        const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
        
        // Test basic connection
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Database connection successful!');
        console.log('🕐 Current time from database:', result[0].current_time);
        
        // Test if tables exist
        try {
            const tablesResult = await sql`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('cars', 'car_specs', 'car_gallery')
            `;
            
            console.log('📊 Found tables:', tablesResult.map(t => t.table_name));
            
            if (tablesResult.length === 0) {
                console.log('⚠️  No car tables found. Run: npm run db:setup');
            } else if (tablesResult.length < 3) {
                console.log('⚠️  Some tables missing. Run: npm run db:setup');
            } else {
                // Test data
                const carsCount = await sql`SELECT COUNT(*) as count FROM cars`;
                console.log(`🏎️  Found ${carsCount[0].count} cars in database`);
            }
            
        } catch (tableError) {
            console.log('⚠️  Tables not set up yet. Run: npm run db:setup');
        }
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('🔧 Troubleshooting steps:');
        console.log('   1. Verify DATABASE_URL is correct in Netlify environment variables');
        console.log('   2. Check your Neon database is active');
        console.log('   3. Ensure your IP is allowlisted in Neon (if applicable)');
    }
}

testConnection();