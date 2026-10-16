import {
  createApiService,
  getApisService,
  getApiByIdService,
  updateApiService,
  deleteApiService,
  createApiKeyService,
  getApiKeysService,
  revokeApiKeyService
} from "../services/apiService.js";

export async function createApi(
  req,
  res
) {
  try {
    const {
      tenantId,
      name,
      description,
      baseUrl
    } = req.body;

    const api =
      await createApiService(
        tenantId,
        req.user.id,
        name,
        description,
        baseUrl
      );

    return res.status(201).json({
      success: true,
      api
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getApis(
  req,
  res
) {
  try {
    const { tenantId } =
      req.params;

    const apis =
      await getApisService(
        tenantId,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      apis
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getApiById(
  req,
  res
) {
  try {
    const { apiId } =
      req.params;

    const api =
      await getApiByIdService(
        apiId,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      api
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateApi(
  req,
  res
) {
  try {
    const { apiId } = req.params;

    const {
      name,
      description,
      baseUrl,
      status
    } = req.body;

    const api =
      await updateApiService(
        apiId,
        req.user.id,
        name,
        description,
        baseUrl,
        status
      );

    return res.status(200).json({
      success: true,
      api
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function deleteApi(
  req,
  res
) {
  try {
    const { apiId } =
      req.params;

    const api =
      await deleteApiService(
        apiId,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      api
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function createApiKey(
  req,
  res
) {
  try {
    const {
      apiId,
      name,
      expiresAt
    } = req.body;

    const result =
      await createApiKeyService(
        apiId,
        req.user.id,
        name,
        expiresAt
      );

    return res.status(201).json({
      success: true,
      apiKey: result.apiKey,
      secretKey: result.rawKey
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getApiKeys(
  req,
  res
) {
  try {
    const { apiId } =
      req.params;

    const keys =
      await getApiKeysService(
        apiId,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      keys
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function revokeApiKey(
  req,
  res
) {
  try {
    const { keyId } =
      req.params;

    const apiKey =
      await revokeApiKeyService(
        keyId,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      apiKey
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}