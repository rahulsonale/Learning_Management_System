import { Router } from "express";
import {
  login,
  logout,
  me,
  registerUser,
} from "../controllers/auth-controller.mjs";
import verfiyToken from "../middleware/verify-token.mjs";
const router = new Router();

router.post("/register", registerUser);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", verfiyToken, me);

export default router;
