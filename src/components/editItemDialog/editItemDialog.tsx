"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TbEdit } from "react-icons/tb";
import { Input } from "../ui/input";
import { itemSchema } from "@/lib/schemas";
import { ItemFormData } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditItemDialogProps {
  itemPrice: number;
  itemName: string;
  itemAmount: number;
  listId: string;
  itemId: string;
  shared?: string;
  permissionLevel?: string;
  disabled?: boolean;
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCart } from "../addItemDialog/use-cart";

const EditItemDialog = (props: EditItemDialogProps) => {
  const {
    itemAmount = '0',
    itemPrice,
    itemName,
    listId,
    itemId,
    shared,
    permissionLevel,
    disabled = false,
  } = props;
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const { editItem } = useCart({ listId });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: itemName,
      amount: itemAmount,
      price: itemPrice,
      _id: itemId,
    },
  });

  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };

  const onSubmit = async (data: ItemFormData) => {
    try {
      await editItem({
        ...data,
        amount: data.amount || 0,
      });
      toast.success("מוצר עודכן בהצלחה");
      reset();
      closeDialog();
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorFlag(true);
      toast.error("שגיאה בעדכון המוצר");
    }
  };

  const isButtonDisabled = disabled || (shared === "true" && permissionLevel === "2");

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="w-12 h-12 mr-3 mt-2.5">
              <DialogTrigger
                disabled={isButtonDisabled}
                onClick={() => {
                  reset();
                }}
              >
                <TbEdit size={20} />
              </DialogTrigger>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabled ? "לא ניתן לערוך" : "ערוך מוצר"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">עדכן מוצר קיים</DialogTitle>
          <DialogDescription className="text-center">
            פרטי המוצר
          </DialogDescription>
        </DialogHeader>
        <form
          dir="rtl"
          className="flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col mb-4 w-full">
            <label className="ml-5 mb-2" htmlFor="name">
              שם המוצר
            </label>
            <Input
              className={`bg-input text-foreground rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name")}
              name="name"
              type="text"
              id="name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-4 w-full">
            <label className="ml-5 mb-2" htmlFor="amount">
              כמות
            </label>
            <Input
              className={`bg-input text-foreground rounded ${
                errors.amount ? "border-red-500" : ""
              }`}
              {...register("amount", { valueAsNumber: true })}
              name="amount"
              type="number"
              id="amount"
              min="1"
              disabled={isSubmitting}
            />
            {errors.amount && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.amount.message}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-4 w-full">
            <label className="ml-5 mb-2" htmlFor="price">
              מחיר
            </label>
            <Input
              className={`bg-input text-foreground rounded ${
                errors.price ? "border-red-500" : ""
              }`}
              {...register("price", { valueAsNumber: true })}
              name="price"
              type="number"
              id="price"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.price && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.price.message}
              </span>
            )}
          </div>

          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground m-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "מעדכן..." : "עדכן מוצר"}
          </Button>
          
          <DialogClose id="closeDialog" asChild>
            <Button type="button" className="text-destructive-foreground">
              סגור
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
