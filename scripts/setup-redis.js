// Redis setup script for background job processing
// In production, you would run this on your server

const Redis = require("redis")

async function setupRedis() {
  try {
    // Connect to Redis (adjust connection string as needed)
    const client = Redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })

    await client.connect()
    console.log("✅ Connected to Redis successfully")

    // Test Redis connection
    await client.set("test", "DreamFrame Redis Setup")
    const testValue = await client.get("test")
    console.log("✅ Redis test:", testValue)

    // Clean up test key
    await client.del("test")

    // Setup job queues
    console.log("✅ Setting up job queues...")

    // Image generation queue
    await client.del("bull:image-generation:waiting")
    await client.del("bull:image-generation:active")
    await client.del("bull:image-generation:completed")
    await client.del("bull:image-generation:failed")

    console.log("✅ Job queues initialized")

    await client.disconnect()
    console.log("✅ Redis setup completed successfully")
  } catch (error) {
    console.error("❌ Redis setup failed:", error)
    process.exit(1)
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupRedis()
}

module.exports = { setupRedis }
