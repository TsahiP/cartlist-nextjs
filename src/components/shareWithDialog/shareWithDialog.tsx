"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareList } from "@/lib/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { RiUserSharedFill } from "react-icons/ri";

interface IShareData {
  userId: string;
  listId: string;
}

export function ShareWithDialog({ userId, listId }: IShareData) {
  const [email, setEmail] = useState("");

  const shareClick = async () =>{
    console.log("userId: " + userId);
    console.log("listId: " + listId);
    const shareProcess = await shareList(userId, listId, email);
    console.log("🚀 ~ shareClick ~ shareProcess:", shareProcess)
    
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {" "}
          <RiUserSharedFill />
          &nbsp;&nbsp;&nbsp; שתף רשימה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div dir="rtl">
          <DialogHeader className="direction-reverse">
            <div className="text-center">
              <DialogTitle>שיתוף</DialogTitle>
              <DialogDescription>
                אנא הכנס את האימייל של המשתמש איתו תרצה לשתף
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                אימייל
              </Label>
              <Input
                id="email"
                defaultValue="example@example.com"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={shareClick} type="submit">
              <RiUserSharedFill />
              &nbsp;&nbsp;&nbsp;שתף את הרשימה
            </Button>
            <DialogClose>
              <Button>סגור</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
