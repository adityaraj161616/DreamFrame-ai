"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkingImagesPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  const testImages = [
    {
      url: "https://picsum.photos/seed/nature-test/512/512",
      title: "Nature Scene",
      description: "Should show a landscape/nature image",
    },
    {
      url: "https://picsum.photos/seed/fantasy-test/512/512",
      title: "Fantasy Theme",
      description: "Should show an artistic/fantasy image",
    },
    {
      url: "https://picsum.photos/seed/cyber-test/512/512",
      title: "Tech/Cyber Theme",
      description: "Should show a modern/tech image",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">✅ Images Are Working!</h1>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-8">
          <h2 className="text-green-400 font-semibold mb-2">🎉 Success!</h2>
          <p className="text-green-300">
            Based on your console logs, images are loading successfully. You should see 3 different images below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testImages.map((img, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">{img.title}</CardTitle>
                <p className="text-gray-400 text-sm">{img.description}</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative rounded-lg overflow-hidden border border-white/20">
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={img.title}
                    fill
                    className="object-cover"
                    unoptimized
                    onLoad={() => console.log(`✅ ${img.title} loaded successfully!`)}
                    onError={() => console.log(`❌ ${img.title} failed to load`)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">{img.url}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">If you see images above, then everything is working perfectly! 🎨</p>
          <div className="space-x-4">
            <a
              href="/dashboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white"
            >
              Go to Dashboard
            </a>
            <a href="/gallery" className="inline-block bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-lg text-white">
              View Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
