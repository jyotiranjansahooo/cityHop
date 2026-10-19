import mongoose, { Schema, model, Types, type Model } from "mongoose";

export type NotificationType =
  | "booking_approved"
  | "booking_rejected"
  | "booking_cancelled";

export interface INotification {
  recipient: Types.ObjectId;
  actor?: Types.ObjectId;
  booking: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      immutable: true,
    },

    type: {
      type: String,
      enum: ["booking_approved", "booking_rejected", "booking_cancelled"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification> | undefined) ??
  model<INotification>("Notification", notificationSchema);

export default Notification;
