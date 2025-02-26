import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { category, amount } = await req.json();

    if (!category || amount == null) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const db = await connectDB();

    // Check if the category already exists for this user
    const existing = await db.collection("budgets").findOne({ userId, category });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    // Insert the new category
    await db.collection("budgets").insertOne({
      userId,
      category,
      amount: parseInt(amount, 10), // Ensure amount is stored as a number
    });

    return NextResponse.json({ message: "Budget category added successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add budget category" }, { status: 500 });
  }
}
