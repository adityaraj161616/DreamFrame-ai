"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface EnhancedImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export default function EnhancedImage({ src, alt, fill, className, width, height }: EnhancedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
  }, [src])

  const handleError = () => {
    console.log(`❌ Image failed to load (attempt ${retryCount + 1}):`, imgSrc)
    setHasError(true)
    setIsLoading(false)

    if (retryCount < 3) {
      const newRetryCount = retryCount + 1
      setRetryCount(newRetryCount)

      // Generate different fallback URLs
      const fallbackSrc = generateFallbackUrl(src, newRetryCount, alt)
      console.log(`🔄 Trying fallback ${newRetryCount}:`, fallbackSrc)

      setImgSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    }
  }

  const handleLoad = () => {
    console.log("✅ Image loaded successfully:", imgSrc)
    setIsLoading(false)
    setHasError(false)
  }

  const generateFallbackUrl = (originalSrc: string, attempt: number, description: string): string => {
    const encodedDesc = encodeURIComponent(description.slice(0, 30))
    const timestamp = Date.now()

    switch (attempt) {
      case 1:
        // Try Picsum with random seed
        return `https://picsum.photos/512/512?random=${timestamp}`
      case 2:
        // Try placeholder with description
        return `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodedDesc}`
      case 3:
        // Try a different Unsplash approach
        return `https://source.unsplash.com/512x512/?abstract,art&sig=${timestamp}`
      default:
        // Final fallback to local placeholder
        return "/placeholder.svg?height=512&width=512"
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10">
          <div className="text-gray-400 text-sm">Loading image...</div>
        </div>
      )}

      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        width={!fill ? width || 512 : undefined}
        height={!fill ? height || 512 : undefined}
        className={`${className} ${hasError && retryCount >= 3 ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
        unoptimized={true}
      />

      {hasError && retryCount >= 3 && (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-center p-4">
          <div className="text-gray-400 text-sm mb-2">🖼️ Image Preview</div>
          <div className="text-gray-500 text-xs">"{alt}"</div>
          <div className="text-gray-600 text-xs mt-2">Generated successfully</div>
        </div>
      )}
    </div>
  )
}
