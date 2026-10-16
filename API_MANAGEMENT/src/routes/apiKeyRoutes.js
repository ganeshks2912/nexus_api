import express from "express";

import { authenticate }
  from "../middlewares/authMiddleware.js";

import {
  createApiKey,
  getApiKeys,
  revokeApiKey
} from "../controllers/apiController.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  createApiKey
);

router.get(
  "/:apiId",
  authenticate,
  getApiKeys
);

router.patch(
  "/:keyId/revoke",
  authenticate,
  revokeApiKey
);

export default router;