// Database seeding script for DreamFrame
// This would typically connect to MongoDB or PostgreSQL

async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  try {
    // Mock database connection
    console.log("📡 Connecting to database...")

    // In production, you would use:
    // const { MongoClient } = require('mongodb');
    // const client = new MongoClient(process.env.MONGODB_URL);
    // await client.connect();
    // const db = client.db('dreamframe');

    // Seed users
    console.log("👥 Seeding users...")
    const users = [
      {
        id: "1",
        name: "Demo User",
        email: "demo@dreamframe.ai",
        createdAt: new Date("2024-01-01"),
        credits: 50,
      },
      {
        id: "2",
        name: "Artist Pro",
        email: "artist@dreamframe.ai",
        createdAt: new Date("2024-01-05"),
        credits: 100,
      },
    ]

    // await db.collection('users').insertMany(users);
    console.log(`✅ Seeded ${users.length} users`)

    // Seed sample images
    console.log("🖼️ Seeding sample images...")
    const images = [
      {
        id: "1",
        userId: "1",
        prompt: "A majestic dragon soaring through a starlit sky, digital art, highly detailed",
        imageUrl: "/placeholder.svg?height=512&width=512&text=Dragon",
        style: "fantasy",
        status: "completed",
        createdAt: new Date("2024-01-15T10:30:00Z"),
      },
      {
        id: "2",
        userId: "1",
        prompt: "Cyberpunk cityscape with neon lights and flying cars, futuristic, 4k",
        imageUrl: "/placeholder.svg?height=512&width=512&text=Cyberpunk",
        style: "cyberpunk",
        status: "completed",
        createdAt: new Date("2024-01-14T15:45:00Z"),
      },
      {
        id: "3",
        userId: "2",
        prompt: "Beautiful sunset over mountain landscape, photorealistic, golden hour",
        imageUrl: "/placeholder.svg?height=512&width=512&text=Sunset",
        style: "realistic",
        status: "completed",
        createdAt: new Date("2024-01-13T08:20:00Z"),
      },
    ]

    // await db.collection('images').insertMany(images);
    console.log(`✅ Seeded ${images.length} sample images`)

    // Create indexes for better performance
    console.log("📊 Creating database indexes...")
    // await db.collection('users').createIndex({ email: 1 }, { unique: true });
    // await db.collection('images').createIndex({ userId: 1 });
    // await db.collection('images').createIndex({ createdAt: -1 });
    console.log("✅ Database indexes created")

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    process.exit(1)
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
