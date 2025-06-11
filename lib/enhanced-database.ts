// Enhanced Database Service with Better Image Management
interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  style: string
  status: string
  provider: string
  createdAt: Date
  userId: string
  metadata?: {
    width?: number
    height?: number
    seed?: number
    steps?: number
  }
}

// Enhanced in-memory storage with more sample data
const enhancedMemoryStore: GeneratedImage[] = [
  {
    id: "1",
    prompt: "A majestic dragon soaring through a starlit sky, digital art, highly detailed",
    imageUrl: "https://source.unsplash.com/512x512/?fantasy,dragon,magic,mystical&sig=1",
    style: "fantasy",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    userId: "demo-user",
  },
  {
    id: "2",
    prompt: "Cyberpunk cityscape with neon lights and flying cars, futuristic, 4k",
    imageUrl: "https://source.unsplash.com/512x512/?technology,neon,futuristic,digital&sig=2",
    style: "cyberpunk",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-14T15:45:00Z"),
    userId: "demo-user",
  },
  {
    id: "3",
    prompt: "Beautiful sunset over mountain landscape, photorealistic, golden hour",
    imageUrl: "https://source.unsplash.com/512x512/?nature,landscape,scenic,beautiful&sig=3",
    style: "realistic",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-13T08:20:00Z"),
    userId: "demo-user",
  },
  {
    id: "4",
    prompt: "Anime character with blue hair in magical forest, studio ghibli style",
    imageUrl: "https://source.unsplash.com/512x512/?portrait,person,face,character&sig=4",
    style: "anime",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-12T20:15:00Z"),
    userId: "demo-user",
  },
  {
    id: "5",
    prompt: "Abstract geometric patterns in vibrant colors, modern art",
    imageUrl: "https://source.unsplash.com/512x512/?art,creative,artistic,design&sig=5",
    style: "artistic",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-11T14:30:00Z"),
    userId: "demo-user",
  },
  {
    id: "6",
    prompt: "Space station orbiting Earth, sci-fi, detailed, cinematic lighting",
    imageUrl: "https://source.unsplash.com/512x512/?space,galaxy,cosmic,stars&sig=6",
    style: "realistic",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-10T11:45:00Z"),
    userId: "demo-user",
  },
  {
    id: "7",
    prompt: "Cute golden retriever puppy playing in a sunny garden",
    imageUrl: "https://source.unsplash.com/512x512/?animal,wildlife,pet,creature&sig=7",
    style: "realistic",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-09T16:20:00Z"),
    userId: "demo-user",
  },
  {
    id: "8",
    prompt: "Modern architectural masterpiece with glass and steel design",
    imageUrl: "https://source.unsplash.com/512x512/?architecture,building,urban,city&sig=8",
    style: "realistic",
    status: "completed",
    provider: "enhanced-smart",
    createdAt: new Date("2024-01-08T12:10:00Z"),
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
    const { MongoClient } = await import("mongodb")

    if (!process.env.MONGODB_URL) {
      console.log("📝 MongoDB URL not provided, using enhanced in-memory storage")
      return null
    }

    mongoClient = new MongoClient(process.env.MONGODB_URL)
    await mongoClient.connect()
    mongoDb = mongoClient.db("dreamframe")
    console.log("✅ Connected to MongoDB successfully")
    return mongoDb
  } catch (error) {
    console.log("📝 MongoDB not available, using enhanced in-memory storage:", error.message)
    return null
  }
}

// Enhanced save function
export async function saveImage(imageData: Omit<GeneratedImage, "id">): Promise<GeneratedImage> {
  const db = await initMongoDB()

  const newImage: GeneratedImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...imageData,
  }

  console.log("💾 Saving enhanced image:")
  console.log(`   📝 Prompt: ${newImage.prompt}`)
  console.log(`   🖼️ URL: ${newImage.imageUrl}`)
  console.log(`   🎨 Style: ${newImage.style}`)
  console.log(`   🤖 Provider: ${newImage.provider}`)

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
      enhancedMemoryStore.unshift(newImage)
      console.log("✅ Image saved to enhanced memory store as fallback")
    }
  } else {
    // Use enhanced memory store
    enhancedMemoryStore.unshift(newImage)
    console.log("✅ Image saved to enhanced memory store")
  }

  return newImage
}

// Enhanced get images function
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
        provider: img.provider || "unknown",
        createdAt: img.createdAt,
        userId: img.userId,
        metadata: img.metadata,
      }))
    } catch (error) {
      console.error("Failed to fetch from MongoDB:", error)
    }
  }

  // Fallback to enhanced memory store
  return enhancedMemoryStore
    .filter((img) => img.status === "completed")
    .slice(offset, offset + limit)
    .map((img) => ({
      ...img,
      createdAt: img.createdAt,
    }))
}

// Get user images
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
        provider: img.provider || "unknown",
        createdAt: img.createdAt,
        userId: img.userId,
        metadata: img.metadata,
      }))
    } catch (error) {
      console.error("Failed to fetch user images from MongoDB:", error)
    }
  }

  // Fallback to enhanced memory store
  return enhancedMemoryStore
    .filter((img) => img.userId === userId && img.status === "completed")
    .slice(offset, offset + limit)
}

// Search images by prompt
export async function searchImages(query: string, limit = 20, offset = 0): Promise<GeneratedImage[]> {
  const db = await initMongoDB()

  if (db) {
    try {
      const images = await db
        .collection("images")
        .find({
          status: "completed",
          prompt: { $regex: query, $options: "i" },
        })
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
        provider: img.provider || "unknown",
        createdAt: img.createdAt,
        userId: img.userId,
        metadata: img.metadata,
      }))
    } catch (error) {
      console.error("Failed to search images in MongoDB:", error)
    }
  }

  // Fallback to enhanced memory store
  const queryLower = query.toLowerCase()
  return enhancedMemoryStore
    .filter((img) => img.status === "completed" && img.prompt.toLowerCase().includes(queryLower))
    .slice(offset, offset + limit)
}
