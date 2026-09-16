import { Schema, model, models, Types, type Model } from "mongoose";
export type HostelType = "boys" | "girls" | "co-living";

export interface IHostelImage {
  _id?: Types.ObjectId;
  url: string;
  publicId: string;
}

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

  images: IHostelImage[];

  description?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const hostelImageSchema = new Schema<IHostelImage>(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const hostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      enum: ["boys", "girls", "co-living"],
      required: true,
    },

    address: {
      type: String,
      required: true,
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

    monthlyRent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [hostelImageSchema],
      default: [],
    },

    description: {
      type: String,
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

const Hostel: Model<IHostel> =
  models.Hostel instanceof Function
    ? (models.Hostel as Model<IHostel>)
    : model<IHostel>("Hostel", hostelSchema);

export default Hostel;
