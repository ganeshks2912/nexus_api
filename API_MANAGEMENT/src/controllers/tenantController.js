import { 
  createTenantService,
  getMyTenantsService, 
  inviteMemberService,
  getTenantMembersService,
  updateMemberRoleService,
  removeMemberService
} from "../services/tenantService.js";

export const createTenant = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const tenant = await createTenantService(
      name,
      slug,
      req.user.id//middleware jwt
    );

    return res.status(201).json({
      success: true,
      tenant
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export async function getMyTenants(req, res) {
  try {
    const tenants = await getMyTenantsService(req.user.id);

    res.status(200).json({
      success: true,
      tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function inviteMember(
  req,
  res
) {
  try {
    const { tenantId } = req.params;

    const { email, role } = req.body;

    const member =
      await inviteMemberService(
        tenantId,
        req.user.id,
        email,
        role
      );

    res.status(201).json({
      success: true,
      member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getMembers(
  req,
  res
) {
  try {
    const { tenantId } = req.params;

    const members =
      await getTenantMembersService(
        tenantId,
        req.user.id
      );

    res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateMemberRole(
  req,
  res
) {
  try {
    const { tenantId, userId } =
      req.params;

    const { role } = req.body;

    const updatedMember =
      await updateMemberRoleService(
        tenantId,
        req.user.id,
        userId,
        role
      );

    res.status(200).json({
      success: true,
      member: updatedMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function removeMember(
  req,
  res
) {
  try {
    const { tenantId, userId } =
      req.params;

    const removedMember =
      await removeMemberService(
        tenantId,
        req.user.id,
        userId
      );

    return res.status(200).json({
      success: true,
      member: removedMember
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}