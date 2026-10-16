import express from "express";

import {
  createApi,
  getApis,
  getApiById,
  updateApi,
  deleteApi
} from "../controllers/apiController.js";

import {
  authenticate
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  createApi
);

router.get(
  "/:tenantId",
  authenticate,
  getApis
);
router.get(
  "/details/:apiId",
  authenticate,
  getApiById
);
router.patch(
  "/:apiId",
  authenticate,
  updateApi
);
router.delete(
  "/:apiId",
  authenticate,
  deleteApi
);
export default router;