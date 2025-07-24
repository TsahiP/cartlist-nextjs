import { addItemToList, addManyItemsToList, getListById, deleteItemFromList } from '@/lib/actions';
import { auth } from '@/lib/auth';
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
        description: "Fetch the current shopping list items and details.use if user want you to check if item exist and if there is a duplicates , use when user ask if item exist in the list or ask for the list contents , Use when the user asks to view or reference the list contents.",
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
    },
    delete_item_from_list: {
        description: "Delete a single item from the current shopping list.",
        parameters: z.object({
            name: z.string().describe("The name of the item to delete"),
        }),
        execute: async (
            { name }: { name: string },
            listId: string
        ) => {
            try {
                // Get current user session for permission checks
                const session = await auth();
                console.log("🚀 ~ session:", session)
                const userId = (session as any)?.user?.id as string | undefined;
                const userEmail = (session as any)?.user?.email as string | undefined;

                // Retrieve the list to determine shared status and locate item ID
                const listRes = await getListById(listId);
                if (listRes.error || !listRes.data) {
                    return `Failed to fetch list: ${listRes.error}`;
                }

                const list = listRes.data;
                const sharedFlag = list.creatorId !== userId ? "true" : undefined;

                const item = list.items.find((i: any) =>
                    i.name.toLowerCase() === name.toLowerCase()
                );

                if (!item) {
                    return `Item '${name}' not found in the shopping list.`;
                }

                const result = await deleteItemFromList(
                    userId ?? "",
                    listId,
                    (item as any)._id ?? (item as any).id,
                    userEmail ?? "",
                    sharedFlag
                );

                if (result?.error) {
                    return `Failed to delete item: ${result.error}`;
                }

                return `Successfully deleted '${name}' from the shopping list.`;
            } catch (error) {
                console.error("Error deleting item from list:", error);
                return `Error deleting item from list: ${error}`;
            }
        }
    },
    search_items_in_list: {
        description: "Search for one or multiple products inside the current shopping list and report if they exist and how many duplicates there are. Use when the user asks whether a product is already in the list.",
        parameters: z.object({
            names: z.array(z.string()).min(1).describe("List of product names to search for"),
        }),
        execute: async (
            { names }: { names: string[] },
            listId: string
        ) => {
            try {
                const { error, data } = await getListById(listId);
                if (error || !data) {
                    return `Failed to fetch list: ${error}`;
                }

                const items = data.items ?? [];

                const lowercaseNames = names.map((n) => n.toLowerCase());

                const results = lowercaseNames.map((searchName) => {
                    const matchedItems = items.filter(
                        (item: any) => item.name?.toLowerCase() === searchName
                    );
                    if (matchedItems.length === 0) {
                        return `❌ '${searchName}' is not in the list.`;
                    }
                    if (matchedItems.length === 1) {
                        const item = matchedItems[0];
                        return `✅ '${item.name}' exists (amount: ${item.amount}, price: ₪${item.price}).`;
                    }
                    // duplicates
                    const totalAmount = matchedItems.reduce(
                        (sum: number, m: any) => sum + Number(m.amount ?? 0),
                        0
                    );
                    return `⚠️ '${searchName}' appears ${matchedItems.length} times with a total amount of ${totalAmount}.`;
                });

                return results.join("\n");
            } catch (err) {
                console.error("Error searching items in list:", err);
                return `Error searching items in list: ${err}`;
            }
        }
    }
}; 