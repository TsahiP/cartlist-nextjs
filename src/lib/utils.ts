import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose from "mongoose"


const connection: any = {};

// const connection = {};

export const connectToDb = async () => {
  try {
    if(connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO||"");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    // log.error("sdfsfsf");
    console.log(error);
    // throw new Error(error);
  }
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}