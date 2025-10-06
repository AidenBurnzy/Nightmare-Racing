// api-cars.js - Simplified API for testing with environment variables
// Basic function to test database connection

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
        // Check environment variables
        const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
        
        if (!databaseUrl) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'DATABASE_URL environment variable not found'
                })
            };
        }
        
        // For now, return test data to verify the function works
        // We'll connect to the real database once this basic function works
        const cars = [
            {
                id: 1,
                name: "Database Test Car 1",
                description: "Test car from API with ENV vars",
                mainImage: null,
                gallery: [],
                specs: {
                    horsepower: "1200HP",
                    zeroToSixty: "2.8s",
                    topSpeed: "220mph"
                },
                status: "COMPLETED",
                featured: true,
                dateAdded: "2025-01-15T00:00:00Z"
            },
            {
                id: 2,
                name: "Database Test Car 2",
                description: "Another test car",
                mainImage: null,
                gallery: [],
                specs: {
                    horsepower: "1000HP",
                    zeroToSixty: "2.5s"
                },
                status: "IN_PROGRESS",
                featured: true,
                dateAdded: "2025-01-10T00:00:00Z"
            }
        ];
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(cars)
        };
        
    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};