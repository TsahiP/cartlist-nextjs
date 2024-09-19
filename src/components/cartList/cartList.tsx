import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddItemDialog from "../addItemDialog/addItemDialog";
import { TbEdit } from "react-icons/tb";
import EditItemDialog from "../editItemDialog/editItemDialog";
import DeleteItemButton from "../deleteItemButton/deleteItemButton";
import DeletePopup from "./popup/deletePopup";
interface SharedWith {
  email: string;
  permission: string;
  fullName: string;
  lastName: string;
  firstName: string;
}
interface Data {
  _id: string;
  title: string;
  amount: number;
  creatorId: string;
  items: Array<{}>;
  sharedWith: Array<SharedWith>; // Assuming sharedWith is an array of user IDs or similar identifiers
}
interface CartListProps {
  data: Data;
  session: any;
  shared?: string;
}

const CartList = (props: CartListProps) => {  
  const userId = props.session.user.id;
  const userEmail = props.session.user.email;
  const shared = props.shared;
  const permissionLevel = props.data.sharedWith.filter(e=>e.email === props.session.user.email);
  // console.log("🚀 ~ CartList ~ permissionLevel:", permissionLevel);
  
  
  return (
    <Table  >
      <TableCaption> </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg text-right w-[30px] font-semibold">מס</TableHead>
          <TableHead className="text-lg text-right font-semibold">שם מוצר</TableHead>
          {/* <TableHead className="text-right">מחיר</TableHead> */}
          <TableHead className="text-lg text-right font-semibold">כמות</TableHead>
          <TableHead className="text-lg text-center font-semibold">פעולות</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(props.data.items)
          ? props.data.items.map((item: any, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {index + 1}
                  
                </TableCell>
                <TableCell>{item.name}</TableCell>
                {/* <TableCell>₪{item.price}</TableCell> */}
                <TableCell>{item.amount}</TableCell>

                <TableCell  >

                  <div className=" flex items-center justify-center flex-col md:gap-4 gap-0  md:flex-row  ">
                    <EditItemDialog
                      permissionLevel={permissionLevel[0]?.permission}
                      itemId={item._id}
                      userId={userId}
                      itemAmount={item.amount}
                      itemPrice={item.price}
                      itemName={item.name}
                      listId={props.data._id}
                      shared={shared}
                      userEmail={userEmail}
                    />
                    <DeleteItemButton
                      userId={userId}
                      listId={props.data._id}
                      itemId={item._id}
                      userEmail={userEmail}
                      shared={props.shared}
                      permissionLevel={permissionLevel[0]?.permission}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          : null}
        <TableRow className="flex flex-1 items-center p-5"></TableRow>
      </TableBody>
    </Table>
  );
};

export default CartList;
