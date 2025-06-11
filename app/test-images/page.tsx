"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageWithFallback from "@/components/image-with-fallback"

export default function TestImagesPage() {
  const [testImages, setTestImages] = useState<string[]>([])

  useEffect(() => {
    // Generate test URLs to verify image loading
    const testUrls = [
      "https://source.unsplash.com/512x512/?landscape,mountain,sunset,nature&sig=37",
      "https://source.unsplash.com/512x512/?fantasy,dragon,magic,medieval&sig=123",
      "https://source.unsplash.com/512x512/?cyberpunk,neon,technology,futuristic&sig=456",
      "https://picsum.photos/512/512?random=789",
      "https://via.placeholder.com/512x512/6366f1/ffffff?text=Test+Image",
      "https://invalid-url-test.com/image.jpg", // This should fail and show fallback
    ]
    setTestImages(testUrls)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Image Loading Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Testing different image sources to debug loading issues. Check browser console for detailed logs.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
              Reload Test
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((url, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">Test Image {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative mb-4">
                  <ImageWithFallback
                    src={url || "/placeholder.svg"}
                    alt={`Test image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="text-xs text-gray-500 break-all">{url}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
