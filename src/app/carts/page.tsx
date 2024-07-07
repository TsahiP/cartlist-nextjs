import AddItemDialog from "@/components/addItemDialog/addItemDialog";
import MyCarts from "@/components/myCarts/myCarts";
import React from "react";

const Carts: React.FC = async () => {
  return (
    <div className=" shadow-md rounded-md p-4">
      <MyCarts/>

    </div>
  );
};

export default Carts;
