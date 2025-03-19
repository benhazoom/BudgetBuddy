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
    let budgets = await req.json();

    // Ensure budgets is an array
    if (!Array.isArray(budgets)) {
      budgets = [budgets];
    }

    const db = await connectDB();
    
    // Save each budget for the user
    for (const { category, amount, iconName } of budgets) {
      await db.collection("budgets").updateOne(
        { userId, category, iconName },
        { $set: { amount } },
        { upsert: true }
      );
    }

    return NextResponse.json({ message: "Budgets saved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save budgets" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    const { category, amount, iconName } = await req.json();

    const db = await connectDB();
    const result = await db.collection("budgets").updateOne(
      { userId, category},
      { $set: { amount,iconName } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update budget" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const { category } = await req.json();

    const db = await connectDB();
    await db.collection("budgets").deleteOne({ userId, category });

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete budget" }, { status: 500 });
  }
}
