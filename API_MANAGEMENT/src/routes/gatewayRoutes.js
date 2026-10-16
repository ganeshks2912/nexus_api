import express from "express";

import { authenticateApiKey }
  from "../middlewares/apiKeyMiddleware.js";

import { gatewayHandler }
  from "../controllers/gatewayController.js";

import {
  rateLimitMiddleware
} from "../middlewares/rateLimitMiddleware.js";

import {
  loadApiMiddleware
} from "../middlewares/loadApiMiddleware.js";

const router = express.Router();

router.all(
  "/:apiId/:endpoint",
  authenticateApiKey,
  loadApiMiddleware,
  rateLimitMiddleware,
  gatewayHandler
);

export default router;