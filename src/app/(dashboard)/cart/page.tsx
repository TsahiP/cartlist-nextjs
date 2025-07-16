import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartItem";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListByEmailAndListId, getListByIdAndUserId } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareWithDialog } from "@/components/shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
import WhatsappBtn from "@/components/cartList/WhatsappShareBtn";
import MobileFabMenu from "@/components/cartList/MobileFabMenu";
import { ChatWithAI } from "../../../components/chat";
import type { Cart } from "@/types/cart";
import Chat from "@/components/chatAi/chat";
import CartContent from "@/components/cart/CartContent";
import { OptimisticCart, OptimisticItem } from "@/types/cart";

// Define the proper interface for the cart data matching what components expect
interface CartData {
  _id: string;
  title: string;
  amount: number;
  creatorId: string;
  items: Array<{
    _id: string;
    name: string;
    amount: string;
    price: number;
    desc?: string;
    img?: string;
  }>;
  sharedWith: Array<{
    email: string;
    permission: string;
    fullName: string;
    lastName: string;
    firstName: string;
  }>;
}

// Transform server data to optimistic cart format
function transformToOptimisticCart(data: CartData): OptimisticCart {
  return {
    _id: data._id,
    title: data.title,
    amount: data.amount,
    creatorId: data.creatorId,
    items: data.items.map(item => ({
      _id: item._id,
      name: item.name,
      amount: item.amount,
      price: item.price,
      desc: item.desc || "",
      img: item.img || "",
      isOptimistic: false,
      isDeleting: false,
    })),
    sharedWith: data.sharedWith,
  };
}

const Cart = async ({
  searchParams,
}: {
  searchParams: {
    listId: string;
    shared: string;
  };
}) => {
  const session: any = await auth();
  let permissionLevel = "";
  let listData: CartData | null = null;
  
  if (searchParams.shared === "false") {
    const response = await getListByIdAndUserId(
      searchParams.listId,
      session?.user?.id,
      session?.user?.email
    );
    listData = response.success ? (response.data as unknown as CartData) : null;
    permissionLevel = "1";
  }
  
  // load shared list
  if (searchParams.shared === "true") {
    const response = await getListByEmailAndListId(
      session?.user?.email,
      searchParams.listId
    );
    listData = response.success ? (response.data as unknown as CartData) : null;
    permissionLevel = listData?.sharedWith?.[0]?.permission || "";
  }
  
  if (!listData) {
    return (
      <div dir="rtl" className="flex justify-center items-center p-4">
        <div className="bg-white opacity-70 w-full md:w-2/3 sm:w-full p-4 border bor rounded-sm">
          <div className="text-center text-red-500 text-lg">רשימה לא נמצאה</div>
        </div>
      </div>
    );
  }
  
  // Transform data to optimistic format
  const optimisticCart = transformToOptimisticCart(listData);
  
  return (
    <div dir="rtl" className="flex justify-center items-center p-4">
      <CartContent
        listData={optimisticCart}
        session={session}
        searchParams={searchParams}
        permissionLevel={permissionLevel}
      />
    </div>
  );
};

export default Cart;
