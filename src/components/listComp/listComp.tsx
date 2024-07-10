"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface List {
    createdAt: Date;
    creatorId: string;
    items: string[];
    sharedWith: string[];
    title: string;
    _id: string;
  }
  
  interface Props {
    index: number;
    list: List;
  }
const ListComp =  (props:Props) => {
    const router = useRouter();
    
    // const handleClick = () => {
    //     router.push(`/cart?listId=${props.list._id}`);
    // };
  return (
    <div key={props.index}>
      <Link href={ {pathname:`/cart`,query:{listId:props.list._id}}}>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">{props.list.title}</h2>
        </div>
      </Link>
    </div>
  );
};

export default ListComp;
