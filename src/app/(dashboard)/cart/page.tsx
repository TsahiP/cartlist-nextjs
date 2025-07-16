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

const Cart = async ({
  searchParams,
}: {
  searchParams: {
    listId: string;
    shared: string;
  };
}) => {
  const session: any = await auth();
  const userEmail = session?.user?.email;
  const listId = searchParams.listId.toString();
  let permissionLevel = "";
  // load my list

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
    return <div>List not found</div>;
  }
  
  return (
    <div dir="rtl" className="flex justify-center items-center p-4">
      <div className="bg-white opacity-70 w-full md:w-2/3 sm:w-full p-4 border bor rounded-sm ">
        <Suspense fallback={<div>Loading...</div>}>
          <CartList
            shared={searchParams.shared}
            session={session}
            data={listData}
          />
          <Chat listId={listId} />
        </Suspense>
        {/* buttons */}
        <div className="hidden items-center flex-col md:flex-row  justify-center gap-5  md:flex  ">
          <AddItemDialog
            userId={searchParams.shared === "true" ? listData.creatorId : userEmail}
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
            ownerEmail={userEmail}
            listId={listId}
            data={listData.sharedWith as any}
            disabled={searchParams.shared === "true"}
          />
        </div>
        {/* whatsapp */}
        <div className="hidden justify-center mt-4 md:flex ">
          <WhatsappBtn items={listData.items} />
        </div>
      </div>
      <MobileFabMenu
        userId={searchParams.shared === "true" ? listData.creatorId : userEmail}
        listId={listId}
        permissionLevel={permissionLevel}
        userEmail={userEmail}
        data={listData}
        searchParams={searchParams}
      />
      
    </div>
  );
};

export default Cart;
