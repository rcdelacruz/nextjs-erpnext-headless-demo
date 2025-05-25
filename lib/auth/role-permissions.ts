/**
 * Role-based Access Control (RBAC) for EduCore ERP
 *
 * This module handles user roles and permissions in the frontend
 */

export interface UserRole {
  role_name: string;
  description?: string;
}

// Use the actual ERPNext user type from the auth store
export interface User {
  user: string;
  full_name: string;
  message: string;
  home_page: string;
  api_key?: string;
  api_secret?: string;
  // Add roles property for RBAC (will be populated from ERPNext API)
  roles?: UserRole[];
  user_type?: 'System User' | 'Website User';
}

export interface Permission {
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
}

export interface ModulePermissions {
  [doctype: string]: Permission;
}

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<string, ModulePermissions> = {
  'System Manager': {
    'Student': { read: true, write: true, create: true, delete: true },
    'Program': { read: true, write: true, create: true, delete: true },
    'Course': { read: true, write: true, create: true, delete: true },
    'Academic Year': { read: true, write: true, create: true, delete: true },
    'Customer': { read: true, write: true, create: true, delete: true },
    'Supplier': { read: true, write: true, create: true, delete: true },
  },

  'Education Manager': {
    'Student': { read: true, write: true, create: true, delete: true },
    'Program': { read: true, write: true, create: true, delete: true },
    'Course': { read: true, write: true, create: true, delete: true },
    'Academic Year': { read: true, write: true, create: true, delete: true },
    'Customer': { read: true, write: false, create: false, delete: false },
    'Supplier': { read: true, write: false, create: false, delete: false },
  },

  'Education User': {
    'Student': { read: true, write: true, create: true, delete: false },
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: true, create: true, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: false, write: false, create: false, delete: false },
    'Supplier': { read: false, write: false, create: false, delete: false },
  },

  'Student User': {
    'Student': { read: true, write: true, create: true, delete: false },
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: false, create: false, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: false, write: false, create: false, delete: false },
    'Supplier': { read: false, write: false, create: false, delete: false },
  },

  'Instructor': {
    'Student': { read: true, write: false, create: false, delete: false },
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: true, create: false, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: false, write: false, create: false, delete: false },
    'Supplier': { read: false, write: false, create: false, delete: false },
  },

  'Student': {
    'Student': { read: true, write: false, create: false, delete: false }, // Own records only
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: false, create: false, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: false, write: false, create: false, delete: false },
    'Supplier': { read: false, write: false, create: false, delete: false },
  },

  'Data Entry User': {
    'Student': { read: true, write: true, create: true, delete: false },
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: false, create: false, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: true, write: true, create: true, delete: false },
    'Supplier': { read: true, write: true, create: true, delete: false },
  },

  'Report User': {
    'Student': { read: true, write: false, create: false, delete: false },
    'Program': { read: true, write: false, create: false, delete: false },
    'Course': { read: true, write: false, create: false, delete: false },
    'Academic Year': { read: true, write: false, create: false, delete: false },
    'Customer': { read: true, write: false, create: false, delete: false },
    'Supplier': { read: true, write: false, create: false, delete: false },
  },
};

// Navigation items based on roles
export const ROLE_NAVIGATION: Record<string, string[]> = {
  'System Manager': ['dashboard', 'students', 'courses', 'academic-years', 'partners', 'debug'],
  'Education Manager': ['dashboard', 'students', 'courses', 'academic-years', 'partners'],
  'Education User': ['dashboard', 'students', 'courses', 'academic-years'],
  'Student User': ['dashboard', 'students', 'courses', 'academic-years'],
  'Instructor': ['dashboard', 'students', 'courses'],
  'Student': ['dashboard', 'courses'],
  'Data Entry User': ['dashboard', 'students', 'partners'],
  'Report User': ['dashboard'],
};

/**
 * Check if user has permission for a specific action on a doctype
 */
export function hasPermission(
  user: User | null,
  doctype: string,
  action: keyof Permission
): boolean {
  if (!user) return false;

  // If no roles are loaded yet, assume basic permissions for authenticated users
  if (!user.roles || user.roles.length === 0) {
    // Default permissions for authenticated users without role data
    if (user.user === 'Administrator') {
      return true; // Administrator has all permissions
    }
    // Give basic read permissions to authenticated users
    return action === 'read';
  }

  // System Manager has all permissions
  if (user.roles.some(role => role.role_name === 'System Manager')) {
    return true;
  }

  // Check each role for permission
  for (const role of user.roles) {
    const rolePermissions = ROLE_PERMISSIONS[role.role_name];
    if (rolePermissions && rolePermissions[doctype]) {
      if (rolePermissions[doctype][action]) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get all permissions for a user on a specific doctype
 */
export function getPermissions(user: User | null, doctype: string): Permission {
  const defaultPermissions: Permission = {
    read: false,
    write: false,
    create: false,
    delete: false,
  };

  if (!user || !user.roles) return defaultPermissions;

  // System Manager has all permissions
  if (user.roles.some(role => role.role_name === 'System Manager')) {
    return {
      read: true,
      write: true,
      create: true,
      delete: true,
    };
  }

  const permissions = { ...defaultPermissions };

  // Aggregate permissions from all roles
  for (const role of user.roles) {
    const rolePermissions = ROLE_PERMISSIONS[role.role_name];
    if (rolePermissions && rolePermissions[doctype]) {
      const docPermissions = rolePermissions[doctype];
      permissions.read = permissions.read || docPermissions.read;
      permissions.write = permissions.write || docPermissions.write;
      permissions.create = permissions.create || docPermissions.create;
      permissions.delete = permissions.delete || docPermissions.delete;
    }
  }

  return permissions;
}

/**
 * Check if user can access a specific navigation item
 */
export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;

  // If no roles are loaded yet, allow basic routes for authenticated users
  if (!user.roles || user.roles.length === 0) {
    // Default routes for authenticated users without role data
    if (user.user === 'Administrator') {
      return true; // Administrator can access everything
    }
    // Allow basic routes for authenticated users
    const basicRoutes = ['dashboard', 'students', 'courses', 'academic-years'];
    return basicRoutes.includes(route);
  }

  // System Manager can access everything
  if (user.roles.some(role => role.role_name === 'System Manager')) {
    return true;
  }

  // Check if any role allows access to this route
  for (const role of user.roles) {
    const allowedRoutes = ROLE_NAVIGATION[role.role_name];
    if (allowedRoutes && allowedRoutes.includes(route)) {
      return true;
    }
  }

  return false;
}

/**
 * Get allowed navigation items for a user
 */
export function getAllowedNavigation(user: User | null): string[] {
  if (!user || !user.roles) return [];

  const allowedRoutes = new Set<string>();

  // Aggregate allowed routes from all roles
  for (const role of user.roles) {
    const roleRoutes = ROLE_NAVIGATION[role.role_name];
    if (roleRoutes) {
      roleRoutes.forEach(route => allowedRoutes.add(route));
    }
  }

  return Array.from(allowedRoutes);
}

/**
 * Get user's primary role (highest priority role)
 */
export function getPrimaryRole(user: User | null): string | null {
  if (!user || !user.roles || user.roles.length === 0) return null;

  // Priority order for roles
  const rolePriority = [
    'System Manager',
    'Education Manager',
    'Accounts Manager',
    'Education User',
    'Student User',
    'Instructor',
    'Student',
    'Data Entry User',
    'Report User'
  ];

  for (const priority of rolePriority) {
    if (user.roles.some(role => role.role_name === priority)) {
      return priority;
    }
  }

  return user.roles[0].role_name;
}

/**
 * Check if user is in a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user) return false;

  // If no roles are loaded yet, check for Administrator
  if (!user.roles || user.roles.length === 0) {
    if (user.user === 'Administrator' && roleName === 'System Manager') {
      return true;
    }
    return false;
  }

  return user.roles.some(role => role.role_name === roleName);
}

/**
 * Get role-specific dashboard configuration
 */
export function getRoleDashboardConfig(user: User | null) {
  if (!user) {
    return {
      showSystemStatus: false,
      showAllMetrics: false,
      showQuickActions: false,
      showDebugInfo: false,
    };
  }

  // Default config for users without role data
  if (!user.roles || user.roles.length === 0) {
    if (user.user === 'Administrator') {
      return {
        showSystemStatus: true,
        showAllMetrics: true,
        showQuickActions: true,
        showDebugInfo: true,
      };
    }
    return {
      showSystemStatus: false,
      showAllMetrics: true,
      showQuickActions: true,
      showDebugInfo: false,
    };
  }

  const primaryRole = getPrimaryRole(user);

  const dashboardConfigs = {
    'System Manager': {
      showSystemStatus: true,
      showAllMetrics: true,
      showQuickActions: true,
      showDebugInfo: true,
    },
    'Education Manager': {
      showSystemStatus: true,
      showAllMetrics: true,
      showQuickActions: true,
      showDebugInfo: false,
    },
    'Education User': {
      showSystemStatus: false,
      showAllMetrics: true,
      showQuickActions: true,
      showDebugInfo: false,
    },
    'Student User': {
      showSystemStatus: false,
      showAllMetrics: true,
      showQuickActions: true,
      showDebugInfo: false,
    },
    'Instructor': {
      showSystemStatus: false,
      showAllMetrics: false,
      showQuickActions: false,
      showDebugInfo: false,
    },
    'Student': {
      showSystemStatus: false,
      showAllMetrics: false,
      showQuickActions: false,
      showDebugInfo: false,
    },
    'Data Entry User': {
      showSystemStatus: false,
      showAllMetrics: false,
      showQuickActions: true,
      showDebugInfo: false,
    },
    'Report User': {
      showSystemStatus: false,
      showAllMetrics: true,
      showQuickActions: false,
      showDebugInfo: false,
    },
  };

  return dashboardConfigs[primaryRole as keyof typeof dashboardConfigs] || dashboardConfigs['Student'];
}

/**
 * Demo user credentials for testing different roles
 */
export const DEMO_USERS = [
  {
    username: 'admin',
    email: 'admin@university.edu',
    password: 'admin',
    roles: ['System Manager'],
    description: 'Full system access'
  },
  {
    username: 'academic.admin',
    email: 'academic.admin@university.edu',
    password: 'Demo123!',
    roles: ['Education Manager'],
    description: 'Academic administration'
  },
  {
    username: 'registrar',
    email: 'registrar@university.edu',
    password: 'Demo123!',
    roles: ['Student User'],
    description: 'Student enrollment and records'
  },
  {
    username: 'prof.smith',
    email: 'prof.smith@university.edu',
    password: 'Demo123!',
    roles: ['Instructor'],
    description: 'Faculty member access'
  },
  {
    username: 'student.doe',
    email: 'jane.doe@student.university.edu',
    password: 'Demo123!',
    roles: ['Student'],
    description: 'Student self-service'
  },
  {
    username: 'data.clerk',
    email: 'data.clerk@university.edu',
    password: 'Demo123!',
    roles: ['Data Entry User'],
    description: 'Data entry operations'
  },
  {
    username: 'reports.viewer',
    email: 'reports.viewer@university.edu',
    password: 'Demo123!',
    roles: ['Report User'],
    description: 'Reports and analytics'
  }
];

/**
 * Temporary function to assign demo roles to users for testing
 * In production, roles would come from ERPNext API
 */
export function assignDemoRoles(user: User): User {
  if (!user) return user;

  // Map usernames to demo roles for testing
  const userRoleMap: Record<string, string[]> = {
    'Administrator': ['System Manager'],
    'admin': ['System Manager'],
    'academic.admin': ['Education Manager'],
    'registrar': ['Student User'],
    'prof.smith': ['Instructor'],
    'student.doe': ['Student'],
    'data.clerk': ['Data Entry User'],
    'reports.viewer': ['Report User'],
  };

  const roleNames = userRoleMap[user.user] || ['Education User'];
  const roles: UserRole[] = roleNames.map(roleName => ({
    role_name: roleName,
    description: `Demo role: ${roleName}`
  }));

  return {
    ...user,
    roles,
    user_type: 'System User'
  };
}
