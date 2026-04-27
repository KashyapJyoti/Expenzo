import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/avatar", updateAvatar);

export default router;

