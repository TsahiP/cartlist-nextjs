"use client";
import '../cartList/popup/deletePopup.css';
import { deleteItemFromList } from "@/lib/actions";
import { Button } from "../ui/button";
import { TbTrashXFilled } from "react-icons/tb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface AddItemDialogProps {
  listId: string;
  userId: string;
  itemId: string;
  userEmail: string;
  shared?: string;
}
const DeleteItemButto = (props: AddItemDialogProps) => {
  const [showWindow, setShowWindow] = useState(false);

  const deleteItem = async () => {
    console.log("deleteItem");
    deleteItemFromList(props.userId,props.listId,props.itemId,props.userEmail,props.shared);
    toggleWindow();
  };

  const toggleWindow = () => {
    setShowWindow(!showWindow);
  };


  return (
    <div>
      {/* <Button>
        <TbTrashXFilled />
      </Button> */}
      <Button onClick={toggleWindow}><TbTrashXFilled/></Button>
      {showWindow && (
        <div className="popup">
          <button onClick={deleteItem} className="popup-button agree"><AiOutlineCheckCircle className='icon-button'/></button>
          <button className="popup-button cancel" onClick={toggleWindow}><AiFillCloseSquare className='icon-button' /></button>
        </div>
      )}
    </div>
  );
};

export default DeleteItemButto;
