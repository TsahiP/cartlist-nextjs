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
}
const ListComp = async (props: Props) => {
  // const router = useRouter();
  const session = await auth();
  // console.log("🚀 ~ MyCarts ~ session:", session?.user?.id);
  const userId = session?.user?.id;
  const listIdPlainObject = JSON.parse(JSON.stringify(props.list._id));
  return (
    <div key={props.index}>
      <div className="bg-white rounded shadow p-4 flex justify-between">
        <Link
          href={{ pathname: `/cart`, query: { listId: listIdPlainObject } }}
        >
          <h2 className="text-lg font-semibold mb-2">{props.list.title}</h2>
        </Link>
        <div>
          <DeleteListBtn userId={userId} listId={props.list._id} />
        </div>
      </div>
    </div>
  );
};

export default ListComp;
