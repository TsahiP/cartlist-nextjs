import MyCarts from "@/components/myCarts/myCarts";
import React from "react";
import { auth } from "@/lib/auth";
import CreateCartDialog from "@/components/createCartDialog/createCartDialog";
import { redirect } from "next/navigation";
const Carts: React.FC = async () => {
  const session = await auth();
  if (!session ) { redirect("/")}
  return (
    <div className="p-4">
      <MyCarts  />
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CreateCartDialog userId={session?.user?.userId} userEmail={session?.user?.email} />
      </div>
    </div>
  );
};

export default Carts;
