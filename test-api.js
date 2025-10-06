#!/usr/bin/env node
// Test script to validate API and database connection

async function testAPI() {
    try {
        console.log('Testing local API connection...');
        
        // Test the API endpoint
        const response = await fetch('http://localhost:8080/.netlify/functions/api-cars');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response successful');
            console.log(`📊 Received ${data.length} cars`);
            
            // Check for featured cars
            const featuredCars = data.filter(car => car.featured !== false);
            console.log(`⭐ Featured cars: ${featuredCars.length}`);
            
            // Display first few cars
            console.log('\n🚗 Cars data:');
            data.slice(0, 3).forEach((car, index) => {
                console.log(`${index + 1}. ${car.name} (Featured: ${car.featured !== false ? 'Yes' : 'No'})`);
            });
            
        } else {
            console.log(`❌ API Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log('Response body:', text);
        }
        
    } catch (error) {
        console.log('❌ Connection error:', error.message);
        console.log('💡 This is expected in local development - the database requires environment variables');
    }
}

testAPI();