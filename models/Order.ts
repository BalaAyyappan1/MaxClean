import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phoneNumber: string;
  service: string;
  price: number;
  address: string;
  landmark: string;
  pincode: string;
  date: string;
  timeSlot: string;
  carType:string;
  notes: string;
  paymentStatus: string;
  status: string;
  receipt: Buffer;
  razorpayOrderId: string;
  razorpayPaymentId:string;
  isAcknowledged: boolean;
  addOn?: { title: string, price: number }[];
  tips?: number;
  createdAt: Date;
  updatedAt: Date;
  orderSource?:string;
  paymentUpdate?:string;
  paymentMethod?:string;
}

// Define a mapping of services to their respective prices
// const servicePrices: { [key: string]: string } = {
//   "Car foam wash": "679",
//   "Car + Bike combo": "899",
//   "Bi Weekly": "1199",
//   "Weekly": "2199",
// };
//changing to number
const servicePrices: Record<string, number> = {
  "Car foam wash": 679,
  "Car + Bike combo": 899,
  "Bi Weekly": 1199,
  "Weekly": 2199,
};

// Define the Order schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: false, // Makes email optional
      unique: false,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          // Only validate if the email is provided (not null or undefined)
          return value ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) : true;
        },
        message: "Please enter a valid email address",
      },
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      enum: Object.keys(servicePrices),
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    landmark: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      validate: {
        validator: (value: string) => {
          return /^[0-9]{6}$/.test(value);
        },
        message: "Please enter a valid 6-digit pincode",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    carType:{
      type:String,
      enum: ["Hatchback", "Sedan", "SUV", "MUV"],
      required: [true, "car type is required"],

    },
    timeSlot: {
      type: String,
      required: [true, "Time is required"],
    },
    notes: {
      type: String,
      required: false
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Success", "Cancelled", "Failed", "Refunded"],
      default: "Pending",
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Accepted", "Rejected", "OnTheWay", "Completed"],
      default: "Pending",
    },
    receipt: {
      type: Buffer,
      required: false,
    },
    addOn: [
      {
        title: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    
    razorpayOrderId: { type: String }, // Add Razorpay order ID field
    razorpayPaymentId: { type: String }, // Add Razorpay payment ID field
    //Achknow
    isAcknowledged: {
      type: Boolean,
      default: false
    },
    tips: {
      type: Number,
    },
    orderSource: {
      type: String,
    },
    paymentUpdate: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to automatically fetch price based on service
orderSchema.pre<IOrder>("save", function (next) {
  const selectedService = this.service;
  const servicePrice = servicePrices[selectedService];

  if (!servicePrice) {
    const error = new Error(`Invalid service: ${selectedService}`);
    return next(error);
  }

  this.price = servicePrice;
  next();
});

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
