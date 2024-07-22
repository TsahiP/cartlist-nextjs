import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import MyCarts from "@/components/myCarts/myCarts";
import React from "react";
import { auth } from "@/lib/auth";
import {getSharedCarts} from "@/lib/actions";
import CreateCartDialog from "@/components/createCartDialog/createCartDialog";
const Carts: React.FC = async () => {
  const session = await auth();

  // console.log(session?.user?.email);
  
  return (
    <div className="   p-4">
      <MyCarts  />
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
