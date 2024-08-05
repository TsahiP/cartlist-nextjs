"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TbEdit } from "react-icons/tb";
import { editItemInList } from "@/lib/actions";
import { Input } from "../ui/input";
interface AddItemDialogProps {
  itemPrice: number;
  itemName: string;
  itemAmount: number;
  listId: string;
  userId: string;
  itemId: string;
  shared?: string;
  userEmail?: string;
  permissionLevel:string;
}
const EditItemDialog = ({
  itemAmount,
  itemPrice,
  itemName,
  listId,
  userId,
  itemId,
  shared,
  userEmail,
  permissionLevel
}: AddItemDialogProps) => {
  const [name, setName] = useState<string>(itemName + "");
  const [amount, setAmount] = useState<number | 1>(itemAmount);
  const [price, setPrice] = useState<number | 1>(itemPrice);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  
  const saveItem = async (e:any) => {
    e.preventDefault();
    const item = { name: name, amount: amount, price: price, _id: itemId };
    // console.log("🚀 ~ saveItem ~ item:", item);
    console.log(userId, listId);

    await editItemInList(listId, userId, item,shared,userEmail).then((list:any)=>{
        console.log(list);
        closeDialog();
    })
    .catch((err:any) => {
      console.log(err);
      setErrorFlag(true);
    });
  };
  return (
        <Dialog>
      <Button asChild disabled={permissionLevel !=="1"}>
        <DialogTrigger>
          <TbEdit />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">עדכן מוצר קיים</DialogTitle>
          <DialogDescription className="text-center">
            פרטי המוצר
          </DialogDescription>
        </DialogHeader>
        <form
          dir="rtl"
          className="flex flex-col items-center justify-center"
          onSubmit={saveItem}
        >
          <div className="flex flex-col mb-4">
            <label className="ml-5" htmlFor="title">שם המוצר</label>
            <Input
              className="bg-input text-foreground rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="title"
              type="text"
              id="title"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="ml-5" htmlFor="quantity">כמות</label>
            <Input
              className="bg-input text-foreground rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              name="amount"
              type="number"
              id="quantity"
            />
          </div>
          {/* <div className="flex flex-col mb-4">
            <label className="ml-5" htmlFor="price">מחיר</label>
            <Input
              className="bg-input text-foreground rounded"
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              name="price"
              type="number"
              id="price"
              value={price}
            />
          </div> */}
          <Button className="bg-primary text-primary-foreground m-4">עדכן מוצר</Button>
          <DialogClose id="closeDialog" asChild>
            <Button className="text-destructive-foreground">סגור</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
