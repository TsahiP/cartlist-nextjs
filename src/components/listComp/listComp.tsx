"use client";

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
const ListComp = (props:Props) => {
    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/cart?${props.list._id}`);
    };
  return (
    <div>
      <div onClick={handleClick} key={props?.index} className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">{props.list.title}</h2>
        <ul className="list-disc pl-6">
          {props?.list.items.map((item: any, index: any) => (
            <li key={index} >{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListComp;
