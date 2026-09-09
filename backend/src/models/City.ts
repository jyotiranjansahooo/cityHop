import mongoose, { Schema, type Model } from "mongoose";

export interface ICity {
  name: string;
  state: string;
  country: string;
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
      minlength: 2,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      default: "Odisha",
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const City: Model<ICity> =
  mongoose.models.City ||
  mongoose.model<ICity>("City", citySchema);

export default City;