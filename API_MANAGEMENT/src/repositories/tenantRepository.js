import pool from "../config/db.js";

export const createTenant = async (id, name, slug, ownerId) => {
  const query = `
    INSERT INTO tenants (id, name, slug, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    id,
    name,
    slug,
    ownerId
  ]);

  return result.rows[0];
};

export const findTenantBySlug = async (slug) => {
  const result = await pool.query(
    "SELECT * FROM tenants WHERE slug = $1",
    [slug]
  );

  return result.rows[0];
};

export async function getTenantsByUserId(userId) {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.name,
      t.slug,
      tm.role,
      t.created_at
    FROM tenant_members tm
    JOIN tenants t
      ON tm.tenant_id = t.id
    WHERE tm.user_id = $1
    ORDER BY t.created_at DESC
    `,
    [userId]
  );

  return result.rows;
}