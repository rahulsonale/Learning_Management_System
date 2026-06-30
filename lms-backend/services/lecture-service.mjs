import { text } from "express";
import Course from "../models/course.mjs";
import Lecture from "../models/lecture.mjs";
import { fetchTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

function canManageCourse(user, course) {
  return (
    user?.role === "instructor" && course.instructor.toString() === user.id
  );
}

async function findManageableCourse(user, courseId) {
  const course = await Course.findById(courseId);

  if (!course) {
    return { status: 404, error: "Course not found" };
  }

  if (!canManageCourse(user, course)) {
    return { status: 403, error: "You cannot manage lectures for this course" };
  }

  return { course };
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const openAI = createOpenAI({
  // http://localhost:11434/v1
  baseURL: process.env.OLLAMA_API_URL,
  apiKey: "ollama",
});

async function summarize(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `
        can you give key takeaways for this
        ${content}
        `,
    config: {
      systemInstruction:
        "You are a software engineer who specializes in mern stack",
    },
  });
  console.log(response.text);
  return response.text;
}

async function summarize_v2(content) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    prompt: content,
  });
  return text;
}
function summarize_v3(content) {
  return streamText({
    model: google("gemini-2.5-flash-lite"),
    messages: [
      {
        role: "user",
        content: `Can you give key takeaways for this lecture transcript? ${content}`,
      },
    ],
  });
}

export async function fetchLectures(courseId) {
  const filter = courseId ? { course: courseId } : {};

  const lectures = await Lecture.find(filter)
    .populate("course", "title")
    .sort({ createdAt: 1 });

  return lectures;
}

export async function summary_ollama(content) {
  return streamText({
    model: openAI("llama3.2:3b"),
    system:
      `You are an expert mern stack instructor.` +
      `you are teaching students in a bootcamp.` +
      `you are going to give a summary on the transcript of the provided lecture.` +
      `give topic wise summary in markdown format` +
      `Give response in markdown format.`,
    prompt: `please summarize the lecture transcript provided \n` + content,
  });
}

export async function chatWithLecture(id, question) {
  const lecture = await Lecture.findById(id);

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  const transcripts = await fetchTranscript(lecture.videoUrl);

  const transcript = transcripts.reduce(
    (prev, current) => ({
      text: prev.text + " " + current.text,
    }),
    { text: "" },
  );

  return streamText({
    model: google("gemini-2.5-flash-lite"),
    system: `
      You are an expert instructor.
      Answer the student's question using the lecture transcript.
      If the answer is not available in the transcript, clearly say so.
      Keep answers concise and educational.
    `,
    messages: [
      {
        role: "user",
        content: `
Transcript:
${transcript.text}

Question:
${question}
        `,
      },
    ],
  });
}

export async function summarizeLecture(id) {
  const lecture = await Lecture.findById(id);
  const transcripts = await fetchTranscript(lecture.videoUrl);
  console.log("Transcripts:", transcripts);
  const transcript = transcripts.reduce((prev, current) => ({
    text: prev.text + " " + current.text,
    duration: prev.duration + current.duration,
  }));
  console.log("Transcript object:", transcript);
  console.log("Transcript text:", transcript.text, typeof transcript.text);
  return summarize_v3(transcript.text);
}

export async function fetchLectureById(id) {
  return Lecture.findById(id).populate("course", "title");
}

export async function createLecture(user, courseId, lectureData) {
  const { course, error, status } = await findManageableCourse(user, courseId);

  if (error) {
    return { error, status };
  }

  const { title, description, videoUrl, duration } = lectureData;
  const lecture = await Lecture.create({
    title,
    description,
    videoUrl,
    duration,
    course: course._id,
  });

  course.lectures.push(lecture._id);
  await course.save();

  return { lecture };
}

export async function editLecture(user, lectureId, updates) {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return { status: 404, error: "Lecture not found" };
  }

  const { error, status } = await findManageableCourse(user, lecture.course);

  if (error) {
    return { error, status };
  }

  const allowedUpdates = ["title", "description", "videoUrl", "duration"];
  for (const field of allowedUpdates) {
    if (updates[field] !== undefined) {
      lecture[field] = updates[field];
    }
  }

  await lecture.save();
  return { lecture };
}

export async function removeLecture(user, lectureId) {
  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    return { status: 404, error: "Lecture not found" };
  }

  const { course, error, status } = await findManageableCourse(
    user,
    lecture.course,
  );

  if (error) {
    return { error, status };
  }

  course.lectures.pull(lecture._id);
  await course.save();
  await lecture.deleteOne();

  return { message: "Lecture deleted successfully" };
}
