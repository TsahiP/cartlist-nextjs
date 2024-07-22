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
import { RiUserSharedFill } from "react-icons/ri";


export function ShareWithDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button > <RiUserSharedFill />
        &nbsp;&nbsp;&nbsp;
        שתף רשימה</Button>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <RiUserSharedFill />
              &nbsp;&nbsp;&nbsp;שתף את הרשימה
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
