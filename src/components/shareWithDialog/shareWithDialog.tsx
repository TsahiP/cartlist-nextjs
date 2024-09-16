"use client";
import { Button } from "@/components/ui/button";
import { FaShareAlt } from "react-icons/fa";
import './loader.css';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label";
import { shareList , changePermission} from "@/lib/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { RiUserSharedFill } from "react-icons/ri";
import ShareCart from "../cartList/shareCart/shareCart";

interface ISharedWithData {
  email: string;
  permission: string;
  firstName: string;
  lastName: string;
  fullName: string;
}


interface IShareDataProps {
  listId: string;
  data: [ISharedWithData];
  disabled:boolean;
  userEmail: string;
}

interface IShareStatus {
  error?: string;
  success?: string;
}

export function ShareWithDialog({  listId, data,userEmail ,disabled }: IShareDataProps) {
  const [email, setEmail] = useState("");
  const [shareStatus, setShareStatus] = useState<IShareStatus>({});
  const [loader, setLoader] = useState(false);

  const closeDialog = () => {
    setShareStatus({});
    document.getElementById("closeDialog")?.click();
  };
  // change permission
  const changePermissionHandle = async ( email:string , permission:string) => {
    setLoader(true);
    const permissionLevel = permission === "edit" ? "1" : "2"; 
    const changePermissionProcess = await changePermission( listId, email, permissionLevel,userEmail);
    setLoader(false);
    console.log(changePermissionProcess);


    if (changePermissionProcess?.error) {
      setShareStatus({ error: "שגיאה, משו השתבש אנא נסה מאוחר יותר." });
    }
    if (changePermissionProcess?.status === "success") {
      setShareStatus({ success: "השינוי בוצע בהצלחה" });
      setTimeout(() => {
        // Code to be executed after one second
        // closeDialog();
      }, 1000);
    }
    console.log("🚀 ~ changePermission ~ changePermissionProcess:", changePermissionProcess)

  }
  const shareClick = async () => {
    // console.log("userId: " + userId);
    // console.log("listId: " + listId);
    const shareProcess = await shareList( listId, email, userEmail);
    // console.log(shareProcess);

    if (shareProcess?.error === "Exist") {
      setShareStatus({ error: "שגיאה,יכול להיות כי כבר שותף עם משתמש זה" });

    }
    if (shareProcess?.error === "User not found") {
      setShareStatus({ error: "שגיאה, משתמש לא נמצא" });
    }
    if (shareProcess?.error === "List not found") {
      setShareStatus({ error: "שגיאה, רשימה לא נמצאה" });
    }
    if (shareProcess?.status === "success") {
      setShareStatus({ success: "השיתוף בוצע בהצלחה" });
      setTimeout(() => {
        // Code to be executed after one second
        closeDialog();
      }, 1000);
    }
    console.log("🚀 ~ shareClick ~ shareProcess:", shareProcess)

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2 w-36">
          <RiUserSharedFill size={20} />
          שתף רשימה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* <DialogTitle>
          
        </DialogTitle> */}

        <Card dir="rtl">
          <CardHeader>
          
            <CardTitle className="flex justify-between text-primary">שיתוף רשימה<FaShareAlt /></CardTitle>
            <CardDescription>
              אנא הכנס את האימייל של המשתמש איתו תרצה לשתף
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center  gap-2">
              <Input
                id="email"
                placeholder="example@example.com"
                defaultValue="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={shareClick} type="submit">
                <RiUserSharedFill />
                שתף
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">אנשים בעלי גישה</h4>
              {/* {data} */}
              <div className="grid gap-6">
                {data.map((user, index) =>

                  <div key={user.email} className="flex flex-col md:flex-row items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>{(user.fullName[0] + user.lastName[0]).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {user.firstName + " " + user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                {!loader &&
                    <Select defaultValue="view" value={user.permission === "2" ? "view" : "edit"} onValueChange={e => changePermissionHandle(user.email,e)}>
                      <SelectTrigger className="ml-auto w-[110px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="edit">  עריכה</SelectItem>
                        <SelectItem value="view">צפייה</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                      {loader && <div className="loader"></div>}
                    
                      

                  </div>

                )}

                {/* <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/avatars/05.png" />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Isabella Nguyen
                      </p>
                      <p className="text-sm text-muted-foreground">b@example.com</p>
                    </div>
                  </div>
                  <Select defaultValue="view" >
                    <SelectTrigger  className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Sofia Davis
                      </p>
                      <p className="text-sm text-muted-foreground">p@example.com</p>
                    </div>
                  </div>
                  <Select defaultValue="view">
                    <SelectTrigger className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
            <h2 className="text-red-500 ">
              {shareStatus?.error}
            </h2>
            <h2 className="text-green-500 ">
              {shareStatus?.success}
            </h2>

          </CardContent>
        </Card>
        <DialogClose id="closeDialog" asChild>
          <Button className=" text-destructive-foreground">
            סגור
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
