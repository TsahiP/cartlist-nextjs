"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddItemDialog from "../addItemDialog/addItemDialog";
import { ShareWithDialog } from "../shareWithDialog/shareWithDialog";
import { IoMdListBox } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WhatsappBtn from "./WhatsappShareBtn";
import ChatDialog from "../chatAi/ChatDialog";

interface IMobileFabMenuProps {
  userId: string;
  listId: string;
  permissionLevel: string;
  userEmail: string;
  data: any;
  searchParams: any;
}

const MobileFabMenu: React.FC<IMobileFabMenuProps> = ({
  userId,
  listId,
  permissionLevel,
  userEmail,
  data,
  searchParams,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 md:hidden z-50">
      <div className="relative">
        {/* Backdrop blur overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out"
            style={{ bottom: '-24px', right: '-24px' }}
            onClick={toggleOptions}
          />
        )}
        
        {/* Main FAB Button */}
        <button
          className={`relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl focus:outline-none transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
            isOpen ? "shadow-emerald-500/50" : "shadow-lg"
          }`}
          onClick={toggleOptions}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur opacity-30 animate-pulse"></div>
          <FaPlus
            size={24}
            className={`relative z-10 transform transition-all duration-500 ease-out ${
              isOpen ? "rotate-45 scale-110" : "rotate-0 scale-100"
            }`}
          />
        </button>

        {/* Options Menu */}
        <div
          className={`absolute bottom-20 right-0 flex flex-col items-center space-y-3 transition-all duration-300 ease-out transform ${
            isOpen 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 translate-y-8 scale-95 pointer-events-none"
          }`}
        >
          {/* Chat Dialog */}
          <div 
            className={`transition-all duration-300 ease-out transform ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "50ms" : "0ms" }}
          >
            <ChatDialog listId={listId} />
          </div>

          {/* Add Item Dialog */}
          <div 
            className={`transition-all duration-300 ease-out transform ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "100ms" : "0ms" }}
          >
            <AddItemDialog
              userId={
                searchParams.shared === "true" ? data.creatorId : userEmail
              }
              listId={listId}
              permissionLevel={permissionLevel}
            />
          </div>

          {/* Back to Lists Button */}
          <div 
            className={`transition-all duration-300 ease-out transform ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
          >
            <Button className="w-36 gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105" asChild>
              <Link href="/carts">
                <IoMdListBox size={20} />
                חזור לרשימות
              </Link>
            </Button>
          </div>

          {/* Share Dialog */}
          <div 
            className={`transition-all duration-300 ease-out transform ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
          >
            <ShareWithDialog
              ownerEmail={userEmail}
              listId={listId}
              data={data.sharedWith}
              disabled={searchParams.shared === "true"}
            />
          </div>

          {/* WhatsApp Button */}
          <div 
            className={`transition-all duration-300 ease-out transform ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "250ms" : "0ms" }}
          >
            <WhatsappBtn items={data.items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFabMenu;

