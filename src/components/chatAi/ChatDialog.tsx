"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import Chat from "./chat";

interface ChatDialogProps {
  listId: string;
}

export default function ChatDialog({ listId }: ChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <MessageCircle size={20} />
          צ'אט AI
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full  p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-muted-foreground">
              עוזר צ'אט AI
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 flex-shrink-0"
            >
              <span className=" text-xl text-muted-foreground"  >X</span>
            </Button>
          </div>
         
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden h-[90vh] sm:h-[80vh] md:h-[70vh]">
          <Chat listId={listId} isInDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 