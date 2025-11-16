import { Schema, model } from "mongoose";
import type { IUser } from "../types/user.types.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

// type-safe model
const User = model<IUser>("User", userSchema);

export default User;
