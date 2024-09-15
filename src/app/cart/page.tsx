import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartList";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListByEmailAndListId, getListByIdAndUserId } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShareWithDialog } from "@/components/shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";

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
  const userEmail = session?.user?.email;

  const listId = searchParams.listId.toString();

  // load my list
  let data: any = [];
  if (searchParams.shared === "false") {
    data = await getListByIdAndUserId(
      searchParams.listId,
      session?.user?.id,
      session?.user?.email
    );
    console.log(data);
  }
  // load shared list
  if (searchParams.shared === "true") {
    data = await getListByEmailAndListId(
      session?.user?.email,
      searchParams.listId
    );
  }

  return (
    <div dir="rtl" className="flex justify-center items-center p-4">
      {/* right */}
      <div className=" w-full md:w-2/3 sm:w-full p-4 border bor rounded-sm">
        {/* <h2 className="text-center text-xl font-bold mb-4">Cart List</h2> */}
        <Suspense fallback={<div>Loading...</div>}>
          <CartList
            shared={searchParams.shared}
            session={session}
            data={data}
          />
        </Suspense>
        <div className="flex items-center flex-col md:flex-row  justify-center gap-5 ">
          <AddItemDialog
            userId={
              searchParams.shared === "true"
                ? data.creatorId
                : userId ?? userEmail
            }
            listId={listId}
          />
          <Button className="w-36 gap-2" asChild>
            <Link href="/carts">
              <IoMdListBox  size={20}/>
             חזור לרשימות
            </Link>
          </Button>
          <ShareWithDialog
            userEmail={userEmail}
            userId={userId}
            listId={listId}
            data={data.sharedWith}
          />
        </div>
      </div>
      {/* Left */}
    </div>
  );
};

export default Cart;
