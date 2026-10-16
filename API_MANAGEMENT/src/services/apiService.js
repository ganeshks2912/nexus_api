import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  createApi,
  getApisByTenant,
  findApiById,
  updateApi,
  deleteApi
} from "../repositories/apiRepository.js";

import {
  findTenantMember
} from "../repositories/tenantMemberRepository.js";
import {
  createApiKey,
  getApiKeysByApi,
  findApiKeyById,
  revokeApiKey,
} from "../repositories/apiKeyRepository.js";

export async function createApiService(
  tenantId,
  userId,
  name,
  description,
  baseUrl
) {
  // Step 1
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

  // Step 2
  if (
    membership.role === "VIEWER"
  ) {
    throw new Error(
      "VIEWER cannot create APIs"
    );
  }

  // Step 3
  return await createApi(
    tenantId,
    name,
    description,
    baseUrl,
    userId
  );
}

export async function getApisService(
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

  return await getApisByTenant(
    tenantId
  );
}

export async function getApiByIdService(
  apiId,
  userId
) {
  const api =
    await findApiById(apiId);

  if (!api) {
    throw new Error(
      "API not found"
    );
  }

  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  return api;
}

export async function updateApiService(
  apiId,
  userId,
  name,
  description,
  baseUrl,
  status
) {
  // Step 1
  const api =
    await findApiById(apiId);

  if (!api) {
    throw new Error(
      "API not found"
    );
  }

  // Step 2
  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  // Step 3
  if (
    membership.role === "VIEWER"
  ) {
    throw new Error(
      "VIEWER cannot update APIs"
    );
  }

  // Step 4
  return await updateApi(
    apiId,
    name,
    description,
    baseUrl,
    status
  );
}

export async function deleteApiService(
  apiId,
  userId
) {
  const api =
    await findApiById(apiId);

  if (!api) {
    throw new Error(
      "API not found"
    );
  }

  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  if (
    membership.role !== "OWNER" &&
    membership.role !== "ADMIN"
  ) {
    throw new Error(
      "Only OWNER or ADMIN can delete APIs"
    );
  }

  return await deleteApi(
    apiId
  );
}

export async function createApiKeyService(
  apiId,
  userId,
  name,
  expiresAt
) {
  const api =
    await findApiById(apiId);

  if (!api) {
    throw new Error(
      "API not found"
    );
  }

  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  if (
    membership.role === "VIEWER"
  ) {
    throw new Error(
      "VIEWER cannot create API keys"
    );
  }

  const rawKey =
    "sk_live_" +
    crypto
      .randomBytes(32)
      .toString("hex");

  const keyHash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  const apiKey =
    await createApiKey(
      uuidv4(),
      apiId,
      name,
      keyHash,
      expiresAt,
      userId
    );

  return {
    apiKey,
    rawKey
  };
}

export async function getApiKeysService(
  apiId,
  userId
) {
  const api =
    await findApiById(apiId);

  if (!api) {
    throw new Error(
      "API not found"
    );
  }

  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "You are not a member of this tenant"
    );
  }

  return await getApiKeysByApi(
    apiId
  );
}

export async function revokeApiKeyService(
  keyId,
  userId
) {
  const apiKey =
    await findApiKeyById(keyId);

  if (!apiKey) {
    throw new Error(
      "API key not found"
    );
  }

  const api =
    await findApiById(
      apiKey.api_id
    );

  const membership =
    await findTenantMember(
      api.tenant_id,
      userId
    );

  if (!membership) {
    throw new Error(
      "Access denied"
    );
  }

  if (
    membership.role === "VIEWER"
  ) {
    throw new Error(
      "VIEWER cannot revoke API keys"
    );
  }

  return await revokeApiKey(
    keyId
  );
}