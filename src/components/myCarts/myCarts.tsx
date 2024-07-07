import { getCarts } from "@/lib/actions";
import { useRouter } from "next/navigation";
import ListComp from "../listComp/listComp";
import { auth } from "@/lib/auth";


const MyCarts = async () => {
  // const router = useRouter();
  const session = await auth();
  console.log("🚀 ~ MyCarts ~ session:", session?.user?.id);
  const userId = session?.user?.id;
  // FETCH DATA WITH AN API
  const lists = await getCarts(session?.user?.id);
  console.log("🚀 ~ MyCarts ~ lists:", lists);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Carts</h1>
      <div className="space-y-4">
        {lists.map((list: any, index: any) => (
          <ListComp userId={userId} index={index} list={list}/>
        ))}
      </div>
    </div>
  );
};

export default MyCarts;
