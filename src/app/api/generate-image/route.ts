import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/app/lib/imageGeneration";

export async function POST(req: NextRequest) {
  console.log("Received POST request to generate image");

  try {
    const { prompt, type } = await req.json();
    console.log(`Received prompt: "${prompt}", type: "${type}"`);

    if (!prompt || !type) {
      console.error('Missing prompt or type');
      return NextResponse.json({ error: 'Missing prompt or type' }, { status: 400 });
    }
    
    if (type !== 'logo' && type !== 'banner') {
      console.error(`Invalid type: ${type}`);
      return NextResponse.json({ error: 'Invalid type. Must be "logo" or "banner"' }, { status: 400 });
    }

    console.log("Calling generateImage function");

    const imageUrl = await generateImage(prompt, type as 'logo' | 'banner');

    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.error('Invalid image URL received:', imageUrl);
      return NextResponse.json({ error: 'Failed to generate a valid image URL' }, { status: 500 });
    }

    console.log(`Image generated successfully. URL: ${imageUrl}`);

    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error) {
    console.error('Error generating image:', error);

    let errorMessage = 'Error generating image';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  console.log("Received GET request (not allowed)");
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}