// debug.js - Debugging endpoint for Netlify Functions

export async function handler(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        const debugInfo = {
            timestamp: new Date().toISOString(),
            environment: {
                DATABASE_URL: process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET',
                NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? '✅ SET' : '❌ NOT SET',
                NODE_ENV: process.env.NODE_ENV || 'not set',
                NETLIFY_DEV: process.env.NETLIFY_DEV || 'not set'
            },
            databaseConnection: null,
            carCount: null,
            errors: []
        };
        
        // Test database connection
        if (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL) {
            try {
                const { neon } = await import('@neondatabase/serverless');
                const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
                
                debugInfo.databaseConnection = '✅ Connection successful';
                
                // Try to count cars
                const result = await sql`SELECT COUNT(*) as count FROM cars`;
                debugInfo.carCount = `${result[0].count} cars in database`;
                
            } catch (dbError) {
                debugInfo.databaseConnection = `❌ Connection failed: ${dbError.message}`;
                debugInfo.errors.push({
                    type: 'database',
                    message: dbError.message,
                    stack: dbError.stack
                });
            }
        } else {
            debugInfo.databaseConnection = '❌ No connection string available';
            debugInfo.errors.push({
                type: 'config',
                message: 'DATABASE_URL or NEON_DATABASE_URL environment variable not set'
            });
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(debugInfo, null, 2)
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Debug endpoint error',
                message: error.message,
                stack: error.stack
            }, null, 2)
        };
    }
}