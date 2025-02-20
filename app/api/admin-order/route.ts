import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import User from "@/models/User";
import { sendOrderSMS } from "@/utils/SendOrderSMS";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

interface VerifyAuthResult {
  user?: any;
  error?: string;
  status?: number;
}

// Utility function to verify user authentication
async function verifyAuth(): Promise<VerifyAuthResult> {
  const refreshTokenCookie = (await cookies()).get("refreshToken");

  if (!refreshTokenCookie?.value) {
    return { error: "Unauthorized: No refresh token found.", status: 401 };
  }

  try {
    const decoded = verify(refreshTokenCookie.value, REFRESH_TOKEN_SECRET) as {
      userId: string;
      email: string;
    };

    if (!decoded.email) {
      return { error: "Unauthorized: Invalid token payload.", status: 401 };
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "firstName lastName email role"
    );

    if (!user) {
      return { error: "Unauthorized: User not found.", status: 404 };
    }

    return {
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return { error: "Unauthorized: Token has expired.", status: 401 };
      }
      if (error.name === "JsonWebTokenError") {
        return { error: "Unauthorized: Invalid token.", status: 401 };
      }
    }
    return { error: "Unauthorized: Token verification failed.", status: 401 };
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      name,
      email,
      phoneNumber,
      service,
      address,
      landmark,
      pincode,
      date,
      timeSlot,
      carType,
      paymentStatus,
      paymentUpdate,
      orderSource,
    } = await req.json();

    // Validate required fields
    if (!name || !service || !address || !pincode || !timeSlot) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const authResult = await verifyAuth();
    if ("error" in authResult) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    const servicePrices: Record<string, number> = {
      "Car foam wash": 679,
      "Car + Bike combo": 899,
      "Bi Weekly": 1199,
      Weekly: 2199,
    };

    const price = servicePrices[service];
    if (!price) {
      return NextResponse.json(
        { message: "Invalid service selected." },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      userId: authResult.user.userId,
      name,
      email,
      phoneNumber,
      service,
      price,
      address,
      landmark,
      pincode,
      date,
      timeSlot,
      carType,
      paymentStatus,
      paymentUpdate,
      orderSource,
    });

    const orderDetails = {
      name: newOrder.name,
      service: newOrder.service,
      price: newOrder.price,
      date: newOrder.date,
      timeSlot: newOrder.timeSlot,
      phone: newOrder.phoneNumber,
      address: newOrder.address,
      razorpayOrderId: '',
      pincode: newOrder.pincode,
      landmark: newOrder.landmark,
      carType: newOrder.carType,
      paymentStatus: newOrder.paymentStatus,
      paymentUpdate: newOrder.paymentUpdate,
      orderSource: newOrder.orderSource,
    };

    await sendOrderSMS(orderDetails);

    return NextResponse.json(
      {
        message: "Order created successfully.",
        order: newOrder,
        orderId: newOrder._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Log the error stack for better debugging
    console.error("Error in POST order request:", error);

    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
