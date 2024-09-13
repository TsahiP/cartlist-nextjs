"use server"; // This line is a directive for the server to handle this code.
import { revalidatePath } from "next/cache";
import { List, User } from "./models";
import { connectToDb } from "./utils";
import { signIn, signOut } from "./auth";
// import { signIn, signOut } from "./auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
// ======================== items actions ========================
interface ItemFormData {
  name: string;
  amount: number;
  price: number;
  desc?: string;
  img?: string;
  _id?: string;
}

//========================= user actions =================
interface UserFormData {
  username: string;
  password: string;
}
// ======================== user actions ========================
interface UserFormData {
  username: string;
  password: string;
  rePassword: string;
  img?: string;
  email?: string;
}
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
export const register = async (previousState: any, formData: any) => {
  console.log(formData);
  const { firstName, lastName, username, password, rePassword, img, email } =
    Object.fromEntries(formData);
  // console.log(username, password, rePassword, img, email);
  if (password !== rePassword) {
    return { error: "password do not match" };
  }

  // console.log("🚀 ~ register ~ lastName:", lastName)
  // console.log("🚀 ~ register ~ name:", firstName)
  try {
    connectToDb();
    // check if username exists
    const user = await User.findOne({ username: username });
    if (user) {
      return { error: "user already exists" };
    }
    // hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save().catch((e: any) => {
      console.log(e);
    });
    console.log("saved to db");

    return { success: true };
  } catch (e) {
    // console.log(error);
    return { error: "Something went wrong!" };
  }
};
interface CustomError extends Error {
  cause?: {
    message: string;
  };
}
export const login = async (prevState: any, formData: any) => {
  const { username, password } = Object.fromEntries(formData);
  const user: string = username.toString().toLowerCase();
  console.log(user);

  try {
    await signIn("credentials", { username, password });
  } catch (err: any) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          console.log("cred wrong1");

          return { msg: "Invalid credentials", status: "error" };
        case "CredentialsSignin":
          console.log("cred wrong2");
          throw err;
        default:
          console.log("cred wrong3");
          return {
            msg: "Something went wrong Invalid credentials",
            status: "error",
          };
      }
    }
    throw err;
  }
};

// פונקציה להוספת פריט לרשימה
export const addItemToList = async (
  listId: string,
  userId: string,
  formData: ItemFormData
) => {
  console.log("🚀 ~ addItemToList ~ userId:", userId);
  console.log("🚀 ~ addItemToList ~ listId:", listId);
  await connectToDb();

  try {
    const list = await List.findOne({ _id: listId, creatorId: userId });
    // console.log("🚀 ~ addItemToList ~ list:", list)
    if (!list) {
      return { error: "List not found" };
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
    return { sucsses: "list updated" };
  } catch (error) {
    console.error("Error adding item to list:", error);
    throw error;
  }
};

// פונקציה לעריכת פריט ברשימה
export const editItemInList = async (
  listId: string,
  userId: string,
  formData: ItemFormData,
  shared?: string,
  userEmail?: string
) => {
  await connectToDb();

  try {
    console.log("userId: " + userId);
    console.log("listId: " + listId);

    let list = [];
    if (shared === "true") {
      list = await List.findOne({
        _id: listId,
        sharedWith: { $elemMatch: { email: userEmail } },
      });
    } else {
      list = await List.findOne({ _id: listId, creatorId: userId });
    }
    if (!list) {
      throw new Error("List not found");
    }

    const item = list.items.find((item: any) => item.id === formData._id);
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
  userEmail: string | undefined
) => {
  await connectToDb();
  let user: any;
  if(!userId){
    user = await User.findOne({ email: userEmail });
  }
  try {
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

// פונקציה למחיקת פריט מרשימה
export const deleteItemFromList = async (
  userId: string,
  listId: string,
  itemId: string,
  email: string,
  shared?: string
) => {
  await connectToDb();
  let list: any = [];
  try {
    if (shared === "true") {
      list = await List.findOne({
        _id: listId,
        sharedWith: {
          $elemMatch: { email: email },
        },
      });
    } else {
      list = await List.findOne({ _id: listId, creatorId: userId });
    }
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
    const listPlainObject = JSON.parse(JSON.stringify(list));
    return listPlainObject;
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
export const createList = async (formData: any) => {
  await connectToDb();
  const { title, creatorId, creatorEmail } = formData;
  let user: any;
  if (!creatorId) {
     user = await User.findOne({ email: creatorEmail });
  } else {
     user = await User.findOne({ _id: creatorEmail });
  }
  console.log("🚀 ~ createList ~ user", user);
  
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
export const getCarts = async (userid?: string,userEmail?: string ) => {
  if (userid === undefined && userEmail === undefined) return [];
  try {
    connectToDb();
    let user: any;
    if(!userid){
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
  userId: string,
  listId: string,
  email: string,
  permission: string
) => {
  await connectToDb();
  try {
    const list = await List.findOne({ _id: listId, creatorId: userId });
    if (!list) {
      return { error: "List not found" };
    }
    const sharedUser = list.sharedWith.find((e: any) => e.email === email);
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
  userId: string,
  listId: string,
  email: string
) => {
  await connectToDb();
  try {
    console.log("here");
    // check if this email Exist in Users table
    const user = await User.findOne({ email: email });
    console.log("🚀 ~ shareList ~ user", user);

    if (!user) {
      return { error: "User not found" };
    }

    const list = await List.findOne({ _id: listId, creatorId: userId });

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
export const getListByIdAndUserId = async (listId: string, userId: string) => {
  await connectToDb();

  try {
    const list = await List.findOne({ _id: listId, creatorId: userId });
    if (!list) {
      return { error: "List not found" };
    }
    const listPlainObject = JSON.parse(JSON.stringify(list));

    return listPlainObject;
  } catch (error) {
    console.error("Error getting list by id and user id:", error);
    throw error;
  }
};

// get list by share email and list id
export const getListByEmailAndListId = async (
  email: string,
  listId: string
) => {
  await connectToDb();

  try {
    const list = await List.findOne({
      _id: listId,
      sharedWith: { $elemMatch: { email: email } },
    });
    if (!list) {
      return { error: "List not found" };
    }
    const listPlainObject = JSON.parse(JSON.stringify(list));
    return listPlainObject;
  } catch (error) {
    console.error("Error getting list by email and list id:", error);
    throw error;
  }
};
