"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function SimpleTestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Simple Image Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Direct Image</h2>
          <div className="relative aspect-square">
            <Image
              src="https://picsum.photos/seed/test123/512/512"
              alt="Test image"
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">https://picsum.photos/seed/test123/512/512</p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Local Image</h2>
          <div className="relative aspect-square">
            <Image
              src="/placeholder.svg?height=512&width=512"
              alt="Local placeholder"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">/placeholder.svg</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl mb-4">Browser Info:</h2>
        <pre className="bg-white/10 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(
            {
              userAgent: navigator.userAgent,
              screenWidth: window.screen.width,
              screenHeight: window.screen.height,
              innerWidth: window.innerWidth,
              innerHeight: window.innerHeight,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  )
}
