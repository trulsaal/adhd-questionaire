import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.LINK_TOKEN_SECRET!; // Store this in .env
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  const { expiresIn = "2h" } = await req.json();

  try {
    // Create token (optionally include other data like surveyId)
    const token = jwt.sign({}, SECRET, { expiresIn });

    // Build link with token as query param
    const link = `${BASE_URL}/survey?token=${token}`;

    return NextResponse.json({ link });
  } catch (err) {
    console.error("Token generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate link" },
      { status: 500 }
    );
  }
}
