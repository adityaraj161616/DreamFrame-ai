"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageWithFallbackProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export default function ImageWithFallback({ src, alt, fill, className, width, height }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorCount, setErrorCount] = useState(0)

  const handleError = () => {
    console.log("Image failed to load:", imgSrc)
    setHasError(true)
    setIsLoading(false)
    setErrorCount((prev) => prev + 1)

    // Only try fallbacks if we haven't tried too many times
    if (errorCount < 3) {
      // Generate a fallback image URL
      const fallbackSrc = getFallbackImage(errorCount, alt)
      console.log("Trying fallback image:", fallbackSrc)
      setImgSrc(fallbackSrc)
      setHasError(false)
    }
  }

  const handleLoad = () => {
    console.log("Image loaded successfully:", imgSrc)
    setIsLoading(false)
    setHasError(false)
  }

  // Get a fallback image based on the error count
  const getFallbackImage = (count: number, description: string): string => {
    // Encode the description for use in the URL
    const encodedDesc = encodeURIComponent(description.slice(0, 30))

    switch (count) {
      case 0:
        // First fallback: try a different Picsum URL
        return `https://picsum.photos/512/512?random=${Math.floor(Math.random() * 1000)}`
      case 1:
        // Second fallback: try a placeholder with text
        return `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodedDesc}`
      default:
        // Final fallback: use local placeholder
        return "/placeholder.svg?height=512&width=512"
    }
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        width={!fill ? width || 512 : undefined}
        height={!fill ? height || 512 : undefined}
        className={`${className} ${hasError ? "opacity-0" : "opacity-100"}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
        unoptimized={true} // Skip Next.js image optimization for external URLs
      />

      {hasError && errorCount >= 3 && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center p-4">
            <div>Image unavailable</div>
            <div className="text-xs mt-1">"{alt}"</div>
          </div>
        </div>
      )}
    </div>
  )
}
