// app/api/sendAnswers/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { dataset, projectId, token } from "@/sanity/env";

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2023-05-03",
  token,
});

export async function POST(request: Request) {
  try {
    const { responses, submittedAt } = await request.json();
    console.log("Received data:", { responses, submittedAt }); // Add this

    if (!Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Responses must be an array" },
        { status: 400 }
      );
    }

    const doc = {
      _type: "surveyResponse",
      responses,
      submittedAt: submittedAt || new Date().toISOString(),
    };

    console.log("Creating document:", doc); // Add this
    const result = await client.create(doc);
    console.log("Sanity response:", result); // Add this

    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error("Full error:", error); // This will show the actual error
    return NextResponse.json(
      {
        error: "Failed to save responses",
        details: error instanceof Error ? error.message : String(error), // Include error details
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
