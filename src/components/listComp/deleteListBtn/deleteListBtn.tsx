"use client";
import { deleteList } from "@/lib/actions";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

interface Props {
    userId: string | undefined;
    listId: string | undefined;
    userEmail: string | undefined | null;
}

const DeleteListBtn = (props: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteListClicked = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            await deleteList(props.userId, props.listId, props.userEmail);
            // Optionally refresh the page or update the UI
            window.location.reload();
        } catch (error) {
            console.error('Error deleting list:', error);
            // You could add a toast notification here
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <button
            onClick={deleteListClicked}
            disabled={isDeleting}
            className="w-full h-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            title="מחק רשימה"
        >
            <FaTrash className="text-sm" />
        </button>
    );
}

export default DeleteListBtn;