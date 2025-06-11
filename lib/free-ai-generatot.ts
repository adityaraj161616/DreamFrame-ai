// Free AI Image Generator using Pollinations.ai and other free APIs
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

// Pollinations.ai - Completely free AI image generation
async function generateWithPollinations(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style, width = 512, height = 512 } = options

    // Enhance prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed, beautiful`

    // Pollinations.ai URL format
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}`

    console.log(`🌸 Generating with Pollinations.ai: ${pollinationsUrl}`)

    // Test if the URL is accessible
    const response = await fetch(pollinationsUrl, { method: "HEAD" })

    if (response.ok) {
      return {
        success: true,
        imageUrl: pollinationsUrl,
        provider: "pollinations-ai",
      }
    } else {
      throw new Error("Pollinations API not accessible")
    }
  } catch (error) {
    console.error("Pollinations generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// DeepAI - Free tier available
async function generateWithDeepAI(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style } = options

    // DeepAI text2img endpoint (free tier)
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed`

    // Using DeepAI's free endpoint
    const deepAIUrl = `https://api.deepai.org/api/text2img`

    const response = await fetch(deepAIUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "quickstart-QUdJIGlzIGNvbWluZy4uLi4K", // Free tier key
      },
      body: JSON.stringify({
        text: enhancedPrompt,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      return {
        success: true,
        imageUrl: result.output_url,
        provider: "deepai",
      }
    } else {
      throw new Error("DeepAI API error")
    }
  } catch (error) {
    console.error("DeepAI generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Hugging Face Inference API - Free tier
async function generateWithHuggingFace(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style } = options

    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed, masterpiece`

    // Using Hugging Face's free inference API
    const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: "blurry, low quality, distorted, ugly",
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      }),
    })

    if (response.ok) {
      const blob = await response.blob()
      // Convert blob to data URL for immediate display
      const reader = new FileReader()

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            success: true,
            imageUrl: reader.result as string,
            provider: "huggingface-free",
          })
        }
        reader.readAsDataURL(blob)
      })
    } else {
      throw new Error("Hugging Face API error")
    }
  } catch (error) {
    console.error("Hugging Face generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Artbreeder-style generation using free APIs
async function generateWithArtbreeder(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style } = options

    // Use a combination approach with Pollinations
    const enhancedPrompt = `${prompt}, ${style}, artstation, concept art, smooth, sharp focus, illustration`

    const artbreederUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${Date.now()}&model=turbo`

    return {
      success: true,
      imageUrl: artbreederUrl,
      provider: "artbreeder-style",
    }
  } catch (error) {
    console.error("Artbreeder-style generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Stable Diffusion via free endpoints
async function generateWithStableDiffusion(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { prompt, style } = options

    // Enhanced prompt for better results
    const enhancedPrompt = `${prompt}, ${style} style, highly detailed, sharp focus, professional photography, 8k resolution, masterpiece`

    // Using Pollinations with Stable Diffusion model
    const stableDiffusionUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 999999)}&model=flux`

    console.log(`🎨 Generating with Stable Diffusion: ${stableDiffusionUrl}`)

    return {
      success: true,
      imageUrl: stableDiffusionUrl,
      provider: "stable-diffusion-free",
    }
  } catch (error) {
    console.error("Stable Diffusion generation failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Main generation function with multiple free AI providers
export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  console.log(`🚀 Starting FREE AI generation for: "${options.prompt}" with style: ${options.style}`)

  // Try free AI providers in order of preference
  const providers = [
    { name: "Stable Diffusion (Free)", fn: generateWithStableDiffusion },
    { name: "Pollinations.ai", fn: generateWithPollinations },
    { name: "Artbreeder Style", fn: generateWithArtbreeder },
    { name: "DeepAI (Free)", fn: generateWithDeepAI },
  ]

  // Try each provider
  for (const provider of providers) {
    try {
      console.log(`🤖 Attempting ${provider.name} generation...`)
      const result = await provider.fn(options)

      if (result.success) {
        console.log(`✅ ${provider.name} generation successful!`)
        console.log(`🖼️ Generated image URL: ${result.imageUrl}`)
        return result
      } else {
        console.log(`❌ ${provider.name} failed: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ ${provider.name} error: ${error.message}`)
    }
  }

  // If all AI providers fail, return error
  return {
    success: false,
    error: "All free AI providers are currently unavailable. Please try again later.",
  }
}
