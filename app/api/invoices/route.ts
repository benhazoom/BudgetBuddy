import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Invoice } from "@/lib/models/Invoice";

export async function GET() {
  const { userId } = await auth();
  try {

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    const invoices = await db.collection("invoices").find({ userId }).toArray();

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ message: `Internal Server Error userId${userId}` }, { status: 500 });
  }
}

// Create a new invoice
export async function POST(req: Request) {
  console.log("Posting invoice");
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, category, amount } = body;
  console.log("name", name);
  console.log("category", category);
  console.log("amount", amount);
  console.log("userId", userId);
  if (!name || !category || !amount) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  const db = await connectDB();
  const newInvoice = { userId, name, category, amount };
  const result = await db.collection("invoices").insertOne(newInvoice);
  return NextResponse.json(newInvoice, { status: 201 });
}

// Update an invoice
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    const { id, name, category, amount } = await req.json();

    if (!id || !name || !category || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const result = await db.collection("invoices").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { name, category, amount } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Invoice not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Delete an invoice
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Invoice ID is required" }, { status: 400 });
    }

    const result = await db.collection("invoices").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}