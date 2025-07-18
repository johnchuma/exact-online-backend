const axios = require('axios');
const redisClient = require('./config/redis');

const BASE_URL = 'http://localhost:5000';
const GUEST_TOKEN = 'guest';

async function testCachingEndpoints() {
  console.log('🚀 Starting comprehensive caching test...\n');
  
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('✅ Redis connected\n');

    // Test configuration
    const headers = {
      'Authorization': `Bearer ${GUEST_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // Test cases
    const testCases = [
      {
        name: 'Categories List',
        url: `${BASE_URL}/categories`,
        cacheKeyPattern: '*:categories:*'
      },
      {
        name: 'Products List',
        url: `${BASE_URL}/products`,
        cacheKeyPattern: '*:products:*'
      },
      {
        name: 'Services List',
        url: `${BASE_URL}/services`,
        cacheKeyPattern: '*:services:*'
      },
      {
        name: 'Products Search',
        url: `${BASE_URL}/products/search/phone`,
        cacheKeyPattern: '*:search:products:*'
      },
      {
        name: 'Services Search',
        url: `${BASE_URL}/services/search/repair`,
        cacheKeyPattern: '*:search:services:*'
      },
      {
        name: 'New Arrival Products',
        url: `${BASE_URL}/products/new`,
        cacheKeyPattern: '*:products:new-arrivals:*'
      },
      {
        name: 'New Arrival Services',
        url: `${BASE_URL}/services/new`,
        cacheKeyPattern: '*:services:new-arrivals:*'
      }
    ];

    for (const testCase of testCases) {
      console.log(`📋 Testing: ${testCase.name}`);
      
      // Clear any existing cache for this test
      await redisClient.invalidatePattern(testCase.cacheKeyPattern);
      
      // First request - should hit database
      const start1 = Date.now();
      try {
        const response1 = await axios.get(testCase.url, { headers });
        const time1 = Date.now() - start1;
        console.log(`   ⏱️  First request (DB): ${time1}ms - Status: ${response1.status}`);
      } catch (error) {
        console.log(`   ❌ First request failed: ${error.response?.status || error.message}`);
        continue;
      }
      
      // Small delay to ensure cache is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Second request - should hit cache
      const start2 = Date.now();
      try {
        const response2 = await axios.get(testCase.url, { headers });
        const time2 = Date.now() - start2;
        console.log(`   ⚡ Second request (Cache): ${time2}ms - Status: ${response2.status}`);
        
        // Calculate performance improvement
        const improvement = time1 > 0 ? ((time1 - time2) / time1 * 100).toFixed(1) : 0;
        console.log(`   🚀 Performance improvement: ${improvement}%`);
        
      } catch (error) {
        console.log(`   ❌ Second request failed: ${error.response?.status || error.message}`);
      }
      
      console.log('');
    }

    // Test cache keys
    console.log('🔍 Checking cache keys...');
    const allKeys = await redisClient.client.keys('*');
    console.log(`   📊 Total cache keys: ${allKeys.length}`);
    
    if (allKeys.length > 0) {
      console.log('   🔑 Sample cache keys:');
      allKeys.slice(0, 5).forEach(key => {
        console.log(`      - ${key}`);
      });
    }
    
    console.log('');
    
    // Test cache invalidation
    console.log('🧹 Testing cache invalidation...');
    const beforeInvalidation = await redisClient.client.keys('*');
    console.log(`   📊 Keys before invalidation: ${beforeInvalidation.length}`);
    
    await redisClient.invalidatePattern('*:products:*');
    const afterProductInvalidation = await redisClient.client.keys('*');
    console.log(`   📊 Keys after product invalidation: ${afterProductInvalidation.length}`);
    
    await redisClient.invalidatePattern('*');
    const afterFullInvalidation = await redisClient.client.keys('*');
    console.log(`   📊 Keys after full invalidation: ${afterFullInvalidation.length}`);
    
    console.log('\n✅ Caching test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Caching test failed:', error.message);
  } finally {
    // Disconnect from Redis
    await redisClient.disconnect();
    console.log('\n🔌 Redis disconnected');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get(BASE_URL);
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('   Run: npm start or node index.js\n');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🧪 Redis Caching Test Suite');
  console.log('================================\n');
  
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testCachingEndpoints();
  }
}

main();
