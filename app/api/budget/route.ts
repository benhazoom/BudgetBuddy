import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const db = await connectDB();
    const budgets = await db.collection("budgets").find({ userId }).toArray();
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const budgets = await req.json();

    const db = await connectDB();
    
    // Save each budget for the user
    for (const { category, amount } of budgets) {
      await db.collection("budgets").updateOne(
        { userId, category },
        { $set: { amount } },
        { upsert: true }
      );
    }

    return NextResponse.json({ message: "Budgets saved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save budgets" }, { status: 500 });
  }
}
