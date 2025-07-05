import { addItemToList } from '@/lib/actions';
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
            items: z.array(z.object({ name: z.string(), amount: z.string(), price: z.number() }))
        }),
        execute: async ({ items }: { items: { name: string, amount: string, price: number }[] }, listId: string) => {
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
}; 