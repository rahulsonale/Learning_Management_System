import { Schema, model } from "mongoose";

const lectureSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    duration: Number,
  },
  { timestamps: true },
);

export default model("Lecture", lectureSchema);
