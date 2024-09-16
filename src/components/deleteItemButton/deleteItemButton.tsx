"use client";
import "../cartList/popup/deletePopup.css";
import { deleteItemFromList } from "@/lib/actions";
import { Button } from "../ui/button";
import { TbTrashXFilled } from "react-icons/tb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface AddItemDialogProps {
  listId: string;
  userId: string;
  itemId: string;
  userEmail: string;
  shared?: string;
  permissionLevel?: string;
}
const DeleteItemButto = (props: AddItemDialogProps) => {
  const [showWindow, setShowWindow] = useState(false);

  const deleteItem = async () => {
    deleteItemFromList(
      props.userId,
      props.listId,
      props.itemId,
      props.userEmail,
      props.shared
    );
    toggleWindow();
  };

  const toggleWindow = () => {
    setShowWindow(!showWindow);
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-12 h-12 "
              disabled={
                props.shared !== "false" && props.permissionLevel !== "1"
              }
              onClick={toggleWindow}
            >
              <TbTrashXFilled size={20}/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>מחק</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {showWindow && (
        <div className="popup left-16">
          <button onClick={deleteItem} className="popup-button agree">
            <AiOutlineCheckCircle className="icon-button" />
          </button>
          <button className="popup-button cancel" onClick={toggleWindow}>
            <AiFillCloseSquare className="icon-button" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteItemButto;
