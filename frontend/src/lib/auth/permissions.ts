import "server-only";

import type { Role } from "@/constants/roles";
import { ROLE_HIERARCHY } from "@/constants/roles";

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessResource(
  userRole: Role,
  requiredRoles: Role[],
): boolean {
  return requiredRoles.some((role) => hasRole(userRole, role));
}

export function requireRole(userRole: Role, requiredRole: Role): boolean {
  return hasRole(userRole, requiredRole);
}
