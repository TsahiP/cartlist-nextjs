import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import MyCarts from "@/components/myCarts/myCarts";
import { useSession } from "next-auth/react";
import React from "react";

const Carts: React.FC = async () => {
  const { data: session, status } = useSession()
  return (
    <div className=" shadow-md rounded-md p-4">
      <MyCarts/>

    </div>
  );
};

export default Carts;
