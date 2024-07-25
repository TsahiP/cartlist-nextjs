import { getCarts } from "@/lib/actions";
import ListComp from "../listComp/listComp";
import { auth } from "@/lib/auth";
import { getSharedCarts } from "@/lib/actions";

const MyCarts = async () => {
    // const router = useRouter();
    const session = await auth();
    // console.log("🚀 ~ MyCarts ~ session:", session?.user?.id);

  // FETCH DATA WITH AN API
  const lists = await getCarts(session?.user?.id);
  // console.log("🚀 ~ MyCarts ~ lists:", lists);
  const sharedCarts = await getSharedCarts(session?.user?.email);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-right">הרשימות שלי</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list: any, index: any) => (
          <ListComp key={index} index={index} list={list} sharedFlag={false} />
        ))}
      </div>
      <div className=" text-center p-5">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-right">רשימות משותפות</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sharedCarts.map((list: any, index: any) => (
          <ListComp key={index} index={index} list={list} sharedFlag={true} />
        ))}
      </div>
    </div>
  );
};

export default MyCarts;
