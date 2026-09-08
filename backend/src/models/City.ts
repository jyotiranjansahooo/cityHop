import mongoose, { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  state: "Odisha";
  slug: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    state: {
      type: String,
      required: true,
      default: "Odisha",
      enum: ["Odisha"],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const City =
  mongoose.models.City || model<ICity>("City", citySchema);

export default City;