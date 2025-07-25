import { union, z } from "zod";

// User schemas
export const userSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(25),
  username: z.string().min(3).max(20),
  email: z.string().email().max(50),
  password: z.string().min(6).optional(),
  img: z.string().default(""),
  isAdmin: z.boolean().default(false),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(25),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  rePassword: z.string().min(6),
  img: z.string().optional(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

// Item schemas
export const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
    // Amount can be omitted. Accept both number and string so the LLM can decide the representation.
    amount: z.union([z.number().nonnegative('amount must be positive or 0'), z.string()]).optional(),
    // Price can be omitted and may be 0.
    price: z.number().min(0,'price must be positive or 0').optional(),

  desc: z.string().optional(),
  img: z.string().optional(),
  _id: z.string().optional(),
});

// Shared user schema
export const sharedWithSchema = z.object({
  email: z.string().email(),
  permission: z.string(),
  fullName: z.string(),
  lastName: z.string(),
  firstName: z.string(),
});

// List/Cart schemas
export const listSchema = z.object({
  title: z.string().min(1, "Title is required"),
  creatorId: z.string(),
  items: z.array(itemSchema),
  sharedWith: z.array(sharedWithSchema),
});

export const createListSchema = z.object({
  title: z.string().min(1, "Title is required"),
  creatorId: z.string(),
  creatorEmail: z.string().email(),
});

export const shareListSchema = z.object({
  listId: z.string(),
  email: z.string().email(),
  ownerEmail: z.string().email(),
});

export const changePermissionSchema = z.object({
  listId: z.string(),
  shareToEmail: z.string().email(),
  permission: z.string(),
  ownerEmail: z.string().email(),
});

// Infer types from schemas
export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Item = z.infer<typeof itemSchema>;
export type SharedWith = z.infer<typeof sharedWithSchema>;
export type List = z.infer<typeof listSchema>;
export type CreateListData = z.infer<typeof createListSchema>;
export type ShareListData = z.infer<typeof shareListSchema>;
export type ChangePermissionData = z.infer<typeof changePermissionSchema>; 