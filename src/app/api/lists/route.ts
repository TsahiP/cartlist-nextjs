import { List } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (req:any) => {
    try {
        connectToDb();
        const lists = await List.find();
        console.log("🚀 ~ GET ~ posts:", lists)
        return NextResponse.json(lists);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch posts!");
    }
}