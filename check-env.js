// check-env.js - Environment variable checker for deployment debugging

console.log('🔍 Environment Variable Checker');
console.log('================================');

const requiredVars = ['DATABASE_URL', 'NEON_DATABASE_URL'];

console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
    }
});

console.log('\n🌐 All Environment Variables:');
Object.keys(process.env)
    .filter(key => key.includes('DATABASE') || key.includes('NEON'))
    .forEach(key => {
        console.log(`   ${key}: ${process.env[key] ? '✅ SET' : '❌ NOT SET'}`);
    });

console.log('\n💡 If variables are missing in production:');
console.log('   1. Go to Netlify Dashboard → Your Site → Site Settings → Environment variables');
console.log('   2. Add DATABASE_URL with your Neon connection string');
console.log('   3. Redeploy your site');

// Test database connection if available
if (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL) {
    console.log('\n🔌 Testing database connection...');
    try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
        
        const result = await sql`SELECT COUNT(*) as count FROM cars`;
        console.log(`✅ Database connection successful! Found ${result[0].count} cars.`);
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
    }
} else {
    console.log('\n⚠️  Cannot test database connection - no connection string found');
}