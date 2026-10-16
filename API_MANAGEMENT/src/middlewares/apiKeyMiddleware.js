import crypto from "crypto";

import {
  findApiKeyByHash
} from "../repositories/apiKeyRepository.js";

export async function authenticateApiKey(
  req,
  res,
  next
) {
    
  try {
    const apiKey =
      req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key required"
      });
    }

    const keyHash =
      crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

    const keyRecord =
      await findApiKeyByHash(
        keyHash
      );

    if (!keyRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key"
      });
    }

    if (
      keyRecord.expires_at &&
      new Date(keyRecord.expires_at) <
        new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "API key expired"
      });
    }

    req.apiKey = keyRecord;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}