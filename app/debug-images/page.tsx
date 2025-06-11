"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageWithFallback from "@/components/image-with-fallback"

function ClientInfo() {
  const [browserInfo, setBrowserInfo] = useState({
    userAgent: "Loading...",
    screenSize: "Loading...",
    viewport: "Loading...",
  })

  useEffect(() => {
    setBrowserInfo({
      userAgent: window.navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    })
  }, [])

  return (
    <div className="text-sm text-gray-300 space-y-1">
      <div>User Agent: {browserInfo.userAgent}</div>
      <div>Screen: {browserInfo.screenSize}</div>
      <div>Viewport: {browserInfo.viewport}</div>
    </div>
  )
}

export default function DebugImagesPage() {
  const [testResults, setTestResults] = useState<Array<{ url: string; status: string }>>([])

  const testUrls = [
    "https://picsum.photos/seed/nature-34/512/512",
    "https://picsum.photos/seed/fantasy-1/512/512",
    "https://picsum.photos/seed/cyber-2/512/512",
    "https://picsum.photos/512/512?random=123",
    "https://via.placeholder.com/512x512/6366f1/ffffff?text=Test+Image",
  ]

  const testImageLoad = async (url: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok ? "success" : "failed"
    } catch (error) {
      return "error"
    }
  }

  const runTests = async () => {
    console.log("🧪 Running image load tests...")
    const results = []

    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: "HEAD" })
        const status = response.ok ? "success" : "failed"
        results.push({ url, status })
        console.log(`${status === "success" ? "✅" : "❌"} ${url} - ${status}`)
      } catch (error) {
        results.push({ url, status: "error" })
        console.log(`❌ ${url} - error: ${error.message}`)
      }
    }

    setTestResults(results)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      runTests()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">🧪 Image Loading Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Testing image sources to verify they're loading correctly. Check browser console for detailed logs.
            </p>
            <Button onClick={runTests} className="bg-purple-600 hover:bg-purple-700 mb-4">
              Re-run Tests
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-2 mb-4">
                <h3 className="text-white font-semibold">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm">
                    <span className={result.status === "success" ? "text-green-400" : "text-red-400"}>
                      {result.status === "success" ? "✅" : "❌"}
                    </span>
                    <span className="text-gray-300 ml-2">{result.url}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testUrls.map((url, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-gray-300">Test Image {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative mb-4 border border-white/20 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={url || "/placeholder.svg"}
                    alt={`Test image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-gray-500 break-all">{url}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-white">🔍 Browser Info</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientInfo />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
