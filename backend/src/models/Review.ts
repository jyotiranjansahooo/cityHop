import mongoose, {
  Schema,
  model,
  Types,
  type Model,
} from "mongoose";

export interface IReview {
  user: Types.ObjectId;
  hostel: Types.ObjectId;
  booking: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
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

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      immutable: true,
      unique: true,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: (value: number): boolean =>
          Number.isInteger(value),
        message: "Rating must be a whole number from 1 to 5",
      },
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Review must contain at least 5 characters"],
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reviewSchema.index({ hostel: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

const Review: Model<IReview> =
  (mongoose.models.Review as Model<IReview> | undefined) ??
  model<IReview>("Review", reviewSchema);

export default Review;