"use client";
import React, { createContext, useContext, useOptimistic, useTransition, useCallback, startTransition } from 'react';
import { OptimisticCart, OptimisticItem, CartAction, CartContextType } from '@/types/cart';
import { addItemToList, deleteItemFromList } from '@/lib/actions';
import { toast } from 'sonner';

const CartOptimisticContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: OptimisticCart, action: CartAction): OptimisticCart {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload.item,
            _id: action.payload.tempId,
            isOptimistic: true,
          },
        ],
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, isDeleting: true }
            : item
        ),
      };
    
    case 'CONFIRM_ADD_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.tempId
            ? { ...item, _id: action.payload.actualId, isOptimistic: false }
            : item
        ),
      };
    
    case 'CONFIRM_DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload.itemId),
      };
    
    case 'REVERT_ADD_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload.tempId),
      };
    
    case 'REVERT_DELETE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, isDeleting: false }
            : item
        ),
      };
    
    default:
      return state;
  }
}

interface CartOptimisticProviderProps {
  children: React.ReactNode;
  initialCart: OptimisticCart;
  listId: string;
}

export function CartOptimisticProvider({ 
  children, 
  initialCart, 
  listId
}: CartOptimisticProviderProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCart, setOptimisticCart] = useOptimistic(initialCart, cartReducer);

  const addItemOptimistic = useCallback(async (item: Omit<OptimisticItem, '_id'>) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    
    startTransition(() => {
      setOptimisticCart({ type: 'ADD_ITEM', payload: { item, tempId } });
    });

    try {
      const result = await addItemToList(listId, {
        name: item.name,
        amount: Number(item.amount),
        price: item.price,
        desc: item.desc,
        img: item.img,
      });

      if (result.success && result.data) {
        const newItem = result.data.items[result.data.items.length - 1];
        startTransition(() => {
          setOptimisticCart({
            type: 'CONFIRM_ADD_ITEM',
            payload: { tempId, actualId: newItem._id },
          });
        });
        toast.success('מוצר נוסף בהצלחה');
      } else {
        startTransition(() => {
          setOptimisticCart({ type: 'REVERT_ADD_ITEM', payload: { tempId } });
        });
        toast.error(result.error || 'שגיאה בהוספת המוצר');
      }
    } catch (error) {
      startTransition(() => {
        setOptimisticCart({ type: 'REVERT_ADD_ITEM', payload: { tempId } });
      });
      toast.error('שגיאה בהוספת המוצר');
      console.error('Error adding item:', error);
    }
  }, [listId, setOptimisticCart]);

  const deleteItemOptimistic = useCallback(async (itemId: string) => {
    startTransition(() => {
      setOptimisticCart({ type: 'DELETE_ITEM', payload: { itemId } });
    });

    try {
      const result = await deleteItemFromList(listId, itemId);
      
      if (result && result.success) {
        startTransition(() => {
          setOptimisticCart({ type: 'CONFIRM_DELETE_ITEM', payload: { itemId } });
        });
        toast.success('מוצר נמחק בהצלחה');
      } else {
        startTransition(() => {
          setOptimisticCart({ type: 'REVERT_DELETE_ITEM', payload: { itemId } });
        });
        toast.error('שגיאה במחיקת המוצר');
      }
    } catch (error) {
      startTransition(() => {
        setOptimisticCart({ type: 'REVERT_DELETE_ITEM', payload: { itemId } });
      });
      toast.error('שגיאה במחיקת המוצר');
      console.error('Error deleting item:', error);
    }
  }, [listId, setOptimisticCart]);

  const contextValue: CartContextType = {
    cart: optimisticCart,
    addItemOptimistic,
    deleteItemOptimistic,
    isLoading: isPending,
  };

  return (
    <CartOptimisticContext.Provider value={contextValue}>
      {children}
    </CartOptimisticContext.Provider>
  );
}

export function useCartOptimistic() {
  const context = useContext(CartOptimisticContext);
  if (context === undefined) {
    throw new Error('useCartOptimistic must be used within a CartOptimisticProvider');
  }
  return context;
} 