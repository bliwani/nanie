import { generateImage } from "ai"

// Image generation can take a while; give the route room to finish.
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: unknown }

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "A prompt is required." }, { status: 400 })
    }

    const { image } = await generateImage({
      // Resolved through the Vercel AI Gateway (zero-config for OpenAI).
      model: "openai/gpt-image-1",
      prompt: prompt.trim(),
      size: "1024x1024",
    })

    const mediaType = image.mediaType || "image/png"
    return Response.json({ dataUrl: `data:${mediaType};base64,${image.base64}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed."
    console.log("[v0] image generation error:", message)
    return Response.json({ error: message }, { status: 500 })
  }
}
