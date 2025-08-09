"use client";
import useSWR from "swr";
import { addItemToList, deleteItemFromList, editItemInList, getListById } from "@/lib/actions";
import { OptimisticCart, OptimisticItem } from "@/types/cart";

export const useCart = ({
  listId,
  listData,
}: {
  listId: string;
  listData?: OptimisticCart;
}) => {
  const { data, isLoading, mutate } = useSWR<OptimisticCart>(
    ["getListById", listId],
    async () => {
      const res = await getListById(listId);
      if (!res.success) throw new Error(res.error || "Failed");
      return res.data as OptimisticCart;
    },
    { fallbackData: listData, revalidateOnFocus: false }
  );

  async function addItem(item: Omit<OptimisticItem, "_id">) {
    const temp: OptimisticItem = { ...item, _id: `temp-${Date.now()}`, isOptimistic: true };

    await mutate(
      async (current) => {
        const res = await addItemToList(listId, item);
        if (!res.success) throw new Error(res.error || "Failed");
        // Use the authoritative server list (contains the real item id)
        return res.data as OptimisticCart;
      },
      {
        // Show the item immediately
        optimisticData: (current?: OptimisticCart) => {
          const base = current ?? data ?? listData;
          if (!base) return undefined as unknown as OptimisticCart;
          return { ...base, items: [...(base.items ?? []), temp] } as OptimisticCart;
        },
        rollbackOnError: true,
        // We already populate the cache from the mutation result
        revalidate: false,
      }
    );
  }
  async function editItem(updated: OptimisticItem) {
    const temp: OptimisticItem = { ...updated, isOptimistic: true };
    await mutate(
      async (current) => {
        const res = await editItemInList(listId, updated);
        if (!res.success) throw new Error(res.error || "Failed");
        return res.data as OptimisticCart;
      },
      {
        optimisticData: (current?: OptimisticCart) => {
          const base = current ?? data ?? listData;
          if (!base) return undefined as unknown as OptimisticCart;
          return {
            ...base,
            items: (base.items ?? []).map((it) =>
              it._id === updated._id ? temp : it
            ),
          } as OptimisticCart;        },
        rollbackOnError: true,
        revalidate: false,
      
      }
    )
  }

  async function deleteItem(itemId: string) {
    await mutate(
      async (current) => {
        if (!current) return current as unknown as OptimisticCart;
        const res = await deleteItemFromList(current._id, itemId);
        if (!res.success) throw new Error(res.error || "Failed");
        return res.data as OptimisticCart;
      },
      {
        optimisticData: (prevData?: OptimisticCart) => {
          if (!prevData) return prevData as unknown as OptimisticCart;
          return {
            ...prevData,
            items: prevData.items.filter((item: any) => item._id !== itemId),
          } as OptimisticCart;
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  return { data, isLoading, addItem, editItem, deleteItem, mutate };
};
