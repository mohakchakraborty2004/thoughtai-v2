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

// function enhancePrompt(basePrompt: string, type: 'logo' | 'banner'): string {
//   const typeSpecificTerms = type === 'logo' 
//     ? 'Create a professional, minimalist, and memorable logo design. The logo should be scalable, with clean lines and a modern aesthetic. It should effectively represent the brand and be easily recognizable at different sizes.'
//     : 'Design an eye-catching, vibrant, and well-composed channel banner. The banner should be visually appealing, incorporate relevant imagery or graphics, and clearly display the channel name. Ensure it adheres to YouTube\'s recommended dimensions (2560x1440 pixels) and safe area guidelines.';
  
//   return `${typeSpecificTerms} The design should represent: ${basePrompt}. Ensure it's suitable for digital platforms and social media. Use appropriate color schemes and typography that align with the brand or channel theme.`;
// }

function enhancePrompt(basePrompt: string, type: 'logo' | 'banner'): string {
  const typeSpecificTerms = type === 'logo'
    ? `Design a professional, minimalist, and memorable logo that represents the brand identity clearly. The logo should feature clean lines, modern aesthetics, and be scalable to various sizes without losing detail or recognition. Focus on creating a versatile design suitable for social media, digital platforms, and print. Ensure the design works well on light and dark backgrounds, and avoid clutter.`
    : `Design a visually captivating, vibrant, and well-balanced channel banner. Incorporate relevant imagery, graphics, and themes that reflect the channel’s content or identity. Follow YouTube's dimensions (2560x1440 pixels) and safe area guidelines (1235x338 pixels). Only include text or logos if specified in the prompt; otherwise, focus on creating a visually compelling, non-text-based design. Ensure the banner remains visually appealing across devices.`;

  return `${typeSpecificTerms} The design should reflect the following concept: ${basePrompt}. Ensure the color schemes, typography, and visual elements are appropriate and aligned with the brand or channel’s theme.`;
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * 10000);
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
    height = 736;
  }

  const seed = getRandomSeed();

  try {
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1.1-pro",
      prompt: prompt,
      steps: 10,
      seed: seed,
      n: 1,  
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

