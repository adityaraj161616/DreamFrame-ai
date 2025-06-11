"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Download, Share2 } from "lucide-react"
import Link from "next/link"
import EnhancedImage from "@/components/enhanced-image"

// Update the generateInstantImage function for better results
function generateInstantImage(prompt: string, style: string): string {
  const promptLower = prompt.toLowerCase()

  // Comprehensive keyword mapping
  const keywordMappings: Record<string, string> = {
    // Nature & Landscapes
    sunset: "sunset,golden hour,evening,sky,horizon,beautiful,landscape",
    sunrise: "sunrise,dawn,morning,sky,horizon,golden,peaceful",
    mountain: "mountain,peak,landscape,nature,scenic,majestic,snow",
    ocean: "ocean,sea,water,waves,beach,blue,peaceful",
    forest: "forest,trees,woods,nature,green,peaceful,wildlife",
    desert: "desert,sand,dunes,arid,landscape,golden,vast",
    lake: "lake,water,reflection,calm,nature,serene,peaceful",
    river: "river,stream,water,flowing,nature,rocks,peaceful",

    // Fantasy & Mythical
    dragon: "dragon,fantasy,mythical,creature,fire,wings,powerful",
    wizard: "wizard,magic,fantasy,mystical,sorcerer,spell,magical",
    castle: "castle,medieval,fortress,architecture,fantasy,stone,ancient",
    fairy: "fairy,magical,fantasy,enchanted,mystical,wings,sparkle",
    unicorn: "unicorn,fantasy,magical,mythical,horse,horn,rainbow",

    // Technology & Sci-Fi
    cyberpunk: "cyberpunk,neon,futuristic,technology,digital,city,lights",
    robot: "robot,android,technology,futuristic,mechanical,artificial,metal",
    spaceship: "spaceship,spacecraft,space,futuristic,technology,stars,galaxy",

    // Urban & Architecture
    city: "city,urban,skyline,buildings,metropolitan,architecture,lights",
    building: "building,architecture,structure,urban,design,modern,glass",
    bridge: "bridge,architecture,structure,engineering,connection,water,span",

    // Animals
    cat: "cat,feline,pet,animal,cute,whiskers,furry",
    dog: "dog,canine,pet,animal,loyal,friendly,furry",
    bird: "bird,flying,wings,nature,wildlife,feathers,sky",
    lion: "lion,big cat,wildlife,majestic,animal,mane,powerful",
    elephant: "elephant,wildlife,large,animal,nature,trunk,majestic",
    tiger: "tiger,big cat,wildlife,stripes,powerful,orange,fierce",

    // Food & Drinks
    coffee: "coffee,drink,cafe,morning,beverage,cup,steam",
    pizza: "pizza,food,italian,cheese,delicious,slice,restaurant",
    cake: "cake,dessert,sweet,celebration,birthday,frosting,delicious",

    // Vehicles
    car: "car,automobile,vehicle,transportation,road,modern,sleek",
    plane: "airplane,aircraft,flying,transportation,sky,wings,travel",
    ship: "ship,boat,water,ocean,transportation,sailing,vessel",

    // Art & Abstract
    abstract: "abstract,artistic,creative,modern,design,colorful,pattern",
    painting: "painting,art,artistic,canvas,creative,brush,masterpiece",

    // Space & Cosmic
    space: "space,galaxy,cosmic,stars,universe,nebula,infinite",
    planet: "planet,space,cosmic,sphere,astronomy,celestial,orbit",

    // Flowers & Plants
    flower: "flower,bloom,nature,colorful,beautiful,petals,garden",
    rose: "rose,flower,red,romantic,beautiful,petals,love",
    tree: "tree,nature,green,forest,growth,leaves,branches",
  }

  // Find the best matching keywords
  let searchTerms = "abstract,artistic,creative,beautiful"
  let matchFound = false

  for (const [key, terms] of Object.entries(keywordMappings)) {
    if (promptLower.includes(key)) {
      searchTerms = terms
      matchFound = true
      break
    }
  }

  // If no specific match, extract important words
  if (!matchFound) {
    const words = promptLower.split(" ")
    const importantWords = words.filter(
      (word) =>
        word.length > 3 &&
        !["with", "and", "the", "a", "an", "in", "on", "at", "to", "for", "of", "by", "very", "really"].includes(word),
    )
    if (importantWords.length > 0) {
      searchTerms = importantWords.slice(0, 3).join(",")
    }
  }

  // Add style-specific terms
  const styleTerms: Record<string, string> = {
    realistic: "photorealistic,detailed,high quality",
    artistic: "artistic,creative,beautiful,masterpiece",
    anime: "anime,manga,japanese,cartoon,illustration",
    cyberpunk: "neon,futuristic,digital,technology",
    fantasy: "magical,mystical,enchanted,fantasy",
  }

  if (styleTerms[style]) {
    searchTerms += "," + styleTerms[style]
  }

  // Generate unique timestamp
  const timestamp = Date.now()

  // Use landscape orientation for better results with nature scenes
  return `https://source.unsplash.com/1024x768/?${encodeURIComponent(searchTerms)}&orientation=landscape&fit=crop&t=${timestamp}`
}

export default function GenerateInstantPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [generatedImages, setGeneratedImages] = useState<Array<{ prompt: string; url: string; style: string }>>([])

  const handleGenerate = () => {
    if (!prompt.trim()) return

    const imageUrl = generateInstantImage(prompt.trim(), selectedStyle)
    const newImage = {
      prompt: prompt.trim(),
      url: imageUrl,
      style: selectedStyle,
    }

    setGeneratedImages((prev) => [newImage, ...prev.slice(0, 8)]) // Keep last 9 images
    console.log(`🎨 Generated instant image for "${prompt}":`, imageUrl)
  }

  const quickPrompts = [
    "beautiful sunset over mountains",
    "majestic dragon in flight",
    "cyberpunk city at night",
    "cute cat sleeping",
    "steaming coffee cup",
    "ocean waves crashing",
    "enchanted forest",
    "abstract colorful art",
    "vintage red car",
    "space galaxy stars",
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          DreamFrame
        </Link>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Gallery
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Generation Form */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              Instant Smart Generation
            </CardTitle>
            <p className="text-center text-gray-400 mt-2">
              Generate images instantly with smart prompt matching - no waiting, no API keys!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Describe your image</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over mountains..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
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
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 text-lg"
            >
              Generate Instantly ⚡
            </Button>

            {/* Quick Prompts */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Quick prompts:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickPrompts.map((quickPrompt) => (
                  <Button
                    key={quickPrompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(quickPrompt)}
                    className="border-white/20 text-white hover:bg-white/10 text-xs"
                  >
                    {quickPrompt}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Your Instant Creations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="aspect-square relative">
                    <EnhancedImage src={image.url} alt={image.prompt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">{image.prompt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{image.style}</span>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
