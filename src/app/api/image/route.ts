// File location: app/api/image/route.ts
// Add HF_API_KEY to your .env.local  →  HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
// Get your free key at: https://huggingface.co/settings/tokens

import { NextRequest, NextResponse } from "next/server";

// FLUX.1-schnell — fast, free, state-of-the-art quality
const HF_MODEL = "black-forest-labs/FLUX.1-schnell";

export const maxDuration = 60;
export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt");
  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "HF_API_KEY not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
  "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  }
);

    if (!response.ok) {
      const text = await response.text();

      // Model is loading — HF cold-starts sometimes take ~20s
      if (response.status === 503) {
        return NextResponse.json(
          { error: "Model is loading, please retry in a few seconds", loading: true },
          { status: 503 }
        );
      }

      throw new Error(`HuggingFace error ${response.status}: ${text}`);
    }

    // Stream the image bytes back to the browser
    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[image/route] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}