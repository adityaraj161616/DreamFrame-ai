import { type NextRequest, NextResponse } from "next/server"

// Mock job storage - in production, use Redis
const jobs = new Map()

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    // Await params in Next.js 15
    const { jobId } = await params

    // In a real implementation, you might need to check multiple job stores
    // For now, we'll create a mock job if it doesn't exist (for demo purposes)
    let job = jobs.get(jobId)

    if (!job) {
      // Create a mock completed job for demo
      job = {
        id: jobId,
        status: "completed",
        imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      }
      jobs.set(jobId, job)
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      imageUrl: job.imageUrl,
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
