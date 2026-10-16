import pool from "../config/db.js";

export const addTenantMember = async (
  tenantId,
  userId,
  role
) => {
  const query = `
    INSERT INTO tenant_members (
      tenant_id,
      user_id,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    tenantId,
    userId,
    role
  ]);

  return result.rows[0];
};

export async function findTenantMember(
  tenantId,
  userId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM tenant_members
    WHERE tenant_id = $1
      AND user_id = $2
    `,
    [tenantId, userId]
  );

  return result.rows[0];
}

export async function getTenantMembers(
  tenantId
) {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      tm.role
    FROM tenant_members tm
    JOIN users u
      ON tm.user_id = u.id
    WHERE tm.tenant_id = $1
    ORDER BY u.name;
    `,
    [tenantId]
  );

  return result.rows;
}

export async function updateTenantMemberRole(
  tenantId,
  userId,
  role
) {
  const result = await pool.query(
    `
    UPDATE tenant_members
    SET role = $3
    WHERE tenant_id = $1
      AND user_id = $2
    RETURNING *;
    `,
    [tenantId, userId, role]
  );

  return result.rows[0];
}

export async function removeTenantMember(
  tenantId,
  userId
) {
  const result = await pool.query(
    `
    DELETE FROM tenant_members
    WHERE tenant_id = $1
      AND user_id = $2
    RETURNING *;
    `,
    [tenantId, userId]
  );

  return result.rows[0];
}

export async function countOwners(
  tenantId
) {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM tenant_members
    WHERE tenant_id = $1
      AND role = 'OWNER'
    `,
    [tenantId]
  );

  return Number(
    result.rows[0].count
  );
}