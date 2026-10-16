import { v4 as uuidv4 } from "uuid";
import {
  createTenant,
  findTenantBySlug,
  getTenantsByUserId,
} from "../repositories/tenantRepository.js";
import {
  addTenantMember,
  findTenantMember,
  getTenantMembers,
  updateTenantMemberRole,
  removeTenantMember,
  countOwners
} from "../repositories/tenantMemberRepository.js";
import { findUserByEmail }
from "../repositories/userRepository.js";

export const createTenantService = async (
  name,
  slug,
  userId
) => {
  const existingTenant =
    await findTenantBySlug(slug);

  if (existingTenant) {
    throw new Error("Slug already exists");
  }

  const tenantId = uuidv4();

  const tenant = await createTenant(
    tenantId,
    name,
    slug,
    userId
  );

  await addTenantMember(
    tenantId,
    userId,
    "OWNER"
  );

  return tenant;
};

export async function getMyTenantsService(userId) {
  return await getTenantsByUserId(userId);
}

export async function inviteMemberService(
  tenantId,
  inviterId,
  email,
  role
) {
  // Step 1
  const invitedUser =
    await findUserByEmail(email);

  if (!invitedUser) {
    throw new Error("User not found");
  }

  // Step 2
  const inviterMembership =
    await findTenantMember(
      tenantId,
      inviterId
    );

  if (!inviterMembership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  // Step 3
  if (
    inviterMembership.role !== "OWNER" &&
    inviterMembership.role !== "ADMIN"
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  if (
  inviterMembership.role === "ADMIN" &&
  role === "OWNER"
) {
  throw new Error(
    "ADMIN cannot assign OWNER role"
  );
}

  // Step 4
  const existingMember =
    await findTenantMember(
      tenantId,
      invitedUser.id
    );

  if (existingMember) {
    throw new Error(
      "User is already a member"
    );
  }

  // Step 5
  return await addTenantMember(
    tenantId,
    invitedUser.id,
    role
  );
}

export async function getTenantMembersService(
  tenantId,
  userId
) {
  const membership =
    await findTenantMember(
      tenantId,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  return await getTenantMembers(
    tenantId
  );
}

export async function updateMemberRoleService(
  tenantId,
  requesterId,
  targetUserId,
  newRole
) {
  // Check requester membership
  const requesterMembership =
    await findTenantMember(
      tenantId,
      requesterId
    );

  if (!requesterMembership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  // OWNER or ADMIN only
  if (
    requesterMembership.role !== "OWNER" &&
    requesterMembership.role !== "ADMIN"
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  // Check target exists
  const targetMembership =
    await findTenantMember(
      tenantId,
      targetUserId
    );

  if (!targetMembership) {
    throw new Error(
      "Target member not found"
    );
  }
  // ADMIN cannot modify OWNER
if (
  requesterMembership.role === "ADMIN" &&
  targetMembership.role === "OWNER"
) {
  throw new Error(
    "Cannot modify OWNER"
  );
}

// ADMIN cannot assign OWNER role
if (
  requesterMembership.role === "ADMIN" &&
  newRole === "OWNER"
) {
  throw new Error(
    "ADMIN cannot assign OWNER role"
  );
}

if (
  targetMembership.role === "OWNER" &&
  newRole !== "OWNER"
) {
  const ownerCount =
    await countOwners(
      tenantId
    );

  if (ownerCount === 1) {
    throw new Error(
      "Cannot change the last OWNER role"
    );
  }
}

  return await updateTenantMemberRole(
    tenantId,
    targetUserId,
    newRole
  );
}

export async function removeMemberService(
  tenantId,
  requesterId,
  targetUserId
) {
  // Step 1
  const requesterMembership =
    await findTenantMember(
      tenantId,
      requesterId
    );

  if (!requesterMembership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  // Step 2
  if (
    requesterMembership.role !== "OWNER" &&
    requesterMembership.role !== "ADMIN"
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  // Step 3
  const targetMembership =
    await findTenantMember(
      tenantId,
      targetUserId
    );

  if (!targetMembership) {
    throw new Error(
      "Target user is not a member"
    );
  }

  // Step 4
  if (
    requesterMembership.role === "ADMIN" &&
    targetMembership.role === "OWNER"
  ) {
    throw new Error(
      "ADMIN cannot remove OWNER"
    );
  }

  if (
  targetMembership.role === "OWNER"
) {
  const ownerCount =
    await countOwners(
      tenantId
    );

  if (ownerCount === 1) {
    throw new Error(
      "Cannot remove the last OWNER"
    );
  }
}

  // Step 5
  return await removeTenantMember(
    tenantId,
    targetUserId
  );
}