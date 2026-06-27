import { Router } from "express";
import {
  completeLecture,
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  getMyEnrollments,
} from "../controllers/enrollment-controller.mjs";
import verifyToken from "../middleware/verify-token.mjs";

const router = new Router();

router.use(verifyToken);

router.get("/", getMyEnrollments);
router.get("/:id", getEnrollmentById);
router.post("/course/:courseId", createEnrollment);
router.patch("/:id/lectures/:lectureId/complete", completeLecture);
router.delete("/:id", deleteEnrollment);

export default router;
