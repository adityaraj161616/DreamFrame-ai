import { type NextRequest, NextResponse } from "next/server"
import { getImages, searchImages } from "@/lib/enhanced-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search")

    console.log(`📖 Gallery API called - limit: ${limit}, offset: ${offset}, search: ${search}`)

    let images
    if (search && search.trim()) {
      images = await searchImages(search.trim(), limit, offset)
      console.log(`🔍 Search results: ${images.length} images found for "${search}"`)
    } else {
      images = await getImages(limit, offset)
      console.log(`📚 Retrieved ${images.length} images from gallery`)
    }

    // Format the response with enhanced data
    const formattedImages = images.map((img) => ({
      id: img.id,
      prompt: img.prompt,
      imageUrl: img.imageUrl,
      style: img.style,
      provider: img.provider,
      createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
      metadata: img.metadata,
    }))

    console.log(`✅ Returning ${formattedImages.length} formatted images`)

    return NextResponse.json(formattedImages)
  } catch (error) {
    console.error("Gallery API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
