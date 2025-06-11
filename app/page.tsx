"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
// import GenerationSuccessModal from "@/components/generation-sucess-modal"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  {
    icon: Zap,
    title: "Lightning Fast AI",
    description: "Generate stunning images in seconds with our optimized AI pipeline",
  },
  {
    icon: ImageIcon,
    title: "High-Resolution Output",
    description: "Get crisp, detailed images perfect for any use case",
  },
  {
    icon: Sparkles,
    title: "Personal Gallery",
    description: "Save and organize all your creations in your private gallery",
  },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [generationResult, setGenerationResult] = useState<{ imageUrl: string; prompt: string; style: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // When you get the API response:
  const handleGenerationComplete = (data) => {
    setGenerationResult({
      imageUrl: data.imageUrl, // from your API response
      prompt: data.prompt,
      style: data.style,
    })
    setIsModalOpen(true) // open the modal after setting result
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          DreamFrame
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-10 flex justify-between items-center p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          DreamFrame
        </motion.div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Sign Up
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" variants={fadeInUp}>
          Turn Your{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Words
          </span>
          <br />
          Into Art
        </motion.h1>

        <motion.p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl" variants={fadeInUp}>
          Harness the power of AI to create stunning, unique images from your imagination. No artistic skills required.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 rounded-full group"
            >
              Generate Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose DreamFrame?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* {generationResult && (
        <GenerationSuccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={generationResult.imageUrl}
          prompt={generationResult.prompt}
          style={generationResult.style}
        />
      )} */}
    </div>
  )
}
