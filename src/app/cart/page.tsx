import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import CartList from "@/components/cartList/cartList";
import React from "react";
const cartItems = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];
const Cart: React.FC = () => {
  return (
    <div className=" shadow-md rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Cart List</h2>

      <CartList data={cartItems} />
      {/* {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                    </li>
                ))} */}
      {<AddItemDialog />}
    </div>
  );
};

export default Cart;
