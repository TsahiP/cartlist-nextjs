import { addItemToList, addManyItemsToList, getListById } from '@/lib/actions';
import { ItemFormData } from '@/lib/types';
import { z } from 'zod';

export const chatTools = {
    add_item_to_list: {
        description: "Add an item to an existing shopping list",
        parameters: z.object({
            name: z.string(),
            amount: z.string(),
            price: z.number()
        }),
        execute: async ({ name, amount, price }: ItemFormData, listId: string) => {
            try {
                const result = await addItemToList(listId, { 
                    name: name, 
                    amount: Number(amount), 
                    price: price
                });
                
                if (result?.error) {
                    return `Failed to add item: ${result.error}`;
                }
                
                return `Successfully added ${name} (${amount} units at ₪${price}) to the shopping list.`;
            } catch (error) {
                console.error(`Error adding item to list: ${listId} Error:`, error);
                return `Error adding item to list: ${error}`;
            }
        }
    },
    add_many_items_to_list: {
        description: "Add multiple items to an existing shopping list, use this tool when the user asks to add multiple items to the list,or the user ask to add a list of items from recipe or other source",
        parameters: z.object({
            items: z.array(z.object({ name: z.string(), amount: z.string().optional(), price: z.number().optional() }))
        }),
        execute: async (
            { items }: { items: { name: string; amount?: string; price?: number }[] },
            listId: string
        ) => {
            try {
                // Normalise & type-cast incoming data
                const normalisedItems = items.map((item) => ({
                    name: item.name,
                    amount: Number(item.amount ?? 1),
                    price: item.price ?? 0,
                    desc: "",
                    img: "",
                }));

                const result = await addManyItemsToList(listId, normalisedItems);

                if (result?.error) {
                    return `Failed to add items: ${result.error}`;
                }

                return `Successfully added ${items.length} items to the shopping list.`;
            } catch (error) {
                console.error("Error adding multiple items to list:", error);
                return `Error adding multiple items to list: ${error}`;
            }
        }
    },
    read_list: {
        description: "Fetch the current shopping list items and details. Use when the user asks to view or reference the list contents.",
        parameters: z.object({}), // no additional parameters besides implicit listId
        execute: async (_: Record<string, never>, listId: string) => {
            try {
                const result = await getListById(listId);

                if (result?.error || !result.data) {
                    return `Failed to fetch list: ${result.error}`;
                }

                const items = result.data.items ?? [];

                if (items.length === 0) {
                    return "The shopping list is currently empty.";
                }

                // Build a human-readable summary
                const summary = items
                    .map((item: any, idx: number) =>
                        `${idx + 1}. ${item.name} – ${item.amount} units at ₪${item.price}`
                    )
                    .join("\n");

                return `Here are the current items in the shopping list:\n${summary}`;
            } catch (error) {
                console.error("Error reading list:", error);
                return `Error reading list: ${error}`;
            }
        }
    }
}; 