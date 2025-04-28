// app/api/test/route.ts
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const testDoc = {
      _type: "surveyResponse",
      responses: [{ statement: "test", score: 3 }],
      submittedAt: new Date().toISOString(),
    };

    const result = await client.create(testDoc);
    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error("Sanity create error:", error);
    return NextResponse.json(
      {
        error: "Sanity failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
