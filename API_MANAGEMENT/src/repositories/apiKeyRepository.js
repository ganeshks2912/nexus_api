import pool from "../config/db.js";

export async function createApiKey(
  id,
  apiId,
  name,
  keyHash,
  expiresAt,
  createdBy
) {
  const result = await pool.query(
    `
    INSERT INTO api_keys (
      id,
      api_id,
      name,
      key_hash,
      expires_at,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
    [
      id,
      apiId,
      name,
      keyHash,
      expiresAt,
      createdBy
    ]
  );

  return result.rows[0];
}

export async function getApiKeysByApi(
  apiId
) {
  const result = await pool.query(
    `
    SELECT
      id,
      api_id,
      name,
      expires_at,
      is_active,
      created_by,
      created_at
    FROM api_keys
    WHERE api_id = $1
    ORDER BY created_at DESC;
    `,
    [apiId]
  );

  return result.rows;
}

export async function findApiKeyById(
  keyId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM api_keys
    WHERE id = $1;
    `,
    [keyId]
  );

  return result.rows[0];
}

export async function findApiKeyByHash(
  keyHash
) {
  const result = await pool.query(
    `
    SELECT *
    FROM api_keys
    WHERE key_hash = $1
      AND is_active = TRUE;
    `,
    [keyHash]
  );

  return result.rows[0];
}

export async function revokeApiKey(
  keyId
) {
  const result = await pool.query(
    `
    UPDATE api_keys
    SET is_active = FALSE
    WHERE id = $1
    RETURNING
      id,
      api_id,
      name,
      expires_at,
      is_active,
      created_by,
      created_at
    `,
    [keyId]
  );

  return result.rows[0];
}