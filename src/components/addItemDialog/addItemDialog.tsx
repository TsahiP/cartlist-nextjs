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
import { auth } from "@/lib/auth";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { addItemToList } from "@/lib/actions";
interface AddItemDialogProps {
  userId: string;
  listId: string;
}
const AddItemDialog = ({ userId, listId }: AddItemDialogProps) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number | 1>(1);
  const [price, setPrice] = useState<number | 1>(1);
  // const [state, formAction] = useFormState(addItemToList, undefined);
  // const session = await auth();
  // const userId = session?.user?.id;
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  const saveItem = () => {
    const item = { name: name, amount: amount, price: price };
    console.log("🚀 ~ saveItem ~ item:", item);
    addItemToList(listId, userId, item);
    console.log("here :", userId, listId);
    closeDialog();
  };
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>הוסף מוצר לרשימה</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">הוסף מוצר חדש</DialogTitle>
          <DialogDescription className="text-center">
            אנא מלא את הפרטים הבאים
          </DialogDescription>
        </DialogHeader>
        <form action={saveItem}>
          <div>
            <label htmlFor="title">שם המוצר</label>
            <input
              onChange={(e) => setName(e.target.value)}
              name="title"
              type="text"
              id="title"
            />
          </div>
          <div>
            <label htmlFor="quantity">כמות</label>
            <input
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
            />
          </div>
          
            <Button>הוסף מוצר</Button>
            <DialogClose id="closeDialog" asChild>
              <Button>סגור</Button>
            </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
