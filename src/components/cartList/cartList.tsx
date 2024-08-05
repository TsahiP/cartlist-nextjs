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
  console.log("data")
  console.log(props.data);
  console.log(props.session.user.email); 
  
  const userId = props.session.user.id;
  const userEmail = props.session.user.email;
  const shared = props.shared;
  const permissionLevel = props.data.sharedWith.filter(e=>e.email === props.session.user.email)[0].permission;
  console.log("🚀 ~ CartList ~ permissionLevel:", permissionLevel)
  
  return (
    // <div>asdad</div>
    <Table >
      <TableCaption> </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right w-[30px]">מס</TableHead>
          <TableHead className="text-right ">שם מוצר</TableHead>
          {/* <TableHead className="text-right">מחיר</TableHead> */}
          <TableHead className="text-right">כמות</TableHead>
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

                <TableCell >

                  <div className="flex flex-col justify-between  w-[68px]">
                    {/* <DeletePopup/> */}
                    <EditItemDialog
                      permissionLevel={permissionLevel}
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
                      permissionLevel={permissionLevel}
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
