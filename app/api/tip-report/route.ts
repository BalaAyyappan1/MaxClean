import { NextResponse } from "next/server";
import Order from "@/models/Order";

export async function GET() {
  try {
 
    const tipReports = await Order.find({ tips: { $gt: 0 } }) 
      .select('name email phoneNumber tips createdAt paymentStatus status') 
      .lean(); 

    if (tipReports.length === 0) {
      return NextResponse.json(
        { message: "No tip reports found." },
        { status: 404 }
      );
    }

    return NextResponse.json(tipReports, { status: 200 });
  } catch (error) {
    console.error("Error fetching tip reports:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
