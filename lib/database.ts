// Database abstraction layer - works with or without MongoDB
interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  style: string
  status: string
  createdAt: Date
  userId: string
}

// In-memory storage for development (fallback)
const memoryStore: GeneratedImage[] = [
  {
    id: "1",
    prompt: "A majestic dragon soaring through a starlit sky, digital art, highly detailed",
    imageUrl: "https://picsum.photos/seed/fantasy-1/512/512",
    style: "fantasy",
    status: "completed",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    userId: "demo-user",
  },
  {
    id: "2",
    prompt: "Cyberpunk cityscape with neon lights and flying cars, futuristic, 4k",
    imageUrl: "https://picsum.photos/seed/cyber-2/512/512",
    style: "cyberpunk",
    status: "completed",
    createdAt: new Date("2024-01-14T15:45:00Z"),
    userId: "demo-user",
  },
  {
    id: "3",
    prompt: "Beautiful sunset over mountain landscape, photorealistic, golden hour",
    imageUrl: "https://picsum.photos/seed/nature-3/512/512",
    style: "realistic",
    status: "completed",
    createdAt: new Date("2024-01-13T08:20:00Z"),
    userId: "demo-user",
  },
  {
    id: "4",
    prompt: "Anime character with blue hair in magical forest, studio ghibli style",
    imageUrl: "https://picsum.photos/seed/portrait-4/512/512",
    style: "anime",
    status: "completed",
    createdAt: new Date("2024-01-12T20:15:00Z"),
    userId: "demo-user",
  },
  {
    id: "5",
    prompt: "Abstract geometric patterns in vibrant colors, modern art",
    imageUrl: "https://picsum.photos/seed/abstract-5/512/512",
    style: "artistic",
    status: "completed",
    createdAt: new Date("2024-01-11T14:30:00Z"),
    userId: "demo-user",
  },
  {
    id: "6",
    prompt: "Space station orbiting Earth, sci-fi, detailed, cinematic lighting",
    imageUrl: "https://picsum.photos/seed/space-6/512/512",
    style: "realistic",
    status: "completed",
    createdAt: new Date("2024-01-10T11:45:00Z"),
    userId: "demo-user",
  },
]

// MongoDB client (optional)
let mongoClient: any = null
let mongoDb: any = null

// Initialize MongoDB connection if available
async function initMongoDB() {
  if (mongoClient) return mongoDb

  try {
    // Dynamically import MongoDB only if it's available
    const { MongoClient } = await import("mongodb")

    if (!process.env.MONGODB_URL) {
      console.log("MongoDB URL not provided, using in-memory storage")
      return null
    }

    mongoClient = new MongoClient(process.env.MONGODB_URL)
    await mongoClient.connect()
    mongoDb = mongoClient.db("dreamframe")
    console.log("✅ Connected to MongoDB successfully")
    return mongoDb
  } catch (error) {
    console.log("MongoDB not available, using in-memory storage:", error.message)
    return null
  }
}

// Database operations
export async function saveImage(imageData: Omit<GeneratedImage, "id">) {
  const db = await initMongoDB()

  const newImage: GeneratedImage = {
    id: Date.now().toString(),
    ...imageData,
  }

  console.log("💾 Saving image with URL:", newImage.imageUrl)
  console.log("📝 Image prompt:", newImage.prompt)

  if (db) {
    try {
      await db.collection("images").insertOne({
        ...newImage,
        _id: newImage.id,
      })
      console.log("✅ Image saved to MongoDB")
    } catch (error) {
      console.error("❌ Failed to save to MongoDB:", error)
      // Fallback to memory store
      memoryStore.unshift(newImage)
      console.log("✅ Image saved to memory store as fallback")
    }
  } else {
    // Use memory store
    memoryStore.unshift(newImage)
    console.log("✅ Image saved to memory store")
  }

  return newImage
}

export async function getImages(limit = 20, offset = 0): Promise<GeneratedImage[]> {
  const db = await initMongoDB()

  if (db) {
    try {
      const images = await db
        .collection("images")
        .find({ status: "completed" })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      return images.map((img: any) => ({
        id: img._id || img.id,
        prompt: img.prompt,
        imageUrl: img.imageUrl,
        style: img.style,
        status: img.status,
        createdAt: img.createdAt,
        userId: img.userId,
      }))
    } catch (error) {
      console.error("Failed to fetch from MongoDB:", error)
    }
  }

  // Fallback to memory store
  return memoryStore
    .filter((img) => img.status === "completed")
    .slice(offset, offset + limit)
    .map((img) => ({
      ...img,
      createdAt: img.createdAt,
    }))
}

export async function getUserImages(userId: string, limit = 20, offset = 0): Promise<GeneratedImage[]> {
  const db = await initMongoDB()

  if (db) {
    try {
      const images = await db
        .collection("images")
        .find({ userId, status: "completed" })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      return images.map((img: any) => ({
        id: img._id || img.id,
        prompt: img.prompt,
        imageUrl: img.imageUrl,
        style: img.style,
        status: img.status,
        createdAt: img.createdAt,
        userId: img.userId,
      }))
    } catch (error) {
      console.error("Failed to fetch user images from MongoDB:", error)
    }
  }

  // Fallback to memory store
  return memoryStore.filter((img) => img.userId === userId && img.status === "completed").slice(offset, offset + limit)
}
