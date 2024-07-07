"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { addItemToList } from "@/lib/actions";
const AddItemDialog = async () => {
  const [state, formAction] = useFormState(addItemToList, undefined);
  const session = await auth();
  const userId = session?.user?.id;
  const saveItem = async (item: any) => {
    // console.log("🚀 ~ saveItem ~ item:", item);
    addItemToList(userId,item);
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

        <div>
          <label htmlFor="title">שם המוצר</label>
          <input name="title" type="text" id="title" />
        </div>
        <div>
          <label htmlFor="quantity">כמות</label>
          <input name="amount" type="number" id="quantity" />
        </div>
        <div>
          <label htmlFor="price">מחיר</label>
          <input name="price" type="number" id="price" />
        </div>
        <form action={saveItem}>
          <Button>הוסף מוצר</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
