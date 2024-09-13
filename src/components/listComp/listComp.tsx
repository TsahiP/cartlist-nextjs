import Link from "next/link";
import { FaTrashArrowUp } from "react-icons/fa6";
import DeleteListBtn from "./deleteListBtn/deleteListBtn";
import { auth } from "@/lib/auth";
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
  sharedFlag: boolean | false;
}
const ListComp = async (props: Props) => {
  console.log("🚀 ~ ListComp ~ props:", props)

  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  // console.log("🚀 ~ MyCarts ~ session:", session?.user?.id);
  const listIdPlainObject = JSON.parse(JSON.stringify(props.list._id));
    
  return (
    <div key={props.index}>
      <div className="bg-white rounded shadow p-4 flex justify-between">
        <Link
          href={{ pathname: `/cart`, query: { listId: listIdPlainObject, shared: props.sharedFlag } }}
        >
          <h2 className="text-lg font-semibold mb-2">{props.list.title}</h2>
        </Link>
        {!props.sharedFlag &&
          <div className="cursor-pointer flex justify-center items-center text-white bg-destructive rounded-full w-8 h-8">
            <DeleteListBtn userEmail={userEmail}  userId={userId} listId={props.list._id} />
          </div>
        }
      </div>
    </div>
  );
};

export default ListComp;
