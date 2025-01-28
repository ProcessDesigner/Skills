// models/User.js
import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please enter a valid email address",
      ], // General email format validation
    },
    password: {
      type: String,
      required: true,
    },
    classroom: {
      type: String, // Set FYCM1 as the default value
    },
    prn: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastLogout: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    rollNo: {
      type: Number,
    },
    usageTime: {
      type: [String],
      default: [],
    },
    expResult: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the user model
export const User = mongoose.model("User", userSchema);
