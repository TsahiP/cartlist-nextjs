"use client";
import { deleteList } from "@/lib/actions";
import { FaTrashArrowUp } from "react-icons/fa6";
interface Props {
    userId: string | undefined;
    listId: string | undefined;
    userEmail: string | undefined;
}
const DeleteListBtn = (props:Props) => {

    const deleteListClicked = async () => {
        const removeReq = await deleteList(props.userId, props.listId, props.userEmail);
    }
    return (
        <>
            <FaTrashArrowUp  onClick={deleteListClicked}/>

        </>

    )
}

export default DeleteListBtn