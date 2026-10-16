import express from "express";
import { createTenant,getMyTenants,inviteMember,getMembers,updateMemberRole,removeMember } from "../controllers/tenantController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTenant);
router.get("/my-tenants",authenticate,getMyTenants);
router.post( "/:tenantId/members", authenticate, inviteMember);
router.get(
  "/:tenantId/members",
  authenticate,
  getMembers
);
router.patch(
  "/:tenantId/members/:userId",
  authenticate,
  updateMemberRole
);
router.delete(
  "/:tenantId/members/:userId",
  authenticate,
  removeMember
);

export default router;