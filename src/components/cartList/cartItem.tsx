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
import { cn } from "@/lib/utils";
import { OptimisticCart, OptimisticItem } from "@/types/cart";
import { useCart } from "../addItemDialog/use-cart";


interface CartListProps {
  data: OptimisticCart;
  session: any;
  shared?: string;
}

// Mobile Card Component for individual items
const MobileCartItem = ({ 
  item, 
  index, 
  permissionLevel, 
  shared, 
  dataId 
}: {
  item: OptimisticItem;
  index: number;
  permissionLevel: string | undefined;
  shared?: string;
  dataId: string;
}) => (
  <div 
    className={cn(
      "border border-gray-200 rounded-xl p-5 mb-4 bg-white shadow-sm hover:shadow-md transition-all duration-300",
      item.isOptimistic && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 shadow-blue-100",
      item.isDeleting && "opacity-60 bg-red-50 dark:bg-red-900/20 border-red-300 shadow-red-100"
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <h3 className="font-bold text-xl text-right text-gray-800 leading-tight">{item.name}</h3>
            {item.isOptimistic && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></span>
            )}
            {item.isDeleting && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
            )}
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
            #{index + 1}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="text-right bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-500 block font-medium mb-1">מחיר</span>
            <span className="font-bold text-2xl text-green-600">₪{item.price}</span>
          </div>
          <div className="text-right bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-500 block font-medium mb-1">כמות</span>
            <span className="font-bold text-2xl text-blue-600">{item.amount}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
      <div className="transform hover:scale-105 transition-transform duration-200">
        <EditItemDialog
          permissionLevel={permissionLevel}
          itemId={item._id ?? ""}
          itemAmount={parseInt(item.amount as string, 10)}
          itemPrice={item.price ?? 0}
          itemName={item.name}
          listId={dataId}
          shared={shared}
          disabled={item.isOptimistic || item.isDeleting}
        />
      </div>
      <div className="transform hover:scale-105 transition-transform duration-200">
        <DeleteItemButton
          itemId={item._id ?? ""}
          shared={shared}
          permissionLevel={permissionLevel}
          disabled={item.isOptimistic || item.isDeleting}
          listId={dataId}
        />
      </div>
    </div>
  </div>
);

const CartList = (props: CartListProps) => {  
  const { data : cart, isLoading } = useCart({listId:props.data._id,listData:props.data});
  const shared = props.shared;
  const permissionLevel = props.data.sharedWith.filter(e => e.email === props.session.user.email);
  
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg text-right w-[60px] font-semibold">מס</TableHead>
              <TableHead className="text-lg text-right font-semibold">שם מוצר</TableHead>
              <TableHead className="text-lg text-right font-semibold">מחיר</TableHead>
              <TableHead className="text-lg text-right font-semibold">כמות</TableHead>
              <TableHead className="text-lg text-center font-semibold">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(cart?.items)
              ? cart.items.map((item: OptimisticItem, index: number) => (
                  <TableRow 
                    key={item._id} 
                    className={cn(
                      "transition-all duration-300",
                      item.isOptimistic && "bg-blue-50 dark:bg-blue-900/20",
                      item.isDeleting && "opacity-50 bg-red-50 dark:bg-red-900/20"
                    )}
                  >
                    <TableCell className="font-medium text-center">
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
                      <div className="flex items-center justify-center gap-4">
                        <EditItemDialog
                          permissionLevel={permissionLevel[0]?.permission}
                          itemId={item?._id ?? ""}
                          itemAmount={parseInt(item.amount as string, 10)}
                          itemPrice={item.price ?? 0}
                          itemName={item.name}
                          listId={props.data._id}
                          shared={shared}
                          disabled={item.isOptimistic || item.isDeleting}
                        />
                        <DeleteItemButton
                          itemId={item?._id ?? ""}
                          shared={props.shared}
                          permissionLevel={permissionLevel[0]?.permission}
                          disabled={item.isOptimistic || item.isDeleting}
                          listId={props.data._id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  מעדכן...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {Array.isArray(cart?.items) && cart?.items.length > 0 ? (
            cart?.items.map((item: OptimisticItem, index: number) => (
              <MobileCartItem
                key={item._id}
                item={item}
                index={index}
                permissionLevel={permissionLevel[0]?.permission}
                shared={shared}
                dataId={props.data._id}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-lg font-medium">אין פריטים ברשימה</p>
              <p className="text-sm mt-1">הוסף פריט ראשון לרשימה שלך</p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center text-gray-500 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
              <div className="mx-auto w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="font-medium">מעדכן רשימה...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartList;
