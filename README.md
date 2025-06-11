# 🎨 DreamFrame - AI Image Generation App

A full-stack AI image generation application built with Next.js, featuring a cinematic dark theme, smooth animations, and **intelligent image generation**. Turn your words into stunning AI-generated art with a professional, motion-heavy interface.

## ✨ Features

- 🎯 **Smart AI Image Generation** - Uses Replicate API with intelligent fallback
- 🧠 **Intelligent Fallback System** - Generates relevant images when AI is unavailable
- 🎬 **Cinematic UI** - Dark theme with Framer Motion animations
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🖼️ **Personal Gallery** - Save, organize, and manage your creations
- ⚡ **Background Jobs** - Async image processing with status updates
- 💾 **Flexible Storage** - Works with or without MongoDB
- 🎨 **Multiple Styles** - Realistic, artistic, anime, cyberpunk, fantasy

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **shadcn/ui** - High-quality UI components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Replicate API** - Real AI image generation with Stable Diffusion XL
- **Smart Fallback** - Category-based image matching when AI unavailable
- **Flexible Database** - MongoDB (optional) with in-memory fallback

### AI Integration
- **Replicate API** - Production-ready AI image generation
- **Stable Diffusion XL** - High-quality image models
- **Smart Categorization** - Matches prompts to relevant images

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Replicate API account (optional - app works without it)
- MongoDB (optional - app works without it)

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd dreamframe-ai-app
npm install
\`\`\`

### 2. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app in action! 🎉

**The app works immediately without any setup!** It uses an intelligent fallback system that generates relevant images based on your prompts.

## 🎯 How Image Generation Works

### Current Status (Smart Fallback)
- ✅ **Intelligent Categorization** - Analyzes prompts for keywords
- ✅ **Relevant Images** - Maps prompts to appropriate image categories
- ✅ **Consistent Results** - Same prompt always generates same image
- ✅ **High Quality** - Uses Unsplash for relevant stock photos

**Example mappings:**
- "dragon" → Fantasy-themed images
- "cyberpunk city" → Technology/neon images  
- "mountain sunset" → Landscape images
- "anime character" → Portrait images
- "space station" → Galaxy/cosmic images

### Optional: Real AI Generation

To enable **actual AI image generation** with Replicate:

1. **Sign up** at [Replicate.com](https://replicate.com/)
2. **Add billing** at [Replicate Billing](https://replicate.com/account/billing)
3. **Get API token** from [API Tokens](https://replicate.com/account/api-tokens)
4. **Add to environment**:
   \`\`\`env
   # Create .env.local file
   REPLICATE_API_TOKEN=your-token-here
   \`\`\`
5. **Restart the app** - now you get real AI images!

## 💰 Cost Information

### Smart Fallback (Current)
- ✅ **Completely Free**
- ✅ **No API keys needed**
- ✅ **Relevant image matching**
- ✅ **Perfect for development**

### Real AI Generation (Optional)
- 💳 **Replicate**: ~$0.0055 per image
- 🎨 **High quality AI-generated images**
- 🎯 **Exact prompt matching**
- 🚀 **Production ready**

## 🔧 Development Scripts

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

## 📁 Project Structure

\`\`\`
dreamframe-ai-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate/      # Image generation
│   │   ├── gallery/       # Image gallery
│   │   └── status/        # Job status checking
│   ├── dashboard/         # Main generation interface
│   ├── gallery/           # Image gallery page
│   └── ...
├── lib/                   # Utility libraries
│   ├── ai-service.ts      # AI generation service
│   └── database.ts        # Database abstraction
└── README.md
\`\`\`

## 🎨 Customization

### Smart Categorization
Modify the categorization logic in `lib/ai-service.ts`:

\`\`\`typescript
// Add new categories
if (promptLower.includes("your-keyword")) {
  category = "your-category"
  keywords = ["relevant", "keywords"]
}
\`\`\`

### Image Sources
- **Unsplash**: High-quality themed photos
- **Picsum**: Abstract/artistic images
- **Custom**: Add your own image sources

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically (no environment variables needed!)
4. Optionally add `REPLICATE_API_TOKEN` for real AI generation

### Environment Variables (Optional)

\`\`\`env
# Optional: For real AI generation
REPLICATE_API_TOKEN=your-replicate-token

# Optional: For persistent storage
MONGODB_URL=your-mongodb-url

# Optional: For enhanced security
JWT_SECRET=your-jwt-secret
\`\`\`

## 🔍 Troubleshooting

### Replicate "Payment Required" Error
- ✅ **Expected behavior** - Replicate requires billing setup
- ✅ **App still works** - Falls back to smart image matching
- 💡 **To fix**: Add billing to your Replicate account

### Images Don't Match Prompts Exactly
- ✅ **Smart fallback active** - Using relevant stock photos
- 💡 **For exact matching**: Add Replicate API token
- 🎯 **Still relevant** - Images match prompt themes

### MongoDB Authentication Failed
- ✅ **Expected behavior** - Using in-memory storage
- ✅ **App still works** - All functionality available
- 💡 **To fix**: Set up proper MongoDB credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Replicate](https://replicate.com/) for AI model hosting
- [Unsplash](https://unsplash.com/) for high-quality fallback images
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

**Works out of the box with smart image generation! 🎨✨**

No setup required - just run and start creating!
