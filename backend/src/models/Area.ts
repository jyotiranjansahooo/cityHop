import mongoose, {
  Schema,
  Types,
  type Model,
} from "mongoose";

export interface IArea {
  name: string;
  city: Types.ObjectId;
  description?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const areaSchema = new Schema<IArea>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    latitude: Number,
    longitude: Number,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

areaSchema.index(
  { name: 1, city: 1 },
  { unique: true },
);

const Area =
  (mongoose.models.Area as Model<IArea>) ||
  mongoose.model<IArea>("Area", areaSchema);

export default Area;