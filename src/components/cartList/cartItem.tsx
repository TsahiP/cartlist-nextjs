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
import EditItemDialog from "../editItemDialog/editItemDialog";
import DeleteItemButton from "../deleteItemButton/deleteItemButton";
import { useCart, useCartActions } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

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
  sharedWith: Array<SharedWith>;
}

interface CartListProps {
  data: Data;
  session: any;
  shared?: string;
}

const CartList = (props: CartListProps) => {  
  const listId = props.data._id;
  const { data: cart } = useCart(listId, props.data as any);
  const { isLoading } = useCartActions(listId);
  const shared = props.shared;
  const permissionLevel = props.data.sharedWith.filter(e => e.email === props.session.user.email);
  
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell text-lg text-right w-[30px] font-semibold">מס</TableHead>
          <TableHead className="text-lg text-right font-semibold">שם מוצר</TableHead>
          <TableHead className="text-lg text-right font-semibold">מחיר</TableHead>
          <TableHead className="text-lg text-right font-semibold">כמות</TableHead>
          <TableHead className="text-lg text-center font-semibold">פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(cart?.items)
          ? cart.items.map((item: any, index) => (
              <TableRow 
                key={item._id} 
                className={cn(
                  "transition-all duration-300",
                  item.isOptimistic && "bg-blue-50 dark:bg-blue-900/20",
                  item.isDeleting && "opacity-50 bg-red-50 dark:bg-red-900/20"
                )}
              >
                <TableCell className="hidden md:table-cell font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="relative">
                  {item.name}
                  {item.isOptimistic && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                  {item.isDeleting && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </TableCell>
                <TableCell>₪{item.price}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center flex-col md:gap-4 gap-0 md:flex-row">
                    <EditItemDialog
                      permissionLevel={permissionLevel[0]?.permission}
                      itemId={item._id}
                      itemAmount={parseInt(item.amount)}
                      itemPrice={item.price}
                      itemName={item.name}
                      listId={props.data._id}
                      shared={shared}
                      disabled={item.isOptimistic || item.isDeleting}
                    />
                    <DeleteItemButton
                      listId={listId}
                      itemId={item._id}
                      shared={props.shared}
                      permissionLevel={permissionLevel[0]?.permission}
                      disabled={item.isOptimistic || item.isDeleting}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          : null}
        <TableRow className="flex flex-1 items-center p-5">
          {isLoading && (
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              מעדכן...
            </TableCell>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CartList;
