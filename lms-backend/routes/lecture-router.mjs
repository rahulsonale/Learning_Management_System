import { Router } from "express";
import {
  addLectureToCourse,
  deleteLecture,
  getLectureById,
  getLectures,
  summarizeLecture,
  updateLecture,
} from "../controllers/lecture-controller.mjs";
import verifyToken from "../middleware/verify-token.mjs";

const router = new Router();

router.get("/", getLectures);
router.get("/:id", getLectureById);
router.post("/:id/summarize", summarizeLecture);
router.post("/course/:courseId", verifyToken, addLectureToCourse);
router.patch("/:id", verifyToken, updateLecture);
router.delete("/:id", verifyToken, deleteLecture);

export default router;
