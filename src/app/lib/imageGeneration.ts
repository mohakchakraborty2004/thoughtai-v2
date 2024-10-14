import Together from "together-ai";

const API_KEY = process.env.TOGETHER_API_KEY;

interface GenerationResult {
  index: number;
  url: string;
  timings: any; 
}

export async function generateImage(prompt: string, type: 'logo' | 'banner'): Promise<string> {
  const enhancedPrompt = enhancePrompt(prompt, type);
  const results = await callAPI(enhancedPrompt, type);

  if (results.length === 0 || !results[0].url) {
    throw new Error('Failed to generate any images');
  }

  return results[0].url;
}

function enhancePrompt(basePrompt: string, type: 'logo' | 'banner'): string {
  const typeSpecificTerms = type === 'logo'
    ? 'minimalist, memorable, scalable, professional logo'
    : 'eye-catching, themed, vibrant, well-composed YouTube channel banner';

  return `Create a ${typeSpecificTerms} that represents: ${basePrompt}. 
          Ensure it's suitable for digital platforms and social media.`;
}

async function callAPI(prompt: string, type: 'logo' | 'banner'): Promise<GenerationResult[]> {
  if (!API_KEY) {
    throw new Error('API key not set in environment variables');
  }

  const together = new Together({ apiKey: API_KEY });

  let width, height;
  if (type === 'logo') {
    width = height = 512; 
  } else {
    width = 1280; 
    height = 720;
  }

  try {
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      steps: 4,
      n: 4,  
      width: width,
      height: height
    });

    console.log('Full API Response:', JSON.stringify(response, null, 2));

    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response from API');
    }

    const results: GenerationResult[] = response.data.map((item: any, index: number) => ({
      index: index,
      url: item.url,
      timings: item.timings
    }));

    return results;
  } catch (error) {
    console.error('Error calling image generation API:', error);
    throw error;
  }
}