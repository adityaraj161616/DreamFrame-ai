"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Share2, Search, Grid, List, RefreshCw } from "lucide-react"
import Link from "next/link"
import EnhancedImage from "@/components/enhanced-image"

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  createdAt: string
  style: string
  provider?: string
}

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchImages()
  }, [])

  const fetchImages = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setImages(data)
        console.log(`📚 Gallery loaded ${data.length} images`)
      }
    } catch (error) {
      console.error("Failed to fetch images:", error)
    } finally {
      setIsLoading(false)
      if (showRefreshing) setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchImages(true)
  }

  const filteredImages = images.filter((image) => image.prompt.toLowerCase().includes(searchTerm.toLowerCase()))

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dreamframe-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-")}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Loading Gallery...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.nav
        className="flex justify-between items-center p-6 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
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
          <Link href="/settings">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Settings
            </Button>
          </Link>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Gallery</h1>
              <p className="text-gray-400">All your AI-generated masterpieces in one place</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              {searchTerm ? `No images found for "${searchTerm}"` : "No images found"}
            </p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Create Your First Image</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={
                  viewMode === "grid"
                    ? "group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    : "flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                }
                whileHover={{ y: viewMode === "grid" ? -5 : 0 }}
              >
                {viewMode === "grid" ? (
                  <>
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
                          onClick={() => downloadImage(image.imageUrl, image.prompt)}
                        >
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
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                      {image.provider && <div className="text-xs text-purple-400 mt-1">via {image.provider}</div>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <EnhancedImage
                        src={image.imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-2 line-clamp-2">{image.prompt}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                        <span>Style: {image.style}</span>
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                      {image.provider && <div className="text-xs text-purple-400 mb-2">via {image.provider}</div>}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => downloadImage(image.imageUrl, image.prompt)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
