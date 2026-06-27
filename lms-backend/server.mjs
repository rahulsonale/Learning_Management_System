import "dotenv/config";
import express from "express";
import { connect, disconnect } from "./config/db.mjs";
import chalk from "chalk";
import cors from "cors";
// import userRouter from "./routes/user-router.mjs"
import authRouter from "./routes/auth-router.mjs";
import courseRouter from "./routes/course-router.mjs";
import enrollmentRouter from "./routes/enrollment-router.mjs";
import lectureRouter from "./routes/lecture-router.mjs";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/lectures", lectureRouter);
app.use("/api/enrollments", enrollmentRouter);

await connect(process.env.CONNECTION_STRING);

const server = app.listen(process.env.PORT, () => {
  console.log(
    chalk.greenBright(`Server is running on port ${process.env.PORT}`),
  );
});

process.on("SIGINT", async () => {
  console.log(
    chalk.yellowBright("Received SIGINT. Shutting down gracefully..."),
  );
  await disconnect();
  await server.close();
  process.exit(0);
});

process.on("uncaughtException", async (err) => {
  console.error(chalk.redBright("Uncaught Exception:", err));
  await disconnect();
  process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) => {
  console.error(
    chalk.redBright("Unhandled Rejection at:", promise, "reason:", reason),
  );
  await disconnect();
  process.exit(1);
});
