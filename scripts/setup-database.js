// setup-database.js - Script to initialize the database with schema
// Run this once to set up your database tables and sample data

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
    try {
        console.log('🚀 Setting up Nightmare Racing database...');
        
        // Initialize database connection
        const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
        
        // Read and execute schema file
        const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);
        
        console.log(`📊 Executing ${statements.length} database statements...`);
        
        // Execute each statement
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await sql(statement);
                    console.log('✅ Executed:', statement.substring(0, 50) + '...');
                } catch (error) {
                    // Some statements might fail if tables already exist - that's OK
                    if (!error.message.includes('already exists')) {
                        console.warn('⚠️ Warning:', error.message);
                    }
                }
            }
        }
        
        // Verify setup by counting cars
        const result = await sql`SELECT COUNT(*) as count FROM cars`;
        console.log(`🏎️ Database setup complete! ${result[0].count} cars in database.`);
        
        // Test API endpoint
        console.log('🔗 Testing API endpoint...');
        console.log('   You can test with: curl "/.netlify/functions/api-cars"');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure NETLIFY_DATABASE_URL is set in your environment');
        console.log('2. Ensure your Neon database is active and accessible');
        console.log('3. Check that @netlify/neon package is installed');
        process.exit(1);
    }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase();
}