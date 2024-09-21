"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdAddTask } from "react-icons/md";
import { Button } from "../ui/button";
import { addItemToList } from "@/lib/actions";
import { MdOutlineLibraryAdd } from "react-icons/md";
import axios from "axios";
import { Input } from "../ui/input";
import AutocompleteInput from "./autocomplete";
import { Result, Root } from "../../../types/shufersal";
interface AddItemDialogProps {
  userId: string;
  listId: string;
  permissionLevel?: string;
}
const AddItemDialog = ({
  userId,
  listId,
  permissionLevel,
}: AddItemDialogProps) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number | 1>(1);
  const [price, setPrice] = useState<number | 1>(1);
  const [suggestions, setSuggestions] = useState<Root>();
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };

  const getSearchProductsOptions = async () => {
    try {
      const response = await axios.get(`/api/shufersal?query=${name}`);
      const products : Result = response.data;
      console.log("🚀 ~ getSearchProductsOptions ~ products:", products)

      // setSuggestions(products);
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getSearchProductsOptions();
    console.log("here");
  }, [name]);

  const saveItem = (e: any) => {
    e.preventDefault();
    const item = { name: name, amount: amount, price: price };
    addItemToList(listId, item);
    closeDialog();
  };
  return (
    <Dialog>
      <Button
        disabled={permissionLevel === "1" ? false : true}
        className="w-36 gap-2"
        asChild
      >
        <DialogTrigger>
          <MdOutlineLibraryAdd size={20} />
          הוסף מוצר
        </DialogTrigger>
      </Button>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            הוסף מוצר חדש
          </DialogTitle>
          <DialogDescription className="text-center">
            אנא מלא את הפרטים הבאים
          </DialogDescription>
        </DialogHeader>
        <form
          dir="rtl"
          className="flex flex-col items-center justify-center"
          onSubmit={saveItem}
        >
          <div className="flex flex-col mb-4">
            {/* Add Tailwind margin-bottom class */}
            <label className=" ml-5" htmlFor="title">
              שם המוצר
            </label>
            <Input
              onChange={(e) => setName(e.target.value)}
              name="title"
              type="text"
              id="title"
              className="bg-input text-foreground rounded"
            />
            {/* <AutocompleteInput
              price={price}
              setPrice={setPrice}
              suggestions={suggestions}
              name={name}
              setName={setName}
            /> */}
          </div>
          <div className="flex flex-col mb-4 ">
            {/* Add Tailwind margin-bottom class */}
            <label className="ml-5" htmlFor="quantity">
              כמות
            </label>
            <Input
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              name="amount"
              type="number"
              id="quantity"
              className="bg-input text-foreground rounded "
            />
          </div>
          <div className="flex flex-col mb-4">
            {/* Add Tailwind margin-bottom class */}
            <label className="ml-5" htmlFor="price">
              מחיר ליחידה
            </label>
            <Input
              // onChange={(e) => setPrice(e.target.valueAsNumber)}
              disabled={true}
              name="price"
              type="number"
              step={0.01}
              id="price"
              value={price}
              className="bg-input text-foreground rounded"
            />
          </div>
          <Button className="w-36 bg-primary text-primary-foreground m-4 gap-2">
            <MdAddTask size={20} />
            הוסף מוצר
          </Button>
          <DialogClose id="closeDialog" asChild>
            <Button className="w-36 bg-black hover:bg-destructive text-destructive-foreground gap-2">
              <RiCloseCircleLine size={20} />
              סגור
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
