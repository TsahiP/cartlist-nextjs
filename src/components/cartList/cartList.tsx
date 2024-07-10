"use client";
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

interface CartListProps {
  data: Array<{}>;
  session: any;
}

const CartList = (props: CartListProps) => {
  console.log("🚀 ~ CartList ~ props:", props);
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
        {props.data.map((item: any, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{item.name}</TableCell>
            {/* <TableCell>Credit Card</TableCell> */}
            <TableCell>${item.price}</TableCell>
            <TableCell>
              <TbEdit />
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="flex flex-1 items-center p-5">
          {/* {<AddItemDialog />} */}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CartList;
