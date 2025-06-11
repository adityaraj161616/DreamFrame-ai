// Image verification and fallback service
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
    })
    return true // If no error thrown, assume it's accessible
  } catch (error) {
    console.log(`Image verification failed for: ${url}`)
    return false
  }
}

export function generateReliableImageUrl(prompt: string, style: string): string {
  // Create a more reliable image URL
  const timestamp = Date.now()
  const seed = Math.abs(hashCode(prompt + style)) % 1000

  // Use a combination approach for better reliability
  const fallbackUrls = [
    `https://picsum.photos/seed/${seed}/512/512`,
    `https://source.unsplash.com/512x512/?abstract,art&sig=${timestamp}`,
    `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent(prompt.slice(0, 20))}`,
  ]

  // Return the most reliable option
  return fallbackUrls[0]
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}
