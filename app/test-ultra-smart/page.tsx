"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EnhancedImage from "@/components/enhanced-image"

// Ultra-precise client-side generation for testing
function generateUltraSmartUrl(prompt: string): string {
  const promptLower = prompt.toLowerCase()

  // Ultra-specific mappings
  const ultraMappings: Record<string, string> = {
    sunset: "sunset,orange sky,evening,golden hour,horizon,dusk,warm colors",
    sunrise: "sunrise,dawn,morning sky,golden,horizon,early morning,peaceful",
    dragon: "dragon,fantasy creature,mythical,wings,fire breathing,powerful",
    cyberpunk: "cyberpunk,neon lights,futuristic city,digital,technology,urban",
    mountain: "mountain,peak,landscape,nature,scenic,majestic,snow",
    ocean: "ocean,waves,sea,water,blue,peaceful,beach,coastal",
    cat: "cat,kitten,feline,pet,cute,furry,animal,domestic",
    dog: "dog,puppy,canine,pet,cute,loyal,animal,friendly",
    coffee: "coffee,cup,drink,cafe,morning,steam,beverage,hot",
    car: "car,automobile,vehicle,transportation,road,modern,sleek",
    space: "space,galaxy,stars,universe,cosmic,nebula,infinite",
    flower: "flower,bloom,petals,garden,nature,colorful,beautiful",
    forest: "forest,trees,woods,nature,green,peaceful,woodland",
  }

  // Find exact match
  let searchTerms = "abstract,artistic,creative,beautiful"
  for (const [key, terms] of Object.entries(ultraMappings)) {
    if (promptLower.includes(key)) {
      searchTerms = terms
      break
    }
  }

  const timestamp = Date.now()
  return `https://source.unsplash.com/1024x768/?${encodeURIComponent(searchTerms)}&orientation=landscape&t=${timestamp}`
}

export default function TestUltraSmartPage() {
  const [testPrompt, setTestPrompt] = useState("sunset")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const testPrompts = [
    "sunset",
    "sunrise",
    "dragon",
    "cyberpunk city",
    "mountain landscape",
    "cute cat",
    "coffee cup",
    "ocean waves",
    "forest trees",
    "space galaxy",
    "beautiful flower",
    "vintage car",
  ]

  const generateImage = (prompt: string) => {
    setIsGenerating(true)
    const url = generateUltraSmartUrl(prompt)
    setGeneratedUrl(url)
    console.log(`🎯 Generated ULTRA-SMART URL for "${prompt}":`, url)

    // Simulate loading for better UX
    setTimeout(() => {
      setIsGenerating(false)
    }, 1000)
  }

  const testApiGeneration = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: "realistic",
        }),
      })

      if (response.ok) {
        const { jobId } = await response.json()
        console.log(`🎨 Started ULTRA-SMART generation for "${prompt}" with job ID:`, jobId)

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/status/${jobId}`)
            const { status, imageUrl } = await statusResponse.json()

            if (status === "completed") {
              clearInterval(pollInterval)
              setGeneratedUrl(imageUrl)
              setIsGenerating(false)
              console.log(`✅ ULTRA-SMART generation completed for "${prompt}":`, imageUrl)
            } else if (status === "failed") {
              clearInterval(pollInterval)
              setIsGenerating(false)
              console.error(`❌ ULTRA-SMART generation failed for "${prompt}"`)
            }
          } catch (error) {
            console.error("Polling error:", error)
            clearInterval(pollInterval)
            setIsGenerating(false)
          }
        }, 2000)
      }
    } catch (error) {
      console.error("Generation failed:", error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">🎯 Ultra-Smart Generation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Testing ultra-precise prompt matching with multiple fallback strategies!
            </p>

            <div className="flex gap-4 mb-6">
              <Input
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="bg-white/10 border-white/20 text-white"
                disabled={isGenerating}
              />
              <Button
                onClick={() => generateImage(testPrompt)}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
              <Button
                onClick={() => testApiGeneration(testPrompt)}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? "Testing API..." : "Test API"}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {testPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestPrompt(prompt)
                    generateImage(prompt)
                  }}
                  disabled={isGenerating}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {prompt}
                </Button>
              ))}
            </div>

            {generatedUrl && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-4">Ultra-Smart Result for "{testPrompt}":</h3>
                <div className="aspect-video max-w-2xl mx-auto">
                  <EnhancedImage src={generatedUrl} alt={testPrompt} fill className="object-cover rounded-lg" />
                </div>
                <div className="text-xs text-gray-500 mt-2 break-all text-center">{generatedUrl}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">🎯 Ultra-Smart Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 space-y-2">
              <div>
                🔍 <strong>Ultra-Precise Keywords:</strong> Highly specific search terms for each concept
              </div>
              <div>
                🎯 <strong>Multiple Fallbacks:</strong> 3-4 backup strategies per prompt
              </div>
              <div>
                📸 <strong>Optimized Parameters:</strong> Best orientation and size for each image type
              </div>
              <div>
                ⚡ <strong>Instant Results:</strong> No API keys required, works immediately
              </div>
              <div>
                🎨 <strong>Accurate Matching:</strong> Should now show actual sunsets for "sunset"!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
