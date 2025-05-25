'use client';

import { useRouter } from 'next/navigation';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getRoleDashboardConfig, canAccessRoute, hasPermission } from '@/lib/auth/role-permissions';
import { PermissionGuard, RoleGuard } from '@/components/auth/role-guard';

interface DashboardStats {
  students: number;
  customers: number;
  suppliers: number;
  courses: number;
  currentAcademicYear: any;
}

interface ModernDashboardProps {
  stats: DashboardStats;
  user: any;
}

export function ModernDashboard({ stats, user }: ModernDashboardProps) {
  const router = useRouter();
  const dashboardConfig = getRoleDashboardConfig(user);

  const statsCards = [
    {
      title: 'Students',
      value: stats.students,
      subtitle: 'Active enrollment',
      icon: AcademicCapIcon,
      color: 'blue',
      trend: '+12%',
      href: '/students'
    },
    {
      title: 'Courses',
      value: stats.courses,
      subtitle: 'Available courses',
      icon: BookOpenIcon,
      color: 'purple',
      trend: '+3%',
      href: '/courses'
    },
    {
      title: 'Partners',
      value: stats.customers,
      subtitle: 'Active customers',
      icon: UsersIcon,
      color: 'emerald',
      trend: '+8%',
      href: '/partners'
    },
    {
      title: 'Suppliers',
      value: stats.suppliers,
      subtitle: 'Business partners',
      icon: BuildingOfficeIcon,
      color: 'amber',
      trend: '+5%',
      href: '/partners'
    }
  ];

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Register a new student',
      icon: UserGroupIcon,
      href: '/students',
      color: 'blue'
    },
    {
      title: 'Create Course',
      description: 'Set up a new course',
      icon: BookOpenIcon,
      href: '/courses',
      color: 'purple'
    },
    {
      title: 'Manage Partners',
      description: 'View and edit partners',
      icon: UsersIcon,
      href: '/partners',
      color: 'emerald'
    },
    {
      title: 'System Settings',
      description: 'Configure system',
      icon: CogIcon,
      href: '/settings',
      color: 'slate'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.full_name || user?.user || 'Admin'}
          </h1>
          <p className="text-slate-600 mt-2">
            Here's what's happening with your EduCore ERP system today.
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
          <button className="btn-outline flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifications
          </button>
          <button className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {dashboardConfig.showAllMetrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards
            .filter(card => {
              // Filter stats based on route access
              const route = card.href.replace('/', '');
              return canAccessRoute(user, route);
            })
            .map((card, index) => (
              <div
                key={index}
                className="stats-card group cursor-pointer"
                onClick={() => router.push(card.href)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {card.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-emerald-600 font-medium flex items-center">
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        {card.trend}
                      </span>
                      <span className="text-sm text-slate-500 ml-2">{card.subtitle}</span>
                    </div>
                  </div>
                  <div className={`icon-${card.color} group-hover:scale-110 transition-transform duration-200`}>
                    <card.icon className="w-8 h-8" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Academic Year Banner */}
      {stats.currentAcademicYear && (
        <div className="card-elevated p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Current Academic Year
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {stats.currentAcademicYear.name}
              </p>
              <p className="text-slate-600 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                {new Date(stats.currentAcademicYear.start_date).toLocaleDateString()} - {new Date(stats.currentAcademicYear.end_date).toLocaleDateString()}
              </p>
            </div>
            <CalendarIcon className="w-16 h-16 text-blue-300" />
          </div>
        </div>
      )}

      {/* Quick Actions and System Info Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        {dashboardConfig.showQuickActions && (
          <div className="card-elevated">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
              <p className="text-slate-600 mt-1">Frequently used operations</p>
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {quickActions
                  .filter(action => {
                    // Filter actions based on route access
                    const route = action.href.replace('/', '');
                    return canAccessRoute(user, route);
                  })
                  .map((action, index) => (
                    <button
                      key={index}
                      onClick={() => router.push(action.href)}
                      className="action-card group text-left"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`icon-${action.color} group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        {dashboardConfig.showSystemStatus && (
          <div className="card-elevated">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">System Status</h3>
              <p className="text-slate-600 mt-1">Current system information</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <span className="text-slate-700 font-semibold">Database</span>
                  <span className="badge-info">ERPNext</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <span className="text-slate-700 font-semibold">User</span>
                  <span className="badge-neutral">{user?.user || 'Administrator'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                  <span className="text-slate-700 font-semibold">Session Status</span>
                  <span className="badge-success flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    Active
                  </span>
                </div>
                {dashboardConfig.showDebugInfo && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <span className="text-slate-700 font-semibold">ERPNext Version</span>
                    <span className="badge-info">15.45.4</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
