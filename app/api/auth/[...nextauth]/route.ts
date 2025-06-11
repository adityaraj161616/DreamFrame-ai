import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async signIn({ user, account }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return "/dashboard"  // ✅ Ensures redirect after login
    },
  },
})

export { handler as GET, handler as POST }
