import express from "express";

import { authenticate }
  from "../middlewares/authMiddleware.js";

import { getAnalytics }
  from "../controllers/analyticsController.js";

const router = express.Router();

router.get(
  "/:apiId",
  authenticate,
  getAnalytics
);

export default router;