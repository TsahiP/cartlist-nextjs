

import Link from "next/link";

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
  const listIdPlainObject = JSON.parse(JSON.stringify(props.list._id));
  return (
    <div key={props.index}>
      <Link href={ {pathname:`/cart`,query:{listId:listIdPlainObject}}}>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">{props.list.title}</h2>
        </div>
      </Link>
    </div>
  );
};

export default ListComp;
