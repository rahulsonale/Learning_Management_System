import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
  },
  { timestamps: true },
);

export default model("User", usersSchema);
