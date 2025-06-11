import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In production, fetch user data from database
    const userData = {
      profile: {
        name: "Demo User",
        email: "demo@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      },
      images: [
        {
          id: "1",
          prompt: "A majestic dragon soaring through a starlit sky",
          imageUrl: "/placeholder.svg?height=512&width=512&text=Dragon",
          style: "fantasy",
          createdAt: "2024-01-15T10:30:00Z",
        },
      ],
      stats: {
        totalImages: 42,
        totalCreditsUsed: 42,
        accountAge: "15 days",
      },
    }

    const response = new NextResponse(JSON.stringify(userData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="dreamframe-data.json"',
      },
    })

    return response
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
