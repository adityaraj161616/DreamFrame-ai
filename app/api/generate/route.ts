import { type NextRequest, NextResponse } from "next/server"
import { saveImage } from "@/lib/enhanced-database"
import { generateImage } from "@/lib/working-image-generator" // Use the WORKING generator

// Enhanced job queue with better tracking
const jobs = new Map()

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = "realistic" } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Clean and validate prompt
    const cleanPrompt = prompt.trim()
    if (cleanPrompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long (max 500 characters)" }, { status: 400 })
    }

    // Generate unique job ID with timestamp
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store job with detailed tracking
    jobs.set(jobId, {
      id: jobId,
      prompt: cleanPrompt,
      style,
      status: "queued",
      createdAt: new Date().toISOString(),
      progress: 0,
      provider: null,
    })

    console.log(`📝 Created WORKING job ${jobId} for prompt: "${cleanPrompt}"`)

    // Start background processing
    processWorkingImageGeneration(jobId, cleanPrompt, style)

    return NextResponse.json({
      jobId,
      status: "queued",
      message: "WORKING image generation started",
    })
  } catch (error) {
    console.error("Generation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processWorkingImageGeneration(jobId: string, prompt: string, style: string) {
  try {
    console.log(`🎬 Processing WORKING job ${jobId}: "${prompt}"`)

    // Update job status to processing
    const job = jobs.get(jobId)
    if (job) {
      job.status = "processing"
      job.progress = 10
      jobs.set(jobId, job)
    }

    // Generate image using WORKING generator
    const result = await generateImage({
      prompt,
      style,
      width: 512,
      height: 512,
    })

    if (result.success && result.imageUrl) {
      console.log(`✅ WORKING generation successful for job ${jobId}`)
      console.log(`🖼️ Image URL: ${result.imageUrl}`)
      console.log(`🤖 Provider: ${result.provider}`)

      // Update job with completed status
      if (jobs.has(jobId)) {
        jobs.set(jobId, {
          ...jobs.get(jobId),
          status: "completed",
          progress: 100,
          imageUrl: result.imageUrl,
          provider: result.provider,
          completedAt: new Date().toISOString(),
        })
      }

      // Save to database
      try {
        const savedImage = await saveImage({
          prompt,
          style,
          imageUrl: result.imageUrl,
          status: "completed",
          provider: result.provider || "unknown",
          createdAt: new Date(),
          userId: "demo-user", // In production, get from auth
        })

        console.log(`💾 WORKING image saved to database with ID: ${savedImage.id}`)
      } catch (dbError) {
        console.error("Database save error:", dbError)
        // Don't fail the generation if database save fails
      }
    } else {
      throw new Error(result.error || "WORKING image generation failed")
    }
  } catch (error) {
    console.error(`❌ WORKING processing error for job ${jobId}:`, error)

    // Update job with failed status
    if (jobs.has(jobId)) {
      jobs.set(jobId, {
        ...jobs.get(jobId),
        status: "failed",
        progress: 0,
        error: error.message,
        failedAt: new Date().toISOString(),
      })
    }
  }
}
