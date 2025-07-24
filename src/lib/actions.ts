"use server"; 
import { revalidatePath } from "next/cache";
import { List, User } from "./models";
import { connectToDb } from "./utils";
import { auth, signIn, signOut } from "./auth";
// import { signIn, signOut } from "./auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import {
  registerSchema,
  loginSchema,
  itemSchema,
  createListSchema,
  shareListSchema,
  changePermissionSchema,
  type RegisterData,
  type LoginData,
  type Item,
  type List as ListType,
  type CreateListData,
  type ShareListData,
  type ChangePermissionData,
} from "./schemas";
import { ApiResponse, ItemFormData } from "@/lib/types";
export const handleGithubSignOut = async () => {
  "use server";

  await signOut();
};

export const handleGoogleLogin = async () => {
  "use server";

  await signIn("google");
  
};

export const handleGoogleSignOut = async () => {
  "use server";

  await signOut();
};

// Helper function for validation
function validateData<T>(schema: any, data: any): ApiResponse<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.errors?.[0]?.message || "Validation failed" 
    };
  }
}

export const register = async (previousState: any, formData: FormData): Promise<ApiResponse> => {
  const rawData = Object.fromEntries(formData);
  
  const validation = validateData(registerSchema, rawData);
  if (!validation.success) {
    return validation;
  }

  const data = validation.data as RegisterData;

  try {
    await connectToDb();
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ username: data.username }, { email: data.email }] 
    });
    
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      img: data.img,
    });

    await newUser.save();
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong!" };
  }
};

export const login = async (prevState: any, formData: FormData): Promise<ApiResponse> => {
  const rawData = Object.fromEntries(formData);
  
  const validation = validateData(loginSchema, rawData);
  if (!validation.success) {
    return validation;
  }

  const data = validation.data as LoginData;

  try {
    await signIn("credentials", { 
      username: data.username, 
      password: data.password 
    });
    return { success: true };
  } catch (err: any) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials" };
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const addItemToList = async (
  listId: string,
  formData: FormData|ItemFormData
): Promise<ApiResponse> => {
  // Convert FormData to plain object first
  const user = await auth();
  const validation = validateData(itemSchema, formData);
  if (!validation.success) {
    return validation;
  }

  const itemData = validation.data as Item;

  try {
    await connectToDb();
    
    const list = await List.findOne({ _id: listId });
    if (!list) {
      return { success: false, error: "List not found" };
    }

    const newItem = {
      name: itemData.name,
      amount: itemData.amount.toString(),
      price: itemData.price,
      desc: itemData.desc || "",
      img: itemData.img || "",
    };

    list.items.push(newItem);
    await list.save();

    revalidatePath(`/cart`);
    // Convert Mongoose document to plain object to avoid circular references
    const listPlainObject = JSON.parse(JSON.stringify(list));
    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error adding item to list:", error);
    return { success: false, error: "Failed to add item" };
  }
};

export const editItemInList = async (
  listId: string,
  userId: string,
  formData: ItemFormData,
  shared?: string,
  userEmail?: string
) => {

  try {
  await connectToDb();
    let list = [];
    if (shared === "true") {
      list = await List.findOne({
        _id: listId,
        sharedWith: { $elemMatch: { email: userEmail } },
      });
    } else {
      list = await List.findOne({ _id: listId });
    }
    if (!list) {
      throw new Error("List not found");
    }
    await List.updateOne(
      { 
        _id: listId,
        "items._id": formData._id 
      },
      {
        $set: {
          "items.$.name": formData.name,
          "items.$.amount": formData.amount,
          "items.$.price": formData.price,
          "items.$.desc": formData.desc || "",
          "items.$.img": formData.img || ""
        }
      }
    );

    revalidatePath(`/cart`);
    const listPlainObject = JSON.parse(JSON.stringify(list));
    return listPlainObject;
  } catch (error) {
    return { error: error };
  }
};

//delete a list by id
export const deleteList = async (
  userId: string | undefined,
  listId: string | undefined,
  userEmail: string | undefined | null
) => {
  await connectToDb();
  try {
  let user: any;
  if (!userId) {
    user = await User.findOne({ email: userEmail });
  }
    const list = await List.findOneAndDelete({
      _id: listId,
      creatorId: userId ?? user._id,
    });
    if (!list) {
      throw new Error("List not found");
    }

    revalidatePath("/carts");
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};

export const deleteItemFromList = async (
  userId: string,
  listId: string,
  itemId: string,
  email: string,
  shared?: string
): Promise<ApiResponse> => {
  await connectToDb();

  try {
    // Build query based on ownership vs. shared access
    let baseQuery: any = { _id: listId };

    if (shared === "true") {
      // Ensure the email is part of the sharedWith array
      baseQuery.sharedWith = { $elemMatch: { email } };
    } else {
      // For owner operations validate the creatorId
      baseQuery.creatorId = userId;
    }

    // Fetch the list first to validate permissions & existence
    const list = await List.findOne(baseQuery);

    if (!list) {
      return { success: false, error: "List not found or insufficient permissions" };
    }

    // If this is a shared list, validate permission level ("1" could be read-only)
    if (shared === "true") {
      const sharedUser: any = list.sharedWith.find((u: any) => u.email === email);
      if (!sharedUser) {
        return { success: false, error: "You are not authorized to modify this list" };
      }
      if (sharedUser.permission === "1") {
        return { success: false, error: "You do not have permission to delete items" };
      }
    }

    // Perform atomic pull operation
    const updateResult = await List.updateOne(baseQuery, {
      $pull: { items: { _id: itemId } },
    });

    if (updateResult.modifiedCount === 0) {
      return { success: false, error: "Item not found" };
    }

    revalidatePath(`/cart`);

    // Return updated list for client consistency
    const updatedList = await List.findOne({ _id: listId });
    const listPlainObject = JSON.parse(JSON.stringify(updatedList));
    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error deleting item from list:", error);
    return { success: false, error: "Failed to delete item" };
  }
};

// =========================List actions =========================
interface CreateListFormData {
  title: string;
  creatorId: string;
}

// פונקציה ליצירת רשימה חדשה
export const createList = async (formData: any) => {
  await connectToDb();
  const { title, creatorId, creatorEmail } = formData;
  let user: any;
    user = await User.findOne({ email: creatorEmail });
  try {
    const newList = new List({
      title: title,
      creatorId: user._id,
      items: [],
      sharedWith: [],
    });

    await newList.save();

    revalidatePath("/carts"); // Or the path where you display the lists
    return { status: "success" };
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};
export const getCarts = async (userid?: string, userEmail?: string) => {
  if (userid === undefined && userEmail === undefined) return [];
  try {
    connectToDb();
    let user: any;
    if (!userid) {
      user = await User.findOne({ email: userEmail });
      const lists = await List.find({ creatorId: user._id });
      return lists;
    }
    const lists = await List.find({ creatorId: userid });
    return lists;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Get Shared with me carts
export const getSharedCarts = async (email: string | undefined | null) => {
  try {
    connectToDb();
    const lists = await List.find({
      sharedWith: {
        $elemMatch: { email: email },
      },
    });
    return lists;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// change permission of shared user
export const changePermission = async (
  listId: string,
  shareToEmail: string,
  permission: string,
  ownerEmail: string
) => {
  await connectToDb();
  try {
    let user: { _id: string } | null = null;
    user = await User.findOne({ email: ownerEmail });
    const list = await List.findOne({
      _id: listId,
      creatorId:user?._id,
    });
    if (!list) {
      return { error: "List not found" };
    }
    // if permission leve eq to 3 delete from shared list array
    if (permission === "3") {
      list.sharedWith = list.sharedWith.filter(
        (e: any) => e.email !== shareToEmail
      );

      
      await list.save();
      revalidatePath(`/lists/${listId}`);
      return { status: "success" };
    }
    const sharedUser = list.sharedWith.find(
      (e: any) => e.email === shareToEmail
    );
    if (!sharedUser) {
      return { error: "User not found" };
    }
    sharedUser.permission = permission;
    await list.save();
    revalidatePath(`/lists/${listId}`);
    return { status: "success" };
  } catch (error) {
    return { status: "error" };
  }
};

// share a list with chosen email
export const shareList = async (
  listId: string,
  email: string,
  ownerEmail: string
) => {
  await connectToDb();
  try {
    let ownerId: string;
    let userId: string;
    // Handle the case where ownerEmail might be undefined
    
      // Provide a default value or handle the undefined case
      const ownerUser = await User.findOne({ email: ownerEmail }); // Replace with appropriate default value or logic

      ownerId = ownerUser._id.toString();
      // check if the ownerEmail and email are equal
      if (ownerEmail === email) {
        return { error: "You can't share with yourself" };
      }
      // check if this email Exist in Users table
      const user = await User.findOne({ email: email });
    if (!user) {
      return { error: "User not found" };
    }
    const list = await List.findOne({ _id: listId, creatorId: ownerId });

    if (!list) {
      return { error: "List not found" };
    }
    // check if email allready exist in sharedWith array
    const flag = list.sharedWith.filter((e: any) => e.email === email);
    if (flag.length === 0) {
      list.sharedWith.push({
        email: email,
        permission: "1",
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.firstName + " " + user.lastName,
      });
      await list.save();
      revalidatePath(`/lists/${listId}`);
      return { status: "success" };
    }
    return { error: "Exist" };
  } catch (error) {
    return { status: "error" };
  }
};


// Get list by list id and user id
export const getListByIdAndUserId = async (
  listId: string,
  userId: string,
  userEmail: string
): Promise<ApiResponse<ListType>> => {
  await connectToDb();

  try {
    let user: any;
    if (!userId) {
      user = await User.findOne({ email: userEmail });
    }
    const list = await List.findOne({
      _id: listId,
      creatorId: userId ?? user._id,
    });
    if (!list) {
      return { success: false, error: "List not found" };
    }
    const listPlainObject = JSON.parse(JSON.stringify(list));

    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error getting list by id and user id:", error);
    return { success: false, error: "Failed to get list" };
  }
};

// get list by share email and list id
export const getListByEmailAndListId = async (
  email: string,
  listId: string
): Promise<ApiResponse<ListType>> => {
  await connectToDb();

  try {
    const list = await List.findOne({
      _id: listId,
      sharedWith: { $elemMatch: { email: email } },
    });
    if (!list) {
      return { success: false, error: "List not found" };
    }
    const listPlainObject = JSON.parse(JSON.stringify(list));
    listPlainObject.sharedWith = listPlainObject.sharedWith.filter(
      (s: { email: string }) => s.email === email
    );

    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error getting list by email and list id:", error);
    return { success: false, error: "Failed to get list" };
  }
};

// ===================== Items bulk actions =====================
export const addManyItemsToList = async (
  listId: string,
  items: ItemFormData[]
): Promise<ApiResponse> => {
  // Validate the incoming items array against the existing itemSchema
  const validation = itemSchema.array().safeParse(items);
  if (!validation.success) {
    return {
      success: false,
      error:
        validation.error.errors?.[0]?.message || "Validation of items failed",
    };
  }

  try {
    await connectToDb();

    const list = await List.findOne({ _id: listId });
    if (!list) {
      return { success: false, error: "List not found" };
    }

    const formattedItems = validation.data.map((item) => ({
      name: item.name,
      amount: item.amount.toString(),
      price: item.price,
      desc: item.desc || "",
      img: item.img || "",
    }));

    // Push all items in one atomic operation for performance
    await List.updateOne(
      { _id: listId },
      {
        $push: {
          items: { $each: formattedItems },
        },
      }
    );

    revalidatePath(`/cart`);

    const updatedList = await List.findOne({ _id: listId });
    const listPlainObject = JSON.parse(JSON.stringify(updatedList));

    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error adding multiple items to list:", error);
    return { success: false, error: "Failed to add multiple items" };
  }
};

// ===================== Fetch list (read only) =====================
export const getListById = async (
  listId: string
): Promise<ApiResponse<ListType>> => {
  await connectToDb();

  try {
    const list = await List.findOne({ _id: listId });
    if (!list) {
      return { success: false, error: "List not found" };
    }

    const listPlainObject = JSON.parse(JSON.stringify(list));
    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error fetching list by id:", error);
    return { success: false, error: "Failed to fetch list" };
  }
};
