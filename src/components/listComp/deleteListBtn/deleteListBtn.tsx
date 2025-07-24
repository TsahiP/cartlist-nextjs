"use client";
import { deleteList } from "@/lib/actions";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

interface Props {
    listId: string;
}

const DeleteListBtn = ({ listId }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteListClicked = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteList(listId);
            // Optionally refresh the page or update the UI
            window.location.reload();
        } catch (error) {
            console.error("Error deleting list:", error);
        } finally {
            setIsDeleting(false);
        }
    };

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
};

export default DeleteListBtn;