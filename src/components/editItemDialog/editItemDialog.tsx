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
interface AddItemDialogProps {
  itemPrice: number;
  itemName: string;
  itemAmount: number;
  listId: string;
  userId: string;
  itemId: string;
}
const EditItemDialog = ({
  itemAmount,
  itemPrice,
  itemName,
  listId,
  userId,
  itemId,
}: AddItemDialogProps) => {
  const [name, setName] = useState<string>(itemName + "");
  const [amount, setAmount] = useState<number | 1>(itemAmount);
  const [price, setPrice] = useState<number | 1>(itemPrice);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  const saveItem = async () => {
    const item = { name: name, amount: amount, price: price, _id: itemId };
    console.log("🚀 ~ saveItem ~ item:", item);
    console.log(userId, listId);

    await editItemInList(listId, userId, item).then((list)=>{
        console.log(list);
        
    })
    .catch((err) => {
      console.log(err);
      setErrorFlag(true);
    });
  };
  return (
    <Dialog>
      <Button asChild>
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
        <form action={saveItem}>
          <div>
            <label htmlFor="title">שם המוצר</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="title"
              type="text"
              id="title"
            />
          </div>
          <div>
            <label htmlFor="quantity">כמות</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              name="amount"
              type="number"
              id="quantity"
            />
          </div>
          <div>
            <label htmlFor="price">מחיר</label>
            <input
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              name="price"
              type="number"
              id="price"
              value={price}
            />
          </div>

          <Button>עדכן מוצר</Button>
          <DialogClose id="closeDialog" asChild>
            <Button>סגור</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
