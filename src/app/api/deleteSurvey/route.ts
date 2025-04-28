import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  apiVersion: "2023-05-03",
});

export async function POST(request: Request) {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  try {
    const body = await request.json().catch(() => null);
    if (!body?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Missing document ID" }),
        {
          status: 400,
          headers,
        }
      );
    }

    await client.delete(body.id);

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Delete failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
}
