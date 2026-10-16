import pool  from "../config/db.js";

export async function createApi(
  tenantId,
  name,
  description,
  baseUrl,
  createdBy
) {
  const result = await pool.query(
    `
    INSERT INTO apis (
      id,
      tenant_id,
      name,
      description,
      base_url,
      created_by
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING *;
    `,
    [
      tenantId,
      name,
      description,
      baseUrl,
      createdBy
    ]
  );

  return result.rows[0];
}


export async function findApiById(
  apiId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM apis
    WHERE id = $1
    `,
    [apiId]
  );

  return result.rows[0];
}

export async function getApisByTenant(
  tenantId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM apis
    WHERE tenant_id = $1
    ORDER BY created_at DESC
    `,
    [tenantId]
  );

  return result.rows;
}

export async function updateApi(
  apiId,
  name,
  description,
  baseUrl,
  status
) {
  const result = await pool.query(
    `
    UPDATE apis
    SET
      name = $2,
      description = $3,
      base_url = $4,
      status = $5
    WHERE id = $1
    RETURNING *;
    `,
    [
      apiId,
      name,
      description,
      baseUrl,
      status
    ]
  );

  return result.rows[0];
}

export async function deleteApi(
  apiId
) {
  const result = await pool.query(
    `
    DELETE FROM apis
    WHERE id = $1
    RETURNING *;
    `,
    [apiId]
  );

  return result.rows[0];
}