import { auth } from '@/lib/auth';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { chatTools } from '@/lib/chat-tools';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-system-prompt';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// Specify the runtime environment
// export const runtime = "edge";

export async function POST(req: Request, { params }: { params: { listId: string } }) {
    try {
        // check auth
        const session = auth();
        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { messages } = await req.json();
        const { listId } = params;

        // Bind listId to tool executions
        const toolsWithListId = Object.fromEntries(
            Object.entries(chatTools).map(([key, tool]) => [
                key,
                {
                    ...tool,
                    execute: async (params: any) => tool.execute(params, listId)
                }
            ])
        );

        const result = streamText({
            model: google('gemini-2.0-flash'),
            system: CHAT_SYSTEM_PROMPT,
            tools: toolsWithListId,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Error processing request', { status: 500 });
    }
}