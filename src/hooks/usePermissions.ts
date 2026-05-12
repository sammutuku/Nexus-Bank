import { moduleRegistry } from '@modules/registry';

export const usePermissions = (moduleId: number) => {
  const module = moduleRegistry[moduleId];
  
  // 1. If it's a 'V' type, Write actions are always false
  if (module?.type === 'V') {
    return { canAdd: false, canEdit: false, canDelete: false, canSearch: true };
  }

  // 2. Otherwise, check against User Roles (Placeholder logic for now)
  const userRole = "TELLER"; // This will come from AuthContext
  
  return {
    canAdd: userRole !== "VIEWER",
    canEdit: userRole === "OFFICER" || userRole === "ADMIN",
    canDelete: userRole === "ADMIN",
    canSearch: true
  };
};