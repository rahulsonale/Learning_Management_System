import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    thumbnail: String,
    totalStudents: Number,
  },
  { timestamps: true },
);

export default model("Course", courseSchema);
