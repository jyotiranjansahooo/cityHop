import mongoose, { Schema, type InferSchemaType } from "mongoose";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type IBooking = InferSchemaType<typeof bookingSchema>;

const Booking = mongoose.model<IBooking>(
"Booking",
bookingSchema,
);

export default Booking;

