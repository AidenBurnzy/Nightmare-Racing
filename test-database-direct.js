// Direct database connection test - can be run locally
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_Na8FzyBL2qQI@ep-divine-flower-adb4f8ol-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testDatabaseConnection() {
    try {
        console.log('🔄 Testing database connection...');
        
        const sql = neon(DATABASE_URL);
        
        // Test basic connection
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Database connected successfully!');
        console.log('Current time from database:', result[0].current_time);
        
        // Test cars table
        const cars = await sql`SELECT * FROM cars ORDER BY created_at DESC LIMIT 5`;
        console.log(`✅ Found ${cars.length} cars in database:`);
        
        cars.forEach((car, index) => {
            console.log(`${index + 1}. ${car.name} (Status: ${car.status}, Featured: ${car.featured})`);
        });
        
        return cars;
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}

// Run the test
if (require.main === module) {
    testDatabaseConnection()
        .then(() => console.log('✅ Database test completed'))
        .catch(() => console.log('❌ Database test failed'));
}

module.exports = { testDatabaseConnection };