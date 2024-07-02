"use server"; // This line is a directive for the server to handle this code.
import { revalidatePath } from "next/cache";
import { List, User } from "./models";
import { connectToDb } from "./utils";
import { signIn, signOut } from "./auth";
// import { signIn, signOut } from "./auth";
import bcrypt from "bcryptjs";

// ======================== items actions ========================
interface ItemFormData {
  name: string;
  amount: string;
  price: number;
  desc?: string;
  img?: string;
}


//========================= user actions =================
interface UserFormData {
  username:string;
  password:string;
}
// ======================== user actions ========================
interface UserFormData {
  username: string;
  password: string;
  rePassword: string;
  img?: string;
  email?: string;
}
export const register = async (previousState: any, formData: any) => {
  console.log(formData);
  const { username, password, rePassword, img, email } =
    Object.fromEntries(formData);
  // console.log(username, password, rePassword, img, email);
  if (password !== rePassword) {
    return { error: "password do not match" };
  }

  try {
    connectToDb();
    // check if username exists
    const user = await User.findOne({ username: username });
    // console.log(user);
    if (user) {
      // console.log("exist try other name");
      return { error: "user already exists" };
    }
    // hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("saved to db");

    return { success: true };
  } catch (e) {
    // console.log(error);
    return { error: "Something went wrong!" };
  }
};
export const login = async (previousState:any, formData:any) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    connectToDb();
    // check if username exists
    
    await signIn("credentials", { username, password });

    return { success: true };
  } catch (error: any) {
    console.log(error);
    if (error.message.includes("CredentialsSignis")) {
      return { error: "Invalid Credentials" };
    }


    throw error;
  }
};
// פונקציה להוספת פריט לרשימה
export const addItemToList = async (listId: string, formData: ItemFormData) => {
  await connectToDb();

  try {
    const list = await List.findOne({ id: listId });
    if (!list) {
      throw new Error("List not found");
    }

    const newItem = {
      name: formData.name,
      amount: formData.amount,
      price: formData.price,
      desc: formData.desc || "",
      img: formData.img || "",
    };

    list.items.push(newItem);
    await list.save();

    revalidatePath(`/lists/${listId}`);
    return list;
  } catch (error) {
    console.error("Error adding item to list:", error);
    throw error;
  }
};

// פונקציה לעריכת פריט ברשימה
export const editItemInList = async (
  listId: string,
  itemId: string,
  formData: ItemFormData
) => {
  await connectToDb();

  try {
    const list = await List.findOne({ id: listId });
    if (!list) {
      throw new Error("List not found");
    }

    const item = list.items.find((item: any) => item.id === itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    item.name = formData.name;
    item.amount = formData.amount;
    item.price = formData.price;
    item.desc = formData.desc || "";
    item.img = formData.img || "";

    await list.save();

    revalidatePath(`/lists/${listId}`);
    return list;
  } catch (error) {
    console.error("Error editing item in list:", error);
    throw error;
  }
};

// פונקציה למחיקת פריט מרשימה
export const deleteItemFromList = async (listId: string, itemId: string) => {
  await connectToDb();

  try {
    const list = await List.findOne({ id: listId });
    if (!list) {
      throw new Error("List not found");
    }

    const itemIndex = list.items.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    list.items.splice(itemIndex, 1); // מחיקת הפריט
    await list.save();

    revalidatePath(`/lists/${listId}`);
    return list;
  } catch (error) {
    console.error("Error deleting item from list:", error);
    throw error;
  }
};

// =========================List actions =========================
interface CreateListFormData {
  title: string;
  creatorId: string;
}

// פונקציה ליצירת רשימה חדשה
export const createList = async (previousState: any, formData: any) => {
  await connectToDb();
  const { title, creatorId } = Object.fromEntries(formData);
  console.log("formData:", formData);
  console.log("🚀 ~ createList ~ formData:", title);
  console.log("🚀 ~ createList ~ formData:", creatorId);
  // Generate a unique ID for the item



  try {
    const newList = new List({

      title: title,
      creatorId: creatorId,
      items: [],
      sharedWith: [],
    });

    await newList.save();

    revalidatePath("/carts"); // Or the path where you display the lists
    return({status: "success"})
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};
