import mongoose, {
  Schema,
  Types,
  type Model,
} from "mongoose";

export type HostelType = "boys" | "girls" | "unisex";

export interface IHostel {
  name: string;

  owner: Types.ObjectId;
  city: Types.ObjectId;
  area: Types.ObjectId;

  type: HostelType;

  address: string;

  latitude: number;
  longitude: number;

  monthlyRent: number;
  securityDeposit?: number;

  amenities: string[];
  images: string[];

  description?: string;

  isAvailable: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const hostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    area: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },

    type: {
      type: String,
      enum: ["boys", "girls", "unisex"],
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    isAvailable: {
      type: Boolean,
      default: true,
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

hostelSchema.index({
  city: 1,
  area: 1,
  monthlyRent: 1,
});

const Hostel: Model<IHostel> =
  mongoose.models.Hostel ||
  mongoose.model<IHostel>("Hostel", hostelSchema);

export default Hostel;