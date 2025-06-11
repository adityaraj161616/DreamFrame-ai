// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/Providers"
import UserInfo from "@/components/UserInfo"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DreamFrame",
  description: "AI image generator with prompt matching",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-black text-white">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 py-4 bg-black border-b border-white/10">
              <div />
              <UserInfo />
            </header>

            {/* Main content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="w-full text-center text-sm text-gray-400 py-4 border-t border-white/10 bg-black">
              © {new Date().getFullYear()} DreamFrame. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
