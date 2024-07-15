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

interface Data {
  _id: string;
  title: string;
  amount: number;
  creatorId: string;
  items: Array<{}>;
  sharedWith: string[]; // Assuming sharedWith is an array of user IDs or similar identifiers
}
interface CartListProps {
  data: Data;
  session: any;
}

const CartList = (props: CartListProps) => {
  const userId = props.session.user.id;

  return (
    // <div>asdad</div>
    <Table >
      <TableCaption> </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right w-[30px]">מספור</TableHead>
          <TableHead className="text-right ">מוצר</TableHead>
          <TableHead className="text-right">מחיר</TableHead>
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
                <TableCell>₪{item.price}</TableCell>
                <TableCell>{item.amount}</TableCell>

                <TableCell >
                  <div className="flex flex-col justify-between gap-4 w-[45px]">
                    <EditItemDialog

                      itemId={item._id}
                      userId={userId}
                      itemAmount={item.amount}
                      itemPrice={item.price}
                      itemName={item.name}
                      listId={props.data._id}
                    />
                    <DeleteItemButton
                      userId={userId}
                      listId={props.data._id}
                      itemId={item._id}
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
