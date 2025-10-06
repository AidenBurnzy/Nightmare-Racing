// api-cars.js - API endpoints for car data
// Serverless functions for Netlify to handle car data operations

import { getAllCars, getCarById, addCar, updateCar, deleteCar } from '../../database/database.js';

/**
 * Main API handler for car operations
 * Supports GET, POST, PUT, DELETE methods
 */
export async function handler(event, context) {
    const { httpMethod, path, queryStringParameters, body } = event;
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle preflight requests
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // Check environment variables first
        const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
        
        if (!DATABASE_URL) {
            console.error('❌ No database connection string found');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'DATABASE_URL environment variable not set in Netlify',
                    details: 'Please add DATABASE_URL to Netlify environment variables',
                    environment: {
                        hasDBUrl: !!process.env.DATABASE_URL,
                        hasNeonUrl: !!process.env.NEON_DATABASE_URL,
                        nodeEnv: process.env.NODE_ENV
                    }
                })
            };
        }
        
        let result;
        
        switch (httpMethod) {
            case 'GET':
                result = await handleGetCars(queryStringParameters, path);
                break;
                
            case 'POST':
                result = await handleCreateCar(body);
                break;
                
            case 'PUT':
                result = await handleUpdateCar(path, body);
                break;
                
            case 'DELETE':
                result = await handleDeleteCar(path);
                break;
                
            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
        
    } catch (error) {
        console.error('API Error:', error);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                details: error.stack,
                timestamp: new Date().toISOString(),
                environment: {
                    hasDBUrl: !!process.env.DATABASE_URL,
                    hasNeonUrl: !!process.env.NEON_DATABASE_URL,
                    nodeEnv: process.env.NODE_ENV
                }
            })
        };
    }
}

/**
 * Handle GET requests for cars
 * @param {Object} queryParams - Query parameters
 * @param {string} path - Request path
 * @returns {Object} Cars data
 */
async function handleGetCars(queryParams, path) {
    // Extract car ID from path if present
    const pathParts = path.split('/');
    const carId = pathParts[pathParts.length - 1];
    
    // If requesting specific car
    if (carId && carId !== 'cars' && !isNaN(carId)) {
        return await getCarById(parseInt(carId));
    }
    
    // If requesting car by name
    if (queryParams?.name) {
        return await getCarById(queryParams.name);
    }
    
    // Get all cars with optional filtering
    const featuredOnly = queryParams?.featured === 'true';
    return await getAllCars(featuredOnly);
}

/**
 * Handle POST requests to create new car
 * @param {string} body - Request body
 * @returns {Object} Created car data
 */
async function handleCreateCar(body) {
    const carData = JSON.parse(body);
    
    // Validate required fields
    if (!carData.name) {
        throw new Error('Car name is required');
    }
    
    return await addCar(carData);
}

/**
 * Handle PUT requests to update car
 * @param {string} path - Request path
 * @param {string} body - Request body
 * @returns {Object} Updated car data
 */
async function handleUpdateCar(path, body) {
    const pathParts = path.split('/');
    const carId = parseInt(pathParts[pathParts.length - 1]);
    
    if (!carId || isNaN(carId)) {
        throw new Error('Valid car ID is required for update');
    }
    
    const carData = JSON.parse(body);
    return await updateCar(carId, carData);
}

/**
 * Handle DELETE requests to remove car
 * @param {string} path - Request path
 * @returns {Object} Success status
 */
async function handleDeleteCar(path) {
    const pathParts = path.split('/');
    const carId = parseInt(pathParts[pathParts.length - 1]);
    
    if (!carId || isNaN(carId)) {
        throw new Error('Valid car ID is required for deletion');
    }
    
    await deleteCar(carId);
    return { success: true, message: 'Car deleted successfully' };
}