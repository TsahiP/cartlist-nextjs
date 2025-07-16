"use client";
import "../cartList/popup/deletePopup.css";
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
import { useCartOptimistic } from "@/contexts/CartOptimisticProvider";

interface DeleteItemButtonProps {
  listId: string;
  userId: string;
  itemId: string;
  userEmail: string;
  shared?: string;
  permissionLevel?: string;
  disabled?: boolean;
}

const DeleteItemButton = (props: DeleteItemButtonProps) => {
  const { deleteItemOptimistic, isLoading } = useCartOptimistic();
  const [showWindow, setShowWindow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteItem = async () => {
    setIsDeleting(true);
    try {
      await deleteItemOptimistic(props.itemId);
      setShowWindow(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleWindow = () => {
    if (!props.disabled && !isDeleting) {
      setShowWindow(!showWindow);
    }
  };

  const isButtonDisabled = 
    props.disabled || 
    isDeleting || 
    isLoading ||
    (props.shared !== "false" && props.permissionLevel !== "1");

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-12 h-12"
              disabled={isButtonDisabled}
              onClick={toggleWindow}
            >
              <TbTrashXFilled 
                size={20} 
                className={isDeleting ? "animate-spin" : ""}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDeleting ? "מוחק..." : "מחק"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {showWindow && !isDeleting && (
        <div className="popup left-16">
          <button 
            onClick={deleteItem} 
            className="popup-button agree"
            disabled={isDeleting}
          >
            <AiOutlineCheckCircle className="icon-button" />
          </button>
          <button 
            className="popup-button cancel" 
            onClick={toggleWindow}
            disabled={isDeleting}
          >
            <AiFillCloseSquare className="icon-button" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteItemButton;
