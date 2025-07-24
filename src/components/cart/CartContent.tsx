"use client";
import { Suspense } from "react";
import CartList from "@/components/cartList/cartItem";
import ChatDialog from "@/components/chatAi/ChatDialog";
import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareWithDialog } from "@/components/shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
import WhatsappBtn from "@/components/cartList/WhatsappShareBtn";
import MobileFabMenu from "@/components/cartList/MobileFabMenu";
import { CartOptimisticProvider } from "@/contexts/CartOptimisticProvider";
import { OptimisticCart } from "@/types/cart";

interface CartContentProps {
  listData: OptimisticCart;
  session: any;
  searchParams: {
    listId: string;
    shared: string;
  };
  permissionLevel: string;
}

export default function CartContent({ 
  listData, 
  session, 
  searchParams, 
  permissionLevel 
}: CartContentProps) {
  // const userEmail = session?.user?.email;
  // Not needed for item actions
  const listId = searchParams.listId.toString();

  return (
    <CartOptimisticProvider
      initialCart={listData}
      listId={listId}
    >
      <div className="bg-white opacity-70 w-full md:w-2/3 sm:w-full p-4 border bor rounded-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <CartList
            shared={searchParams.shared}
            session={session}
            data={listData}
          />
          <div className="mt-4">
            <ChatDialog listId={listId} />
          </div>
        </Suspense>
        
        {/* Desktop buttons */}
        <div className="hidden items-center flex-col md:flex-row justify-center gap-5 md:flex">
          <AddItemDialog
            listId={listId}
            permissionLevel={permissionLevel}
          />
          <Button className="w-36 gap-2" asChild>
            <Link href="/carts">
              <IoMdListBox size={20} />
              חזור לרשימות
            </Link>
          </Button>
          <ShareWithDialog
            listId={listId}
            data={listData.sharedWith as any}
            disabled={searchParams.shared === "true"}
          />
        </div>
        
        {/* WhatsApp button */}
        <div className="hidden justify-center mt-4 md:flex">
          <WhatsappBtn items={listData.items} />
        </div>
      </div>
      
      {/* Mobile FAB menu */}
      <MobileFabMenu
        listId={listId}
        permissionLevel={permissionLevel}
        data={listData}
        searchParams={searchParams}
      />
    </CartOptimisticProvider>
  );
} 