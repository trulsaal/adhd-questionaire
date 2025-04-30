// File: app/api/verifyToken/route.ts

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.LINK_TOKEN_SECRET!);
    return NextResponse.json({ decoded });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
