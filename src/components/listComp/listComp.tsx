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
  // 🚀 ~ ListComp ~ props: {
  //   index: 0,
  //   list: {
  //     _id: new ObjectId('669d36334458a08b42b55b4c'),
  //     title: 'בדיקה',
  //     creatorId: '669d2d114458a08b42b55b0d',
  //     items: [ [Object] ],
  //     sharedWith: [ 'etik@pahima.com', 'test@gmail.com' ],
  //     createdAt: 2024-07-21T16:24:19.204Z,
  //     updatedAt: 2024-07-22T19:58:24.425Z,
  //     __v: 3
  //   },
  //   sharedFlag: true
  // }
  // const router = useRouter();
  const session = await auth();
  // console.log("🚀 ~ MyCarts ~ session:", session?.user?.id);
  const userId = session?.user?.id;
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
          <div>
            <DeleteListBtn userId={userId} listId={props.list._id} />
          </div>
        }
      </div>
    </div>
  );
};

export default ListComp;
