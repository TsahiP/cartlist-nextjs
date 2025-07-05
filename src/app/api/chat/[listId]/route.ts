import { addItemToList } from '@/lib/actions';
import { auth } from '@/lib/auth';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

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

        const result = streamText({
            model: google('gemini-2.0-flash'),
            system: `You are a helpful AI assistant with broad knowledge and capabilities. You can:

1. Have natural conversations about ANY topic - recipes, cooking, general knowledge, advice, entertainment, etc.
2. Provide recipe suggestions and cooking tips from the internet, but only if the user asks for it.
3. Help with meal planning and food-related questions
4. Assist with shopping list management using tools when specifically requested
5. Answer general questions about any subject

IMPORTANT: You are NOT limited to shopping lists only. You can discuss recipes, cooking, and any other topic freely. Only use tools when the user specifically asks to add items to a shopping list.

Be friendly, helpful, and conversational. If someone asks for recipes or cooking advice, provide it naturally without using any tools.`,
            tools: {
                add_item_to_list: {
                    description: "Add an item to an existing shopping list",
                    parameters: z.object({
                        itemName: z.string(),
                        amount: z.string(),
                        price: z.number()
                    }),
                    execute: async ({ itemName, amount, price }: { itemName: string, amount: string, price: number }) => {
                        try {
                            const result = await addItemToList(listId, { 
                                name: itemName, 
                                amount: Number(amount), 
                                price: price
                            });
                            
                            if (result?.error) {
                                return `Failed to add item: ${result.error}`;
                            }
                            
                            return `Successfully added ${itemName} (${amount} units at ₪${price}) to the shopping list.`;
                        } catch (error) {
                            console.error(`Error adding item to list: ${listId} Error:`, error);
                            return `Error adding item to list: ${error}`;
                        }
                    }
                },
                add_many_items_to_list: {
                    description: "Add multiple items to an existing shopping list, use this tool when the user asks to add multiple items to the list,or the user ask to add a list of items from recipe or other source",
                    parameters: z.object({
                        items: z.array(z.object({ name: z.string(), amount: z.string(), price: z.number() }))
                    }),
                    execute: async ({ items }: { items: { name: string, amount: string, price: number }[] }) => {
                        try {
                            for (const item of items) {
                                await addItemToList(listId, { 
                                    name: item.name, 
                                    amount: Number(item.amount) || 1, 
                                    price: item.price || 0,
                                    desc: "",
                                    img: ""
                                });
                            }
                            return `Successfully added ${items.length} items to the shopping list.`;
                        } catch (error) {
                            console.error('Error adding multiple items to list:', error);
                            return `Error adding multiple items to list: ${error}`;
                        }
                    }
                }
            },
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Error processing request', { status: 500 });
    }
}