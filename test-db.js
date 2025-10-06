// Simple database connection test
import { getAllCars, addCar } from './database/database.js';

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...');
        
        // Test getting all cars
        console.log('📋 Getting all cars...');
        const cars = await getAllCars();
        console.log(`✅ Found ${cars.length} cars in database`);
        
        if (cars.length > 0) {
            console.log('🚗 First car:', cars[0]);
        }
        
        console.log('✅ Database connection test successful!');
    } catch (error) {
        console.error('❌ Database test failed:', error);
    }
}

testDatabase();