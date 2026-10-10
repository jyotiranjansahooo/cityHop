import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const resetUserPassword = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(mongoUri);

    const email = "zoro50964@gmail.com";
    const newPassword = process.env.RESET_USER_PASSWORD;

    if (!newPassword || newPassword.length < 8) {
      throw new Error(
        "Set RESET_USER_PASSWORD to a password of at least 8 characters",
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("User account was not found");
    }

    user.password = newPassword;
    await user.save();

    const updatedUser = await User.findById(user._id).select("+password");

    if (!updatedUser) {
      throw new Error("Could not verify the updated account");
    }

    const passwordMatches = await bcrypt.compare(
      newPassword,
      updatedUser.password,
    );

    if (!passwordMatches) {
      throw new Error("Password verification failed after reset");
    }

    console.info("Password reset and verification successful.");
  } finally {
    await mongoose.disconnect();
  }
};

resetUserPassword().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Password reset failed",
  );
  process.exitCode = 1;
});
