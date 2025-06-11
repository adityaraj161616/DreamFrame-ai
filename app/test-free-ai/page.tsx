"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EnhancedImage from "@/components/enhanced-image"

export default function TestFreeAIPage() {
  const [testPrompt, setTestPrompt] = useState("sunset")
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [provider, setProvider] = useState("")

  const testPrompts = [
    "beautiful sunset over mountains",
    "majestic dragon breathing fire",
    "cyberpunk city with neon lights",
    "cute cat sitting on a windowsill",
    "steaming coffee cup on wooden table",
    "ocean waves crashing on beach",
    "enchanted forest with magical lights",
    "astronaut floating in space",
    "vintage red sports car",
    "colorful abstract art painting",
  ]

  const generateWithAPI = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
        }),
      })

      if (response.ok) {
        const { jobId } = await response.json()
        console.log(`🎨 Started FREE AI generation for "${prompt}" with job ID:`, jobId)

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/status/${jobId}`)
            const { status, imageUrl, provider: resultProvider } = await statusResponse.json()

            if (status === "completed") {
              clearInterval(pollInterval)
              setGeneratedUrl(imageUrl)
              setProvider(resultProvider)
              setIsGenerating(false)
              console.log(`✅ FREE AI generation completed for "${prompt}":`, imageUrl)
            } else if (status === "failed") {
              clearInterval(pollInterval)
              setIsGenerating(false)
              console.error(`❌ FREE AI generation failed for "${prompt}"`)
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

  const generateInstant = (prompt: string) => {
    setIsGenerating(true)

    // Generate instant AI image using Pollinations.ai
    const enhancedPrompt = `${prompt}, ${selectedStyle} style, high quality, detailed, beautiful`
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${Date.now()}`

    setGeneratedUrl(pollinationsUrl)
    setProvider("pollinations-instant")

    console.log(`⚡ Generated instant AI image: ${pollinationsUrl}`)

    // Simulate loading for better UX
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">🤖 Free AI Image Generation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Testing actual AI image generation using free APIs - no more photo searches!
            </p>

            <div className="space-y-4 mb-6">
              <Input
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="bg-white/10 border-white/20 text-white"
                disabled={isGenerating}
              />

              <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isGenerating}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-4">
                <Button
                  onClick={() => generateInstant(testPrompt)}
                  disabled={isGenerating || !testPrompt.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? "Generating..." : "⚡ Generate Instant AI"}
                </Button>
                <Button
                  onClick={() => generateWithAPI(testPrompt)}
                  disabled={isGenerating || !testPrompt.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? "Processing..." : "🤖 Generate with API"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {testPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestPrompt(prompt)
                    generateInstant(prompt)
                  }}
                  disabled={isGenerating}
                  className="border-white/20 text-white hover:bg-white/10 text-xs"
                >
                  {prompt.slice(0, 20)}...
                </Button>
              ))}
            </div>

            {generatedUrl && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-4">
                  AI Generated Image for "{testPrompt}" (via {provider}):
                </h3>
                <div className="aspect-square max-w-md mx-auto">
                  <EnhancedImage src={generatedUrl} alt={testPrompt} fill className="object-cover rounded-lg" />
                </div>
                <div className="text-xs text-gray-500 mt-2 break-all text-center">{generatedUrl}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">🆓 Free AI Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 space-y-2">
              <div>
                🌸 <strong>Pollinations.ai:</strong> Completely free, no API keys, instant results
              </div>
              <div>
                🎨 <strong>Stable Diffusion:</strong> High-quality AI image generation
              </div>
              <div>
                🤖 <strong>DeepAI:</strong> Free tier with good quality images
              </div>
              <div>
                🧠 <strong>Hugging Face:</strong> Free inference API for AI models
              </div>
              <div>
                ✨ <strong>Real AI Generation:</strong> Actually creates images from your prompts!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
