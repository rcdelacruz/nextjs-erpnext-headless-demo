# Role-Based Access Control Implementation Guide

This guide explains how to implement and test the role-based access control system in the EduCore ERP demo.

## 🎯 Overview

The RBAC system provides:
- **7 different user roles** with specific permissions
- **Frontend permission guards** for UI elements
- **Backend permission validation** through ERPNext
- **Role-based navigation** and dashboard customization
- **Demo user accounts** for testing different workflows

## 📋 Step 1: Set Up ERPNext Users and Roles

### 1.1 Run the Setup Script

```bash
# Navigate to your ERPNext site directory
cd /path/to/your/erpnext/site

# Run the user setup script
bench --site your-site.local execute nextjs-erpnext-headless-demo.scripts.setup-demo-users.setup_demo_users
```

### 1.2 Manual Setup (Alternative)

If the script doesn't work, create users manually:

1. **Login to ERPNext as Administrator**
2. **Go to**: Setup > Users and Permissions > User
3. **Create users** according to the table below:

| Username | Email | Full Name | Roles | Password |
|----------|-------|-----------|-------|----------|
| `academic.admin` | academic.admin@university.edu | Academic Administrator | Education Manager | Demo123! |
| `registrar` | registrar@university.edu | University Registrar | Student User | Demo123! |
| `prof.smith` | prof.smith@university.edu | John Smith | Instructor | Demo123! |
| `student.doe` | jane.doe@student.university.edu | Jane Doe | Student | Demo123! |
| `data.clerk` | data.clerk@university.edu | Data Clerk | Data Entry User | Demo123! |
| `reports.viewer` | reports.viewer@university.edu | Reports Viewer | Report User | Demo123! |

### 1.3 Configure Role Permissions

For each role, set permissions on these doctypes:

**Education Manager:**
- Student: All permissions
- Program: All permissions  
- Course: All permissions
- Academic Year: All permissions

**Student User:**
- Student: Read, Write, Create
- Program: Read only
- Course: Read only
- Academic Year: Read only

**Instructor:**
- Student: Read only
- Course: Read, Write
- Program: Read only
- Academic Year: Read only

**Student:**
- Student: Read only (own records)
- Course: Read only
- Program: Read only
- Academic Year: Read only

## 📋 Step 2: Update Frontend Components

### 2.1 Update the Header Component

Add role-based navigation:

```typescript
// In components/layout/header.tsx
import { useAuthStore } from '@/lib/store/auth-store';
import { getAllowedNavigation, canAccessRoute } from '@/lib/auth/role-permissions';
import { UserRoleBadge } from '@/components/auth/role-guard';

// In the navigation section:
const { user } = useAuthStore();
const allowedRoutes = getAllowedNavigation(user);

// Filter navigation items based on permissions
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', route: 'dashboard' },
  { name: 'Students', href: '/students', route: 'students' },
  { name: 'Courses', href: '/courses', route: 'courses' },
  { name: 'Academic Years', href: '/academic-years', route: 'academic-years' },
  { name: 'Partners', href: '/partners', route: 'partners' },
  { name: 'Debug', href: '/debug', route: 'debug' },
].filter(item => canAccessRoute(user, item.route));
```

### 2.2 Update the Dashboard Component

Add role-based dashboard sections:

```typescript
// In components/dashboard/modern-dashboard.tsx
import { getRoleDashboardConfig } from '@/lib/auth/role-permissions';
import { PermissionGuard, RoleGuard } from '@/components/auth/role-guard';

const dashboardConfig = getRoleDashboardConfig(user);

// Wrap sections with permission guards:
{dashboardConfig.showSystemStatus && (
  <div className="system-status-section">
    {/* System status content */}
  </div>
)}

<PermissionGuard doctype="Student" action="create">
  <button className="btn-primary">Add Student</button>
</PermissionGuard>

<RoleGuard roles={['System Manager', 'Education Manager']}>
  <div className="admin-only-section">
    {/* Admin-only content */}
  </div>
</RoleGuard>
```

### 2.3 Update List Components

Add permission-based action buttons:

```typescript
// In components/students/student-list-real.tsx
import { usePermissions } from '@/components/auth/role-guard';

const { canCreate, canWrite, canDelete } = usePermissions('Student');

// Conditionally show buttons:
{canCreate && (
  <button onClick={onAddStudent} className="btn-primary">
    Add Student
  </button>
)}

{canWrite && (
  <button onClick={onEditStudent} className="btn-outline">
    Edit
  </button>
)}

{canDelete && (
  <button onClick={onDeleteStudent} className="btn-danger">
    Delete
  </button>
)}
```

## 📋 Step 3: Test Different User Roles

### 3.1 Testing Workflow

1. **Login as each demo user**
2. **Verify navigation access**
3. **Test CRUD operations**
4. **Check dashboard customization**

### 3.2 Test Cases

#### **System Administrator (admin)**
- ✅ Should see all navigation items
- ✅ Should have all CRUD permissions
- ✅ Should see debug information
- ✅ Should see system status

#### **Academic Administrator (academic.admin)**
- ✅ Should see academic modules
- ✅ Should NOT see debug page
- ✅ Should manage students, courses, programs
- ✅ Should see system status

#### **Registrar (registrar)**
- ✅ Should focus on student management
- ✅ Should create/edit students
- ✅ Should NOT delete students
- ✅ Should view courses (read-only)

#### **Faculty (prof.smith)**
- ✅ Should see students and courses
- ✅ Should edit course information
- ✅ Should NOT create new students
- ✅ Should view student lists

#### **Student (student.doe)**
- ✅ Should see limited dashboard
- ✅ Should view own information only
- ✅ Should NOT access admin features
- ✅ Should view available courses

#### **Data Entry Clerk (data.clerk)**
- ✅ Should create/edit basic records
- ✅ Should NOT delete records
- ✅ Should NOT access reports
- ✅ Should have limited navigation

#### **Reports Viewer (reports.viewer)**
- ✅ Should have read-only access
- ✅ Should see dashboard metrics
- ✅ Should NOT create/edit records
- ✅ Should access reports (when implemented)

## 📋 Step 4: Add Role Indicators

### 4.1 Add User Role Badge to Header

```typescript
// In the header user section:
<div className="user-info">
  <p className="font-semibold">{user?.full_name}</p>
  <UserRoleBadge user={user} />
</div>
```

### 4.2 Add Demo User Switcher (Development Only)

```typescript
// In the main layout (development only):
{process.env.NODE_ENV === 'development' && (
  <DemoUserSwitcher />
)}
```

## 📋 Step 5: Update Login Page

### 5.1 Add Demo User Quick Login

Add quick login buttons for demo users:

```typescript
// In the login page:
const demoUsers = [
  { username: 'admin', role: 'System Manager' },
  { username: 'academic.admin', role: 'Education Manager' },
  { username: 'registrar', role: 'Student User' },
  { username: 'prof.smith', role: 'Instructor' },
  { username: 'student.doe', role: 'Student' },
];

// Add demo login section:
<div className="demo-users">
  <h3>Demo Users</h3>
  {demoUsers.map(user => (
    <button 
      key={user.username}
      onClick={() => quickLogin(user.username, 'Demo123!')}
      className="demo-user-btn"
    >
      {user.username} ({user.role})
    </button>
  ))}
</div>
```

## 🧪 Testing Checklist

### ✅ User Authentication
- [ ] All demo users can login successfully
- [ ] User roles are correctly assigned
- [ ] Session management works properly
- [ ] Logout functionality works

### ✅ Navigation Access
- [ ] System Manager sees all navigation items
- [ ] Education Manager sees academic modules only
- [ ] Students see limited navigation
- [ ] Debug page only accessible to System Manager

### ✅ CRUD Permissions
- [ ] Create permissions work correctly
- [ ] Read permissions filter data appropriately
- [ ] Update permissions allow/deny editing
- [ ] Delete permissions control deletion access

### ✅ Dashboard Customization
- [ ] System status shows for appropriate roles
- [ ] Metrics display based on permissions
- [ ] Quick actions respect user roles
- [ ] Role badges display correctly

### ✅ Error Handling
- [ ] Access denied messages show appropriately
- [ ] Fallback components render correctly
- [ ] Permission errors are handled gracefully
- [ ] Invalid users are redirected to login

## 🚀 Next Steps

After implementing RBAC:

1. **Add audit logging** for user actions
2. **Implement session timeout** based on roles
3. **Add password policies** for different user types
4. **Create role-specific reports** and dashboards
5. **Add bulk operations** with permission checks
6. **Implement approval workflows** for sensitive operations

## 📝 Notes

- **Demo passwords** are intentionally simple for testing
- **Production deployment** should use strong passwords
- **API permissions** are enforced by ERPNext backend
- **Frontend guards** are for UX only, not security
- **Always validate permissions** on the backend

---

This implementation provides a comprehensive role-based access control system that demonstrates real-world ERP user management scenarios.
