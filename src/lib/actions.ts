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
  formData: ItemFormData
): Promise<ApiResponse> => {
  try {
    await connectToDb();

    const session = await auth();
    if (!session?.user?.email) return { success: false, error: "Unauthenticated" };

    const list: any = await List.findOne({ _id: listId });
    if (!list) return { success: false, error: "List not found" };

    // Authorisation – owner or collaborator with edit permission ("1")
    const isOwner = String(list.creatorId) === String(session.user.userId ?? "");
    const collaborator = list.sharedWith.find((u: any) => u.email === session.user.email);
    const canEdit = collaborator ? collaborator.permission === "1" : false;

    if (!isOwner && !canEdit) {
      return { success: false, error: "Not authorised" };
    }

    await List.updateOne(
      { _id: listId, "items._id": formData._id },
      {
        $set: {
          "items.$.name": formData.name,
          "items.$.amount": formData.amount,
          "items.$.price": formData.price,
          "items.$.desc": formData.desc || "",
          "items.$.img": formData.img || "",
        },
      }
    );

    revalidatePath(`/cart`);
    return { success: true };
  } catch (error) {
    console.error("Error editing item:", error);
    return { success: false, error: "Failed to edit item" };
  }
};

export const deleteList = async (listId: string) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    await connectToDb();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const list = await List.findOneAndDelete({
      _id: listId,
      creatorId: user._id,
    });

    if (!list) {
      return { success: false, error: "List not found" };
    }

    revalidatePath("/carts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting list:", error);
    return { success: false, error: "Failed to delete list" };
  }
};

export const deleteItemFromList = async (
  listId: string,
  itemId: string
): Promise<ApiResponse> => {
  try {
    await connectToDb();

    const session = await auth();
    if (!session?.user?.email) return { success: false, error: "Unauthenticated" };

    const list: any = await List.findOne({ _id: listId });
    if (!list) return { success: false, error: "List not found" };

    const isOwner = String(list.creatorId) === String(session.user.userId ?? "");
    const collaborator = list.sharedWith.find((u: any) => u.email === session.user.email);
    const canEdit = collaborator ? collaborator.permission === "1" : false;

    if (!isOwner && !canEdit) {
      return { success: false, error: "Not authorised" };
    }

    const updateResult = await List.updateOne(
      { _id: listId },
      { $pull: { items: { _id: itemId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return { success: false, error: "Item not found" };
    }

    revalidatePath(`/cart`);
    const updatedList = await List.findOne({ _id: listId });
    const listPlainObject = JSON.parse(JSON.stringify(updatedList));
    return { success: true, data: listPlainObject };
  } catch (error) {
    console.error("Error deleting item from list:", error);
    return { success: false, error: "Failed to delete item" };
  }
};

// =========================List actions =========================
// Create a new list for the authenticated user
export const createList = async (title: string): Promise<ApiResponse> => {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    await connectToDb();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const newList = new List({
      title,
      creatorId: user._id,
      items: [],
      sharedWith: [],
    });

    await newList.save();
    revalidatePath("/carts");
    return { success: true };
  } catch (error) {
    console.error("Error creating list:", error);
    return { success: false, error: "Failed to create list" };
  }
};

// Wrapper for useFormState / form actions
export const createListAction = async (
  _prevState: ApiResponse | undefined,
  formData: FormData
): Promise<ApiResponse> => {
  const title = formData.get("title")?.toString().trim() || "";
  if (!title) {
    return { success: false, error: "Title is required" };
  }
  return await createList(title);
};

// Fetch carts that belong to the currently authenticated user
export const getCarts = async () => {
  // Obtain the current session (NextAuth)
  const session = await auth();

  // If there is no authenticated user just return an empty array – the caller
  // can decide how to handle unauthenticated state (e.g. redirect to /login)
  if (!session?.user?.email) {
    return [];
  }

  try {
    await connectToDb();

    // Look-up the user record in Mongo so we can query lists by creatorId
    const user = await User.findOne({ email: session.user.email });
    if (!user) return [];

    const lists = await List.find({ creatorId: user._id });
    return lists;
  } catch (error) {
    console.error("Error fetching carts:", error);
    return [];
  }
};

// Get carts that have been shared with the current user
export const getSharedCarts = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  try {
    await connectToDb();

    const lists = await List.find({
      sharedWith: {
        $elemMatch: { email: session.user.email },
      },
    });
    return lists;
  } catch (error) {
    console.error("Error fetching shared carts:", error);
    return [];
  }
};

// change permission of shared user
export const changePermission = async (
  listId: string,
  shareToEmail: string,
  permission: string
) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthenticated" };
  }

  try {
    await connectToDb();

    const owner = await User.findOne({ email: session.user.email });
    if (!owner) return { error: "Owner not found" };

    const list = await List.findOne({ _id: listId, creatorId: owner._id });
    if (!list) return { error: "List not found" };

    // permission level "3" means remove user
    if (permission === "3") {
      list.sharedWith = list.sharedWith.filter((e: any) => e.email !== shareToEmail);
      await list.save();
      revalidatePath(`/lists/${listId}`);
      return { status: "success" };
    }

    const sharedUser = list.sharedWith.find((e: any) => e.email === shareToEmail);
    if (!sharedUser) return { error: "User not found" };

    sharedUser.permission = permission;
    await list.save();

    revalidatePath(`/lists/${listId}`);
    return { status: "success" };
  } catch (error) {
    console.error("Error changing permission:", error);
    return { status: "error" };
  }
};

// share a list with chosen email
export const shareList = async (listId: string, email: string) => {
  const session = await auth();

  if (!session?.user?.email) return { error: "Unauthenticated" };

  try {
    await connectToDb();

    // Prevent self-sharing
    if (session.user.email === email) {
      return { error: "You can't share with yourself" };
    }

    const ownerUser = await User.findOne({ email: session.user.email });
    if (!ownerUser) return { error: "Owner not found" };

    const targetUser = await User.findOne({ email });
    if (!targetUser) return { error: "User not found" };

    const list = await List.findOne({ _id: listId, creatorId: ownerUser._id });
    if (!list) return { error: "List not found" };

    // Check if already shared
    const already = list.sharedWith.some((e: any) => e.email === email);
    if (already) return { error: "Exist" };

    list.sharedWith.push({
      email,
      permission: "1",
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      fullName: `${targetUser.firstName} ${targetUser.lastName}`,
    });

    await list.save();
    revalidatePath(`/lists/${listId}`);
    return { status: "success" };
  } catch (error) {
    console.error("Error sharing list:", error);
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
