import mongoose, { Schema, model, Types, type Model } from "mongoose";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface IBooking {
  user: Types.ObjectId;
  hostel: Types.ObjectId;
  owner: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: BookingStatus;
  monthlyRent: number;
  rejectionReason?: string | null;
  cancellationReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      immutable: true,
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    checkInDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date): boolean => Number.isFinite(value.getTime()),
        message: "Invalid check-in date",
      },
    },

    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date): boolean => Number.isFinite(value.getTime()),
        message: "Invalid check-out date",
      },
    },

    guests: {
      type: Number,
      required: true,
      min: [1, "At least one guest is required"],
      validate: {
        validator: (value: number): boolean => Number.isInteger(value),
        message: "Guests must be a whole number",
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      required: true,
      index: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: [0, "Monthly rent cannot be negative"],
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, status: 1, createdAt: -1 });
bookingSchema.index({
  hostel: 1,
  status: 1,
  checkInDate: 1,
  checkOutDate: 1,
});

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking> | undefined) ??
  model<IBooking>("Booking", bookingSchema);

export default Booking;
