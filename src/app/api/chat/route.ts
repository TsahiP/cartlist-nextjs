import { auth } from '@/lib/auth';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // check auth
    const session = auth();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();
    
    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: 'You are a helpful assistant.',
      tools: {
        // server-side tool with execute function:
        getWeatherInformation: {
          description: 'show the weather in a given city to the user',
          parameters: z.object({ city: z.string() }),
          execute: async ({}: { city: string }) => {
            const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
            return weatherOptions[
              Math.floor(Math.random() * weatherOptions.length)
            ];
          },
        },
        // client-side tool that starts user interaction:
        askForConfirmation: {
          description: 'Ask the user for confirmation.',
          parameters: z.object({
            message: z.string().describe('The message to ask for confirmation.'),
          }),
        },
        // client-side tool that is automatically executed on the client:
        getLocation: {
          description:
            'Get the user location. Always ask for confirmation before using this tool.',
          parameters: z.object({}),
        },
      },
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}