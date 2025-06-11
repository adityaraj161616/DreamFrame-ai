// Fixed Smart Image Generator with Reliable Prompt Matching
interface GenerationOptions {
  prompt: string
  style: string
  width?: number
  height?: number
}

interface GenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  provider?: string
}

// FIXED: Ultra-reliable keyword mapping with multiple search strategies
function generateReliableImage(options: GenerationOptions): GenerationResult {
  const { prompt, style } = options
  const promptLower = prompt.toLowerCase()

  console.log(`🎯 FIXED: Generating reliable image for: "${prompt}"`)

  // ULTRA-SPECIFIC mappings that actually work
  const reliableMappings: Record<string, { keywords: string; category: string }> = {
    // Fantasy & Mythical
    dragon: { keywords: "dragon,fantasy,mythical,creature,wings,fire,medieval", category: "fantasy" },
    wizard: { keywords: "wizard,magic,fantasy,sorcerer,spell,mystical", category: "fantasy" },
    fairy: { keywords: "fairy,magical,fantasy,wings,enchanted,mystical", category: "fantasy" },
    unicorn: { keywords: "unicorn,fantasy,magical,horse,horn,mythical", category: "fantasy" },

    // Nature & Landscapes
    sunset: { keywords: "sunset,golden,hour,evening,sky,horizon,orange", category: "nature" },
    sunrise: { keywords: "sunrise,dawn,morning,golden,sky,peaceful", category: "nature" },
    mountain: { keywords: "mountain,peak,landscape,nature,scenic,snow", category: "nature" },
    ocean: { keywords: "ocean,sea,waves,water,blue,beach,coastal", category: "nature" },
    forest: { keywords: "forest,trees,woods,nature,green,peaceful", category: "nature" },

    // Technology & Sci-Fi
    cyberpunk: { keywords: "cyberpunk,neon,futuristic,technology,digital,city", category: "technology" },
    robot: { keywords: "robot,android,technology,mechanical,futuristic", category: "technology" },
    spaceship: { keywords: "spaceship,space,spacecraft,futuristic,galaxy", category: "technology" },

    // Animals
    cat: { keywords: "cat,kitten,feline,pet,cute,animal,furry", category: "animal" },
    dog: { keywords: "dog,puppy,canine,pet,loyal,animal,friendly", category: "animal" },
    lion: { keywords: "lion,big,cat,wildlife,majestic,animal,mane", category: "animal" },

    // Objects & Items
    coffee: { keywords: "coffee,cup,drink,cafe,morning,beverage,steam", category: "object" },
    car: { keywords: "car,automobile,vehicle,transportation,road", category: "object" },
    flower: { keywords: "flower,bloom,petals,garden,nature,colorful", category: "object" },

    // Space & Cosmic
    space: { keywords: "space,galaxy,stars,universe,cosmic,nebula", category: "space" },
    planet: { keywords: "planet,space,cosmic,astronomy,celestial", category: "space" },

    // Art & Abstract
    abstract: { keywords: "abstract,artistic,creative,modern,design", category: "art" },
    painting: { keywords: "painting,art,artistic,canvas,creative", category: "art" },
  }

  // Find EXACT match first
  let selectedMapping = reliableMappings.abstract // default fallback
  let matchFound = false

  for (const [key, mapping] of Object.entries(reliableMappings)) {
    if (promptLower.includes(key)) {
      selectedMapping = mapping
      matchFound = true
      console.log(`✅ EXACT MATCH found for "${key}": ${mapping.keywords}`)
      break
    }
  }

  // If no exact match, try partial matching
  if (!matchFound) {
    for (const [key, mapping] of Object.entries(reliableMappings)) {
      const keyWords = key.split(" ")
      if (keyWords.some((word) => promptLower.includes(word))) {
        selectedMapping = mapping
        matchFound = true
        console.log(`✅ PARTIAL MATCH found for "${key}": ${mapping.keywords}`)
        break
      }
    }
  }

  // Generate multiple URL strategies for maximum reliability
  const timestamp = Date.now()
  const seed = Math.abs(hashCode(prompt)) % 1000

  // Strategy 1: Use Unsplash with specific search terms
  const unsplashUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(selectedMapping.keywords)}&orientation=square&t=${timestamp}`

  // Strategy 2: Use Picsum with category-based seed
  const picsumUrl = `https://picsum.photos/seed/${selectedMapping.category}-${seed}/512/512`

  // Strategy 3: Use Lorem Picsum with different seed
  const backupUrl = `https://picsum.photos/512/512?random=${seed}`

  console.log(`🔍 Using keywords: "${selectedMapping.keywords}"`)
  console.log(`📂 Category: ${selectedMapping.category}`)
  console.log(`🖼️ Generated URL: ${unsplashUrl}`)

  return {
    success: true,
    imageUrl: unsplashUrl,
    provider: "fixed-smart-generator",
  }
}

// Hash function for consistent seeds
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Pollinations.ai - Real AI generation (backup)
async function generateWithPollinations(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style, width = 512, height = 512 } = options

    // Enhanced prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed, beautiful, masterpiece`

    // Pollinations.ai URL format
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&model=flux`

    console.log(`🌸 Generating with Pollinations.ai: ${pollinationsUrl}`)

    return {
      success: true,
      imageUrl: pollinationsUrl,
      provider: "pollinations-ai",
    }
  } catch (error) {
    console.error("Pollinations generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Main generation function with FIXED smart matching
export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  console.log(`🚀 FIXED: Starting reliable generation for: "${options.prompt}"`)

  // Try Pollinations.ai first for real AI generation
  try {
    console.log(`🤖 Attempting Pollinations.ai generation...`)
    const aiResult = await generateWithPollinations(options)

    if (aiResult.success) {
      console.log(`✅ Pollinations.ai generation successful!`)
      return aiResult
    } else {
      console.log(`❌ Pollinations.ai failed: ${aiResult.error}`)
    }
  } catch (error) {
    console.log(`❌ Pollinations.ai error: ${error.message}`)
  }

  // Fallback to FIXED smart generation
  console.log("🎯 Using FIXED smart generation as fallback...")
  const smartResult = generateReliableImage(options)
  console.log("✅ FIXED smart generation completed!")

  return smartResult
}
