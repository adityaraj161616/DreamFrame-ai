"use client"

import { useSession, signOut } from "next-auth/react"

export default function UserInfo() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="flex items-center gap-3 text-white">
      <img
        src={session.user?.image || "/default-avatar.png"}
        alt="Profile"
        className="w-8 h-8 rounded-full border border-white"
      />
      <span className="text-sm">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="text-sm text-red-400 hover:underline"
      >
        Sign Out
      </button>
    </div>
  )
}
