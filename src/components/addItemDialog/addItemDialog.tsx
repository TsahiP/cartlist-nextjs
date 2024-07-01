"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { addItemToList } from "@/lib/actions";
const AddItemDialog = () => {
  const [state,formAction] = useFormState(addItemToList,undefined);
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>הוסף מוצר לרשימה</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader >
          <DialogTitle className="text-center">הוסף מוצר חדש</DialogTitle>
          <DialogDescription className="text-center">אנא מלא את הפרטים הבאים</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div>
            <label htmlFor="name">שם המוצר</label>
            <input name="name" type="text" id="name" />
          </div>
          <div>
            <label htmlFor="quantity">כמות</label>
            <input name="amount" type="number" id="quantity" />
          </div>
          <div>
            <label htmlFor="price">מחיר</label>
            <input name="price" type="number" id="price" />
          </div>
          <Button >הוסף מוצר</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
