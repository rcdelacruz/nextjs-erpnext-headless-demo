'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { hasPermission, canAccessRoute, hasRole, type User } from '@/lib/auth/role-permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface PermissionGuardProps extends RoleGuardProps {
  doctype: string;
  action: 'read' | 'write' | 'create' | 'delete';
}

interface RouteGuardProps extends RoleGuardProps {
  route: string;
}

interface RoleBasedProps extends RoleGuardProps {
  roles: string[];
  requireAll?: boolean; // If true, user must have ALL roles. If false, user needs ANY role.
}

/**
 * Guard component that shows content only if user has permission for specific action on doctype
 */
export function PermissionGuard({
  children,
  fallback = null,
  doctype,
  action
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!hasPermission(user, doctype, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that shows content only if user can access specific route
 */
export function RouteGuard({
  children,
  fallback = null,
  route
}: RouteGuardProps) {
  const { user } = useAuthStore();

  if (!canAccessRoute(user, route)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that shows content only if user has specific role(s)
 */
export function RoleGuard({
  children,
  fallback = null,
  roles,
  requireAll = false
}: RoleBasedProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasRequiredRoles = requireAll
    ? roles.every(role => hasRole(user, role))
    : roles.some(role => hasRole(user, role));

  if (!hasRequiredRoles) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component that shows different content based on user roles
 */
interface RoleBasedContentProps {
  roles: {
    [roleName: string]: React.ReactNode;
  };
  fallback?: React.ReactNode;
}

export function RoleBasedContent({ roles, fallback = null }: RoleBasedContentProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check roles in priority order
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

  for (const role of rolePriority) {
    if (hasRole(user, role) && roles[role]) {
      return <>{roles[role]}</>;
    }
  }

  return <>{fallback}</>;
}

/**
 * Hook to get user permissions for a doctype
 */
export function usePermissions(doctype: string) {
  const { user } = useAuthStore();

  return {
    canRead: hasPermission(user, doctype, 'read'),
    canWrite: hasPermission(user, doctype, 'write'),
    canCreate: hasPermission(user, doctype, 'create'),
    canDelete: hasPermission(user, doctype, 'delete'),
  };
}

/**
 * Hook to check if user has specific role
 */
export function useRole(roleName: string) {
  const { user } = useAuthStore();
  return hasRole(user, roleName);
}

/**
 * Hook to get user's roles
 */
export function useUserRoles() {
  const { user } = useAuthStore();
  return user?.roles?.map(role => role.role_name) || [];
}

/**
 * Component to display user role badge
 */
export function UserRoleBadge({ user }: { user: User | null }) {
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  const primaryRole = user.roles[0].role_name;

  const roleColors: Record<string, string> = {
    'System Manager': 'bg-red-100 text-red-800',
    'Education Manager': 'bg-blue-100 text-blue-800',
    'Accounts Manager': 'bg-green-100 text-green-800',
    'Education User': 'bg-purple-100 text-purple-800',
    'Student User': 'bg-indigo-100 text-indigo-800',
    'Instructor': 'bg-yellow-100 text-yellow-800',
    'Student': 'bg-gray-100 text-gray-800',
    'Data Entry User': 'bg-orange-100 text-orange-800',
    'Report User': 'bg-teal-100 text-teal-800',
  };

  const colorClass = roleColors[primaryRole] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {primaryRole}
    </span>
  );
}

/**
 * Component to show demo user switcher (for development/demo purposes)
 */
export function DemoUserSwitcher() {
  const { user, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const demoUsers = [
    { username: 'admin', role: 'System Manager', description: 'Full access' },
    { username: 'academic.admin', role: 'Education Manager', description: 'Academic admin' },
    { username: 'registrar', role: 'Student User', description: 'Student records' },
    { username: 'prof.smith', role: 'Instructor', description: 'Faculty member' },
    { username: 'student.doe', role: 'Student', description: 'Student access' },
    { username: 'data.clerk', role: 'Data Entry User', description: 'Data entry' },
    { username: 'reports.viewer', role: 'Report User', description: 'Reports only' },
  ];

  const handleUserSwitch = async (username: string) => {
    await logout();
    // In a real app, you'd redirect to login with pre-filled username
    window.location.href = `/login?demo_user=${username}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed State - Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Demo User Switcher"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </button>
      )}

      {/* Expanded State - Full Panel */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm animate-in slide-in-from-bottom-2 duration-200">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Demo User Switcher</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current User Info */}
          <div className="mb-3 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Current:</span> {user?.user}
            </p>
            <p className="text-xs text-blue-600">
              {user?.roles?.[0]?.role_name || 'No role assigned'}
            </p>
          </div>

          {/* User List */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {demoUsers.map((demoUser) => (
              <button
                key={demoUser.username}
                onClick={() => handleUserSwitch(demoUser.username)}
                className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${user?.user === demoUser.username
                    ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                    : 'hover:bg-gray-100 text-gray-700'
                  }`}
                disabled={user?.user === demoUser.username}
              >
                <div className="font-medium">{demoUser.username}</div>
                <div className="text-gray-500 text-xs">{demoUser.role}</div>
                <div className="text-gray-400 text-xs">{demoUser.description}</div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Development Mode Only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Higher-order component to protect routes based on permissions
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  doctype: string,
  action: 'read' | 'write' | 'create' | 'delete',
  fallback?: React.ComponentType
) {
  return function PermissionProtectedComponent(props: P) {
    const { user } = useAuthStore();

    if (!hasPermission(user, doctype, action)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to {action} {doctype} records.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component to protect routes based on roles
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[],
  requireAll = false,
  fallback?: React.ComponentType
) {
  return function RoleProtectedComponent(props: P) {
    const { user } = useAuthStore();

    if (!user) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Authentication Required</h3>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    const hasRequiredRoles = requireAll
      ? requiredRoles.every(role => hasRole(user, role))
      : requiredRoles.some(role => hasRole(user, role));

    if (!hasRequiredRoles) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
            <p className="text-gray-600">
              You need {requireAll ? 'all of' : 'one of'} these roles: {requiredRoles.join(', ')}
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
