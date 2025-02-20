
import mongoose, { Document, Schema } from "mongoose";

interface ITipReport extends Document {
  userId: Schema.Types.ObjectId; 
  orderId: Schema.Types.ObjectId; 
  userName: string; 
  userEmail: string;
  userPhoneNumber: string;
  orderPrice: string;
  orderCreatedAt: Date;
  orderUpdatedAt: Date;
}



const tipReportSchema = new mongoose.Schema<ITipReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhoneNumber: {
      type: String,
      required: true,
    },
    orderPrice: {
      type: String,
      required: true,
    },
    orderCreatedAt: {
      type: Date,
      required: true,
    },
    orderUpdatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const TipReport =
  mongoose.models.TipReport || mongoose.model<ITipReport>("TipReport", tipReportSchema);

export default TipReport;