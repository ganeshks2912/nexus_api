import { Router } from "express";
import {
  register,
  login,
  getMe,
  refresh,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, getMe);

export default router;