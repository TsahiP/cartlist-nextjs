import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import MyCarts from "@/components/myCarts/myCarts";
import React from "react";
import { auth } from "@/lib/auth";
import {getSharedCarts} from "@/lib/actions";
import CreateCartDialog from "@/components/createCartDialog/createCartDialog";
const Carts: React.FC = async () => {
  const session = await auth();

  return (
    <div className="   p-4">
      <MyCarts  />
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {session?.user?.id || session?.user?.email ? (
          
          <CreateCartDialog userId={session.user?.id} userEmail={session.user?.email} />
        ) : (
          <></>
        )}
        
      </div>
    </div>
  );
};

export default Carts;
