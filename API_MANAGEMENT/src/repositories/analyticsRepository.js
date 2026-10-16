import pool from "../config/db.js";

export async function getApiAnalytics(apiId, userId) {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total_requests,

      COUNT(*) FILTER (
        WHERE m.status_code >= 200
        AND m.status_code < 400
      ) AS successful_requests,

      COUNT(*) FILTER (
        WHERE m.status_code >= 400
      ) AS failed_requests,

      ROUND(AVG(m.response_time_ms)) AS average_response_time,

      MIN(m.response_time_ms) AS min_response_time,

      MAX(m.response_time_ms) AS max_response_time

    FROM api_metrics m
    JOIN apis a
      ON a.id = m.api_id

    JOIN tenant_members tm
      ON tm.tenant_id = a.tenant_id

    WHERE m.api_id = $1
      AND tm.user_id = $2;
    `,
    [apiId, userId]
  );

  return result.rows[0];
}