"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddItemDialog from "../addItemDialog/addItemDialog";
import { ShareWithDialog } from "../shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WhatsappBtn from "./WhatsappShareBtn";
interface IMobileFabMenuProps {
  userId: string;
  listId: string;
  permissionLevel: string;
  userEmail: string;
  data: any;
  searchParams: any;
}
const MobileFabMenu: React.FC<IMobileFabMenuProps> = ({ userId, listId, permissionLevel, userEmail, data, searchParams }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOptions = () => {
        setIsOpen(!isOpen);
      };



    return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <div className="relative">
        <button
          className="bg-green-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
          onClick={toggleOptions}
        >
          <FaPlus size={24} />
        </button>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col items-center space-y-4">
            <AddItemDialog
              userId={searchParams.shared === "true" ? data.creatorId : userEmail}
              listId={listId}
              permissionLevel={permissionLevel}
            />
            <Button className="w-36 gap-2" asChild>
              <Link href="/carts">
                <IoMdListBox size={20} />
                חזור לרשימות
              </Link>
            </Button>
            <ShareWithDialog
              ownerEmail={userEmail}
              listId={listId}
              data={data.sharedWith}
              disabled={searchParams.shared === "true"}
            />
            <WhatsappBtn items={data.items} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileFabMenu;
