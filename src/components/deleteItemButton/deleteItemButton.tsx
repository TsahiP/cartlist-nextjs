"use client";

import { deleteItemFromList } from "@/lib/actions";
import { Button } from "../ui/button";
import { TbTrashXFilled } from "react-icons/tb";

interface AddItemDialogProps {
  listId: string;
  userId: string;
  itemId: string;
  userEmail: string;
  shared?: string;
}
const DeleteItemButto = (props: AddItemDialogProps) => {
  const deleteItem = async () => {
    console.log("deleteItem");
    deleteItemFromList(props.userId,props.listId,props.itemId,props.userEmail,props.shared);
  };
  return (
    <form action={deleteItem}>
      <Button>
        <TbTrashXFilled />
      </Button>
    </form>
  );
};

export default DeleteItemButto;
