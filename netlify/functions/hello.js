// Minimal test function to debug Netlify Functions deployment
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: 'Hello from Netlify Function!',
            timestamp: new Date().toISOString()
        })
    };
};