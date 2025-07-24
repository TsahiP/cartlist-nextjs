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
import { createList } from "@/lib/actions";
import { Input } from "../ui/input";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const CreateCartDialog = () => {
  const [name, setName] = useState<string>("");
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  const saveItem = (e: any) => {
    e.preventDefault();
    if (!name) return;
    createList(name);
    closeDialog();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <MdOutlinePlaylistAdd size={24} />
          צור רשימה חדשה
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-center">יצירת רשימה חדשה</DialogTitle>
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
            <label className=" ml-5" htmlFor="title">
              שם הרשימה
            </label>
            <Input
              onChange={(e) => setName(e.target.value)}
              name="title"
              type="text"
              id="title"
              className="bg-input text-foreground rounded"
            />
          </div>

          {/* <div className="flex flex-col mb-4">

            <label className="ml-5" htmlFor="price">
              מחיר
            </label>
            <Input
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              name="price"
              type="number"
              id="price"
              className="bg-input text-foreground rounded"
            />
          </div> */}
          <Button className="bg-primary text-primary-foreground m-4">
            הוסף רשימה
          </Button>
          <DialogClose id="closeDialog" asChild>
            <Button className=" text-destructive-foreground">סגור</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCartDialog;
