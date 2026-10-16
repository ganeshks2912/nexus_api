import pool from "../config/db.js";

export async function createMetric({
  apiId,
  apiKeyId,
  statusCode,
  responseTimeMs,
}) {
  const query = `
    INSERT INTO api_metrics (
      api_id,
      api_key_id,
      status_code,
      response_time_ms
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    apiId,
    apiKeyId,
    statusCode,
    responseTimeMs,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
}