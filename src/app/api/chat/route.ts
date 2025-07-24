// import { addItemToList, getListByEmailAndListId, getListByIdAndUserId } from '@/lib/actions';
// import { auth } from '@/lib/auth';
// import { google } from '@ai-sdk/google';
// import { streamText } from 'ai';
// import { z } from 'zod';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;
// // Specify the runtime environment
// export const runtime = "nodejs";
// export async function POST(req: Request) {
//     try {
//         // check auth
//         const session = await auth();
//         if (!session) {
//             return new Response('Unauthorized', { status: 401 });
//         }

//         const { messages, listId } = await req.json();

//         const result = streamText({
//             model: google('gemini-2.0-flash'),
//             system: `You are a helpful AI assistant with broad knowledge and capabilities. You can:

// 1. Have natural conversations about ANY topic - recipes, cooking, general knowledge, advice, entertainment, etc.
// 2. Provide recipe suggestions and cooking tips
// 3. Help with meal planning and food-related questions
// 4. Assist with shopping list management using tools when specifically requested
// 5. Answer general questions about any subject

// IMPORTANT: You are NOT limited to shopping lists only. You can discuss recipes, cooking, and any other topic freely. Only use tools when the user specifically asks to add items to a shopping list.

// Be friendly, helpful, and conversational. If someone asks for recipes or cooking advice, provide it naturally without using any tools.`,
//             tools: {
//                 add_item_to_list: {
//                     description: "Add an item to an existing shopping list",
//                     parameters: z.object({
//                         itemName: z.string(),
//                         amount: z.string(),
//                         price: z.number()
//                     }),
//                     execute: async ({ itemName, amount, price }: { itemName: string, amount: string, price: number }) => {
//                         try {
//                             const result = await addItemToList(listId, {
//                                 name: itemName,
//                                 amount: Number(amount),
//                                 price: price,
//                                 desc: "",
//                                 img: ""
//                             });

//                             if (result?.error) {
//                                 return `Failed to add item: ${result.error}`;
//                             }

//                             return `Successfully added ${itemName} (${amount} units at ₪${price}) to the shopping list.`;
//                         } catch (error) {
//                             console.error('Error adding item to list:', error);
//                             return `Error adding item to list: ${error}`;
//                         }
//                     }
//                 },
//                 add_many_items_to_list: {
//                     description: "Add multiple items to an existing shopping list",
//                     parameters: z.object({
//                         items: z.array(z.object({ name: z.string(), amount: z.string(), price: z.number() }))
//                     }),
//                     execute: async ({ items }: { items: { name: string, amount: string, price: number }[] }) => {
//                         try {
//                             for (const item of items) {
//                                 await addItemToList(listId, {
//                                     name: item.name,
//                                     amount: Number(item.amount),
//                                     price: item.price,
//                                     desc: "",
//                                     img: ""
//                                 });
//                             }
//                             return `Successfully added ${items.length} items to the shopping list.`;
//                         } catch (error) {
//                             console.error('Error adding multiple items to list:', error);
//                             return `Error adding multiple items to list: ${error}`;
//                         }
//                     }
//                 },
//                 get_shopping_list: {
//                     description: "Get the current shopping list, and use to check product existance",
//                     parameters: z.object({}),
//                     execute: async () => {

//                         const list = await getListByIdAndUserId(listId,session?.user?.id as string, session?.user?.email as string)
//                         return `Shopping list: ${list}`;
//                     }
//                 }
//             },
//             messages,
//         });

//         return result.toDataStreamResponse();
//     } catch (error) {
//         console.error('Chat API error:', error);
//         return new Response('Error processing request', { status: 500 });
//     }
// }