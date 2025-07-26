'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OptimisticCart, OptimisticItem } from '@/types/cart';
// Actions are now called via API routes from the client.
import { toast } from 'sonner';

// Define the interface for the raw server data structure.
interface ServerCartItem {
  _id: string;
  name: string;
  amount: number;
  price: number;
  desc?: string;
  img?: string;
}

interface ServerCart {
  _id: string;
  title: string;
  amount: number;
  creatorId: string;
  items?: ServerCartItem[];
  sharedWith?: string[];
}

// Transform server list data to an OptimisticCart with default flags.
function toOptimisticCart(data: ServerCart): OptimisticCart {
  return {
    _id: data._id,
    title: data.title,
    amount: data.amount,
    creatorId: data.creatorId,
    items: (data.items || []).map((item: ServerCartItem) => ({
      _id: item._id,
      name: item.name,
      amount: item.amount,
      price: item.price,
      desc: item.desc || '',
      img: item.img || '',
      isOptimistic: false,
      isDeleting: false,
    })),
    sharedWith: data.sharedWith || [],
  };
}

export function useCart(listId: string, initialCart?: OptimisticCart) {
  return useQuery<OptimisticCart>({
    queryKey: ['cart', listId],
    queryFn: async () => {
      const res = await fetch(`/api/list/${listId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch list');
      const data = await res.json();
      return toOptimisticCart(data);
    },
    initialData: initialCart,
  });
}

export function useCartActions(listId: string) {
  const queryClient = useQueryClient();

  // ------------------ ADD ITEM ------------------
  const addItem = useMutation({
    mutationFn: async (item: Omit<OptimisticItem, '_id'>) => {
      const res = await fetch(`/api/list/${listId}/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          amount: Number(item.amount),
          price: item.price,
          desc: item.desc,
          img: item.img,
        }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      return await res.json();
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ['cart', listId] });

      const previous = queryClient.getQueryData<OptimisticCart>(['cart', listId]);
      const tempId = `temp_${Date.now()}_${Math.random()}`;

      if (previous) {
        queryClient.setQueryData<OptimisticCart>(['cart', listId], {
          ...previous,
          items: [
            ...previous.items,
            { ...item, _id: tempId, isOptimistic: true },
          ],
        });
      }

      return { previous, tempId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', listId], context.previous);
      }
      toast.error('שגיאה בהוספת המוצר');
    },
    onSuccess: () => {
      toast.success('מוצר נוסף בהצלחה');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', listId] });
    },
  });

  // ------------------ DELETE ITEM ------------------
  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/list/${listId}/item/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return await res.json();
    },
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ['cart', listId] });

      const previous = queryClient.getQueryData<OptimisticCart>(['cart', listId]);

      if (previous) {
        queryClient.setQueryData<OptimisticCart>(['cart', listId], {
          ...previous,
          items: previous.items.map((it) =>
            it._id === itemId ? { ...it, isDeleting: true } : it
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', listId], context.previous);
      }
      toast.error('שגיאה במחיקת המוצר');
    },
    onSuccess: () => {
      toast.success('מוצר נמחק בהצלחה');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', listId] });
    },
  });

  return {
    addItemOptimistic: addItem.mutateAsync,
    deleteItemOptimistic: deleteItem.mutateAsync,
    isLoading: addItem.isPending || deleteItem.isPending,
  };
} 