import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default model("Enrollment", enrollmentSchema);
