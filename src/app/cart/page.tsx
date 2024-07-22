import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartList";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListByIdAndUserId } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareWithDialog } from "@/components/shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
const cartItems = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];

const Cart = async ({
  searchParams,
}: {
  searchParams: {
    listId: string;
  };
}) => {
  const session: any = await auth();
  const userId = session?.user?.id;
  const listId = searchParams.listId;
  const data = await getListByIdAndUserId(
    searchParams.listId,
    session?.user?.id
  );

  return (
    <div dir="rtl" className="  p-4">
      {/* <h2 className="text-center text-xl font-bold mb-4">Cart List</h2> */}
      <Suspense fallback={<div>Loading...</div>}>
        <CartList session={session} data={data} />
      </Suspense>
      <div className="flex items-center flex-col  justify-center gap-5 ">
        <AddItemDialog   userId={userId} listId={listId} />
        <Button className="w-36" asChild >
          <Link  href="/carts"> <IoMdListBox  />&nbsp;&nbsp;&nbsp;חזור לרשימות</Link>
        </Button>
        <ShareWithDialog/>
      </div>
    </div>
  );
};

export default Cart;
