"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Download, Share2, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import EnhancedImage from "@/components/enhanced-image"

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  createdAt: string
  status: "generating" | "completed" | "failed"
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState("")
  const [generationError, setGenerationError] = useState("")
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([])
  const [selectedStyle, setSelectedStyle] = useState("realistic")

  useEffect(() => {
    setMounted(true)
    fetchRecentImages()
  }, [])

  const fetchRecentImages = async () => {
    try {
      const response = await fetch("/api/gallery?limit=6")
      if (response.ok) {
        const images = await response.json()
        setRecentImages(images)
        console.log("📚 Fetched recent images:", images.length)
      }
    } catch (error) {
      console.error("Failed to fetch recent images:", error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationStatus("Initializing your dream...")
    setGenerationError("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
        }),
      })

      if (response.ok) {
        const { jobId } = await response.json()
        pollGenerationStatus(jobId)
      } else {
        throw new Error("Generation failed")
      }
    } catch (error) {
      console.error("Generation failed:", error)
      setIsGenerating(false)
      setGenerationError("Generation failed. Please try again.")
      setGenerationStatus("")
    }
  }

  const pollGenerationStatus = async (jobId: string) => {
    const statusMessages = [
      "🔍 Analyzing your prompt...",
      "🎨 Finding perfect images...",
      "✨ Applying smart matching...",
      "🖼️ Almost ready...",
    ]

    let messageIndex = 0
    const statusInterval = setInterval(() => {
      setGenerationStatus(statusMessages[messageIndex % statusMessages.length])
      messageIndex++
    }, 1500)

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`)
        const { status, imageUrl, error } = await response.json()

        if (status === "completed") {
          clearInterval(pollInterval)
          clearInterval(statusInterval)
          setIsGenerating(false)
          setGenerationStatus("")

          // Clear the prompt
          setPrompt("")

          // Refresh the gallery after a short delay
          setTimeout(() => {
            fetchRecentImages()
          }, 1000)
        } else if (status === "failed") {
          clearInterval(pollInterval)
          clearInterval(statusInterval)
          setIsGenerating(false)
          setGenerationError(error || "Generation failed. Please try again.")
          setGenerationStatus("")
        }
      } catch (error) {
        console.error("Status polling failed:", error)
        clearInterval(pollInterval)
        clearInterval(statusInterval)
        setIsGenerating(false)
        setGenerationError("Connection error. Please try again.")
        setGenerationStatus("")
      }
    }, 2000)

    // Cleanup after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      clearInterval(statusInterval)
      if (isGenerating) {
        setIsGenerating(false)
        setGenerationError("Generation timeout. Please try again.")
        setGenerationStatus("")
      }
    }, 120000)
  }

  const handleDownload = async (url: string, filename = "image.png") => {
    try {
      const response = await fetch(url, { mode: "cors" })
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert("Failed to download image. The image host may block downloads.")
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Loading Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white w-full">
      {/* Navigation */}
      <motion.nav
        className="flex justify-between items-center px-0 py-4 border-b border-white/10 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="flex gap-4 mr-6 ml-6">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            DreamFrame
          </Link>
          <Link href="/gallery">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Gallery
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Settings
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Remove max-w-6xl, mx-auto, p-6 for edge-to-edge black */}
      <div className="w-full flex flex-col items-center">
        {/* Generation Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 w-full max-w-4xl px-4"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-400" />
                Create Your Dream
              </CardTitle>
              <p className="text-center text-gray-400 mt-2">
                Using SMART image generation with real prompt matching - no API keys needed!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Describe your image</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A majestic dragon soaring through a starlit sky, digital art, highly detailed..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
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
              </div>

              <AnimatePresence>
                {(isGenerating || generationStatus || generationError) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`${generationError
                      ? "bg-red-900/20 border-red-500/30"
                      : isGenerating
                        ? "bg-purple-900/20 border-purple-500/30"
                        : "bg-green-900/20 border-green-500/30"
                      } border rounded-lg p-4 text-center`}
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {generationError ? (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      ) : isGenerating ? (
                        <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      <span
                        className={`font-medium ${generationError ? "text-red-300" : isGenerating ? "text-purple-300" : "text-green-300"
                          }`}
                      >
                        {generationError || generationStatus}
                      </span>
                    </div>
                    {isGenerating && (
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>

              {/* Info about generation system */}
              <div className="text-xs text-gray-500 text-center">
                💡 Using SMART prompt matching: Real keyword extraction and image search
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Images */}
        {recentImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-6xl px-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Recent Creations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-square relative">
                    <EnhancedImage
                      src={image.imageUrl || "/placeholder.svg?height=400&width=400"}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/20 backdrop-blur-sm"
                        onClick={() => handleDownload(image.imageUrl, `dreamframe-${image.id}.png`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{image.prompt}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(image.createdAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/gallery">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View All Images
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
