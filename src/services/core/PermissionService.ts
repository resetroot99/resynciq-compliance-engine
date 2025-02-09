export class PermissionService {
  private static PERMISSIONS = {
    ESTIMATE_CREATE: 'estimate:create',
    ESTIMATE_EDIT: 'estimate:edit',
    ESTIMATE_DELETE: 'estimate:delete',
    ESTIMATE_VIEW: 'estimate:view',
    ADMIN_ACCESS: 'admin:access'
  };

  static getPermissions() {
    return this.PERMISSIONS;
  }

  static checkPermission(user: any, permission: string): boolean {
    return user.permissions.includes(permission);
  }
} 