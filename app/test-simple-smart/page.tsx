"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EnhancedImage from "@/components/enhanced-image"

// Simple client-side smart generation for testing
function generateSmartUrl(prompt: string, style: string): string {
  const promptLower = prompt.toLowerCase()

  // Extract keywords based on prompt
  const keywordMappings = {
    sunset: "sunset,golden hour,evening,sky,horizon,beautiful,landscape",
    sunrise: "sunrise,dawn,morning,sky,horizon,golden,peaceful",
    dragon: "dragon,fantasy,mythical,creature,fire,wings,magical",
    cyberpunk: "cyberpunk,neon,futuristic,technology,digital,city,lights",
    city: "city,urban,skyline,buildings,metropolitan,architecture,lights",
    mountain: "mountain,peak,landscape,nature,scenic,majestic,snow",
    ocean: "ocean,sea,water,waves,beach,blue,peaceful",
    forest: "forest,trees,woods,nature,green,peaceful,wildlife",
    cat: "cat,feline,pet,animal,cute,whiskers,furry",
    dog: "dog,canine,pet,animal,loyal,friendly,furry",
    coffee: "coffee,drink,cafe,morning,beverage,cup,steam",
    car: "car,automobile,vehicle,transportation,road,modern,sleek",
    flower: "flower,bloom,nature,colorful,beautiful,petals,garden",
    space: "space,galaxy,cosmic,stars,universe,nebula,infinite",
    abstract: "abstract,artistic,creative,modern,design,colorful,pattern",
  }

  // Find matching keywords
  let searchTerms = "abstract,artistic"
  for (const [key, terms] of Object.entries(keywordMappings)) {
    if (promptLower.includes(key)) {
      searchTerms = terms
      break
    }
  }

  // Generate timestamp for uniqueness
  const timestamp = Date.now()

  // Use landscape orientation for better results with nature scenes
  return `https://source.unsplash.com/1024x768/?${encodeURIComponent(searchTerms)}&orientation=landscape&t=${timestamp}`
}

export default function TestSimpleSmartPage() {
  const [testPrompt, setTestPrompt] = useState("sunset")
  const [generatedUrl, setGeneratedUrl] = useState("")

  const testPrompts = [
    "sunset",
    "dragon",
    "cyberpunk city",
    "mountain landscape",
    "cute cat",
    "coffee cup",
    "ocean waves",
    "forest trees",
    "abstract art",
    "vintage car",
    "space galaxy",
    "beautiful flower",
  ]

  const generateImage = (prompt: string) => {
    const url = generateSmartUrl(prompt, "realistic")
    setGeneratedUrl(url)
    console.log(`🎨 Generated smart URL for "${prompt}":`, url)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">🧠 Simple Smart Generation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Test smart prompt matching without any API calls - instant results!</p>

            <div className="flex gap-4 mb-6">
              <Input
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="bg-white/10 border-white/20 text-white"
              />
              <Button onClick={() => generateImage(testPrompt)} className="bg-purple-600 hover:bg-purple-700">
                Generate
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
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {prompt}
                </Button>
              ))}
            </div>

            {generatedUrl && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-4">Generated Image for "{testPrompt}":</h3>
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
            <CardTitle className="text-white">✅ How This Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 space-y-2">
              <div>
                🔍 <strong>Keyword Detection:</strong> Scans prompt for specific words
              </div>
              <div>
                🎯 <strong>Smart Mapping:</strong> Maps words to relevant search terms
              </div>
              <div>
                📸 <strong>Unsplash Search:</strong> Uses real search API for matching images
              </div>
              <div>
                ⚡ <strong>Instant Results:</strong> No API keys or billing required
              </div>
              <div>
                🎨 <strong>Relevant Images:</strong> Actually matches your prompts!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
