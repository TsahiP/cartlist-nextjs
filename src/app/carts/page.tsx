import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import MyCarts from "@/components/myCarts/myCarts";
import React from "react";
import { auth } from "@/lib/auth";
import CreateCartDialog from "@/components/createCartDialog/createCartDialog";
const Carts: React.FC = async () => {
  const session = await auth();

  return (
    <div className=" shadow-md rounded-md p-4">
      <MyCarts />
      <div className="flex justify-center">
        {session?.user?.id ? (
          <CreateCartDialog userId={session?.user?.id} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Carts;
