const redisClient = require("./config/redis");

async function testRedis() {
  try {
    console.log("Testing Redis connection...");

    // Connect to Redis
    await redisClient.connect();
    console.log("✅ Redis connected successfully");

    // Test basic set/get
    const testKey = "test:redis:connection";
    const testValue = {
      message: "Hello Redis!",
      timestamp: new Date().toISOString(),
    };

    console.log("Testing set operation...");
    await redisClient.set(testKey, testValue, 10); // 10 seconds TTL
    console.log("✅ Set operation successful");

    console.log("Testing get operation...");
    const retrievedValue = await redisClient.get(testKey);
    console.log("✅ Get operation successful:", retrievedValue);

    // Test cache invalidation
    console.log("Testing cache invalidation...");
    await redisClient.invalidatePattern("test:*");
    console.log("✅ Cache invalidation successful");

    const afterInvalidation = await redisClient.get(testKey);
    console.log("Value after invalidation:", afterInvalidation);

    // Disconnect
    await redisClient.disconnect();
    console.log("✅ Redis test completed successfully");
  } catch (error) {
    console.error("❌ Redis test failed:", error.message);
    process.exit(1);
  }
}

testRedis();
