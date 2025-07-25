"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RiCloseCircleLine } from "react-icons/ri";
import { MdAddTask } from "react-icons/md";
import { Button } from "../ui/button";
import { MdOutlineLibraryAdd } from "react-icons/md";
import axios from "axios";
import { Input } from "../ui/input";
import AutocompleteInput from "./autocomplete";
import { Result, Root } from "../../../types/shufersal";
import { useCartOptimistic } from "@/contexts/CartOptimisticProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema } from "@/lib/schemas";
import { OptimisticItem } from "@/types/cart";

interface AddItemDialogProps {
  listId: string;
  permissionLevel?: string;
}

interface AddItemFormData {
  name: string;
  amount: number;
  price: number;
  desc?: string;
  img?: string;
}

const AddItemDialog = ({
  listId,
  permissionLevel,
}: AddItemDialogProps) => {
  const { addItemOptimistic, isLoading } = useCartOptimistic();
  const [suggestions, setSuggestions] = useState<Root>();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      amount: 1,
      price: 1,
      desc: "",
      img: "",
    },
  });

  const name = watch("name");

  const getSearchProductsOptions = async () => {
    if (!name || name.length < 2) return;
    
    try {
      const response = await axios.get(`/api/shufersal?query=${name}`);
      const products: Result = response.data;
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getSearchProductsOptions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [name]);

  const onSubmit = async (data: AddItemFormData) => {
    try {
      const optimisticItem: Omit<OptimisticItem, '_id'> = {
        name: data.name,
        amount: data.amount?.toString() ?? "1",
        price: data.price,
        desc: data.desc || "",
        img: data.img || "",
      };

      await addItemOptimistic(optimisticItem);
      
      // Reset form and close dialog
      reset();
      setIsOpen(false);
      
      // Close dialog using the DialogClose trigger
      document.getElementById("closeDialog")?.click();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        disabled={permissionLevel === "1" ? false : true}
        className="w-36 gap-2"
        asChild
      >
        <DialogTrigger onClick={() => setIsOpen(true)}>
          <MdOutlineLibraryAdd size={20} />
          הוסף מוצר
        </DialogTrigger>
      </Button>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            הוסף מוצר חדש
          </DialogTitle>
          <DialogDescription className="text-center">
            אנא מלא את הפרטים הבאים
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
              {...register("name")}
              type="text"
              id="name"
              className={`bg-input text-foreground rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              disabled={isSubmitting || isLoading}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.name.message}
              </span>
            )}
            {/* <AutocompleteInput
              price={price}
              setPrice={setPrice}
              suggestions={suggestions}
              name={name}
              setName={setName}
            /> */}
          </div>
          
          <div className="flex flex-col mb-4 w-full">
            <label className="ml-5 mb-2" htmlFor="amount">
              כמות
            </label>
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              id="amount"
              min="1"
              className={`bg-input text-foreground rounded ${
                errors.amount ? "border-red-500" : ""
              }`}
              disabled={isSubmitting || isLoading}
            />
            {errors.amount && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.amount.message}
              </span>
            )}
          </div>
          
          <div className="flex flex-col mb-4 w-full">
            <label className="ml-5 mb-2" htmlFor="price">
              מחיר ליחידה
            </label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              id="price"
              className={`bg-input text-foreground rounded ${
                errors.price ? "border-red-500" : ""
              }`}
              disabled={isSubmitting || isLoading}
            />
            {errors.price && (
              <span className="text-red-500 text-sm mr-5 mt-1">
                {errors.price.message}
              </span>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-36 bg-primary text-primary-foreground m-4 gap-2"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              "מוסיף..."
            ) : (
              <>
                <MdAddTask size={20} />
                הוסף מוצר
              </>
            )}
          </Button>
          
          <DialogClose id="closeDialog" asChild>
            <Button 
              type="button" 
              className="w-36 bg-black hover:bg-destructive text-destructive-foreground gap-2"
              onClick={handleDialogClose}
            >
              <RiCloseCircleLine size={20} />
              סגור
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
