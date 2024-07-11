import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartList";
import  { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListByIdAndUserId } from "@/lib/actions";
const cartItems = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];

const Cart = async ({ searchParams }: {
  searchParams: {
    listId: string;
  };
}) => {
  const session: any = await auth();
  const userId = session.user.id;
  console.log("🚀 ~ userId:", userId)
  const listId = searchParams.listId;
  console.log("🚀 ~ listId:", listId)
  // console.log("🚀 ~ searchParams:", searchParams)
  // console.log("🚀 ~ constCartsession:", session);

  const data = await getListByIdAndUserId(searchParams.listId, session?.user?.id)
  console.log("🚀 ~ data:", data)

  return (
    <div className=" shadow-md rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Cart List</h2>
      <Suspense fallback={<div>Loading...</div>} >
        <CartList session={session} data={data} />
      </Suspense>
      {/* {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                    </li>
                ))} */}
      <AddItemDialog userId={userId} listId={listId} />
    </div>
  );
};

export default Cart;
