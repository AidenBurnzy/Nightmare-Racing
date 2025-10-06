// Simple test function to verify Netlify Functions are working
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'API is working!',
            timestamp: new Date().toISOString(),
            method: event.httpMethod
        })
    };
};