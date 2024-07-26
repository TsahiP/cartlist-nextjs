import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartList";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListByEmailAndListId, getListByIdAndUserId } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareWithDialog } from "@/components/shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
import ShareCart from "@/components/cartList/shareCart/shareCart";


const Cart = async ({
  searchParams,
}: {
  searchParams: {
    listId: string;
    shared: string;
  };
}) => {
  const session: any = await auth();
  const userId = session?.user?.id;
  const listId = searchParams.listId;
  
  // loadmy own list
  let data:any = [];
  if (searchParams.shared === "false") {
     data = await getListByIdAndUserId(
      searchParams.listId,
      session?.user?.id
    );
  }
  // load shared list
  if (searchParams.shared === "true") {
    data = await getListByEmailAndListId(
      session?.user?.email,
     searchParams.listId
   )};
   
 
  return (
    <div dir="rtl" className="  p-4">
      {/* <h2 className="text-center text-xl font-bold mb-4">Cart List</h2> */}
      <Suspense fallback={<div>Loading...</div>}>
        <CartList shared={searchParams.shared} session={session} data={data} />
      </Suspense>
      <div className="flex items-center flex-col  justify-center gap-5 ">
        <AddItemDialog userId={userId} listId={listId} />
        <Button className="w-36" asChild >
          <Link href="/carts"> <IoMdListBox />&nbsp;&nbsp;&nbsp;חזור לרשימות</Link>
        </Button>
        <ShareWithDialog userId={userId} listId={listId} data={data.sharedWith} />
      </div>

    </div>
  );
};

export default Cart;
