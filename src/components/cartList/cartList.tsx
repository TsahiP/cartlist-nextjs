// "use client";
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
interface Data {
  _id: string;
  title: string;
  creatorId: string;
  items: Array<{}>;
  sharedWith: string[]; // Assuming sharedWith is an array of user IDs or similar identifiers

}
interface CartListProps {
  data: Data;
  session: any;
}

const CartList = (props: CartListProps) => {
  console.log("🚀 ~ CartList ~ props:", props);
  console.log(props.data.items);
  
  console.log(props.session.user.id);

  return (
    // <div>asdad</div>
    <Table>
      <TableCaption> </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">מספור</TableHead>
          <TableHead>מוצר</TableHead>
          <TableHead>מחיר</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {Array.isArray(props.data.items) ? props.data.items.map((item: any, index) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>${item.price}</TableCell>
      <TableCell>
        <TbEdit />
      </TableCell>
    </TableRow>
  )) : null}
        <TableRow className="flex flex-1 items-center p-5">
          {/* {<AddItemDialog />} */}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CartList;
