import { getCarts } from "@/lib/actions";
import { useRouter } from "next/navigation";
import ListComp from "../listComp/listComp";

// const getlists = async () => {
//   try {
//     // const res = await fetch("https://tpnext-six.vercel.app/api/blog", {
//     //   next: { revalidate: 3600 },
//     // });
//     const res = await fetch(`${process.env.BASE_URL}/api/lists`,{next: {revalidate:3600}});
//     return await res.json();
//   } catch (err) {
//     console.log(err);
//   }

//   // if (!res.ok) {
//   //   // console.log(res.urlList);
//   //   // throw new Error("Something went wrong");
//   // }
// };
const MyCarts = async () => {
  // const router = useRouter();

  // FETCH DATA WITH AN API
  const lists = await getCarts();
  console.log("🚀 ~ MyCarts ~ lists:", lists);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Carts</h1>
      <div className="space-y-4">
        {lists.map((list: any, index: any) => (
          <ListComp index={index} list={list}/>
          // <div key={index} className="bg-white rounded shadow p-4">
          //   <h2 className="text-lg font-semibold mb-2">{list.title}</h2>
          //   <ul className="list-disc pl-6">
          //     {list.items.map((item: any, index: any) => (

          //       <li key={index} >{item.id}</li>
          //     ))}
          //   </ul>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default MyCarts;
