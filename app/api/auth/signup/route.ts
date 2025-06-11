import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // In production, hash password and save to database
    // const passwordHash = await bcrypt.hash(password, 10)
    // const user = await db.users.create({ name, email, passwordHash })

    // Mock user creation
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
    }

    // In production, create JWT token
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

    const response = NextResponse.json({
      success: true,
      user: mockUser,
    })

    // Set authentication cookie
    response.cookies.set("auth-token", "mock-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
