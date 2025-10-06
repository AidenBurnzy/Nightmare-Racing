// Simple API function without external dependencies to test basic functionality
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
        // For now, return static data to test if function works
        const cars = [
            {
                id: 1,
                name: "Test Supra",
                description: "Test car from API",
                mainImage: null,
                gallery: [],
                specs: {
                    horsepower: "1000HP",
                    zeroToSixty: "3.0s"
                },
                status: "COMPLETED",
                featured: true,
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                name: "Test GTR",
                description: "Another test car",
                mainImage: null,
                gallery: [],
                specs: {
                    horsepower: "900HP",
                    zeroToSixty: "3.2s"
                },
                status: "IN_PROGRESS",
                featured: true,
                dateAdded: new Date().toISOString()
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