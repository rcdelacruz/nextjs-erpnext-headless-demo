# ERPNext User Roles & Permissions Setup Guide

This guide will help you create different users with specific roles and permissions for the EduCore ERP demo.

## 🎯 Overview

Setting up proper user roles demonstrates:
- **Role-based Access Control (RBAC)**
- **Different user workflows**
- **Permission management**
- **Real-world ERP usage scenarios**

## 👥 Recommended User Structure

### 1. Administrative Users

#### **System Administrator**
- **Username**: `admin`
- **Role**: System Manager
- **Access**: Full system access
- **Use Case**: System configuration and maintenance

#### **Academic Administrator**
- **Username**: `academic.admin`
- **Email**: `academic@university.edu`
- **Roles**: Academic User, Education Manager
- **Access**: All academic modules
- **Use Case**: Academic policy and program management

#### **Finance Manager**
- **Username**: `finance.manager`
- **Email**: `finance@university.edu`
- **Roles**: Accounts Manager, Accounts User
- **Access**: Financial modules (Phase 2)
- **Use Case**: Financial operations and reporting

### 2. Operational Users

#### **Registrar**
- **Username**: `registrar`
- **Email**: `registrar@university.edu`
- **Roles**: Education User, Student User
- **Access**: Student enrollment, records management
- **Use Case**: Student registration and academic records

#### **Faculty Member**
- **Username**: `prof.smith`
- **Email**: `john.smith@university.edu`
- **Roles**: Education User, Instructor
- **Access**: Course management, student grades
- **Use Case**: Teaching and course administration

#### **Student**
- **Username**: `student.doe`
- **Email**: `jane.doe@student.university.edu`
- **Roles**: Student
- **Access**: Self-service portal (limited)
- **Use Case**: View grades, course enrollment

### 3. Support Users

#### **Data Entry Clerk**
- **Username**: `data.clerk`
- **Email**: `data@university.edu`
- **Roles**: Data Entry User
- **Access**: Basic data entry only
- **Use Case**: Data input and maintenance

#### **Reports Viewer**
- **Username**: `reports.viewer`
- **Email**: `reports@university.edu`
- **Roles**: Report User
- **Access**: Read-only reports access
- **Use Case**: View reports and analytics

## 🔧 Step-by-Step Setup

### Step 1: Create Custom Roles

1. **Login as Administrator**
2. **Go to**: Setup > Users and Permissions > Role
3. **Create these custom roles**:

```
Role Name: Education Manager
Description: Manages academic programs and policies
Permissions: Full access to Education module

Role Name: Education User  
Description: Basic education module access
Permissions: Read/Write access to Students, Courses

Role Name: Student User
Description: Student enrollment and records
Permissions: Read/Write Students, Read Courses/Programs

Role Name: Instructor
Description: Faculty member access
Permissions: Read/Write Courses, Read Students

Role Name: Student
Description: Student self-service access
Permissions: Read own student record only

Role Name: Data Entry User
Description: Basic data entry access
Permissions: Create/Edit basic records

Role Name: Report User
Description: Reports viewing access
Permissions: Read-only access to reports
```

### Step 2: Configure Role Permissions

For each role, configure permissions for these doctypes:

#### **Education Manager Permissions**
```
Student: All permissions
Program: All permissions  
Course: All permissions
Academic Year: All permissions
Student Group: All permissions
Instructor: All permissions
```

#### **Education User Permissions**
```
Student: Read, Write, Create
Program: Read
Course: Read, Write, Create
Academic Year: Read
```

#### **Student User Permissions**
```
Student: Read, Write, Create
Program: Read
Course: Read
Academic Year: Read
```

#### **Instructor Permissions**
```
Student: Read
Program: Read
Course: Read, Write
Academic Year: Read
Student Group: Read
```

#### **Student Permissions**
```
Student: Read (own records only)
Program: Read
Course: Read
Academic Year: Read
```

### Step 3: Create Users

1. **Go to**: Setup > Users and Permissions > User
2. **Create each user** with the following template:

```
Full Name: [User's Full Name]
Email: [user.email@university.edu]
Username: [username]
Roles: [Assign appropriate roles]
```

### Step 4: Set User Permissions

For each user, configure:
1. **Role Assignment**: Assign the appropriate roles
2. **User Permissions**: Set specific document-level permissions if needed
3. **Default Settings**: Configure default company, cost center, etc.

## 🧪 Testing Different User Access

### Test Scenarios

1. **Login as Academic Administrator**
   - Should see full academic module access
   - Can create/edit programs and courses
   - Can manage all students

2. **Login as Registrar**
   - Should see student management features
   - Can enroll new students
   - Can update student records

3. **Login as Faculty**
   - Should see assigned courses
   - Can view student lists
   - Limited administrative access

4. **Login as Student**
   - Should see only personal information
   - Can view enrolled courses
   - Cannot access other students' data

## 🔐 Security Best Practices

### Password Policy
```
Minimum Length: 8 characters
Require: Uppercase, lowercase, numbers
Expiry: 90 days (for non-admin users)
```

### Session Management
```
Session Timeout: 30 minutes of inactivity
Concurrent Sessions: 1 per user
Force Logout: On password change
```

### API Access
```
Admin Users: Full API access
Operational Users: Limited API access
Students: No direct API access
```

## 📊 Demo Workflows

### Workflow 1: Student Enrollment
1. **Registrar** creates new student record
2. **Academic Admin** assigns to program
3. **Faculty** adds to course sections
4. **Student** can view enrollment status

### Workflow 2: Course Management
1. **Academic Admin** creates new course
2. **Faculty** updates course content
3. **Registrar** enrolls students
4. **Reports Viewer** monitors enrollment stats

### Workflow 3: Academic Year Setup
1. **Academic Admin** creates academic year
2. **Academic Admin** defines programs for year
3. **Registrar** begins student enrollment
4. **Faculty** prepares course materials

## 🎯 Next Steps

After setting up users and roles:

1. **Test each user login** in the Next.js demo
2. **Verify permission restrictions** work correctly
3. **Update the demo UI** to show different views per role
4. **Add role-based navigation** in the frontend
5. **Implement user-specific dashboards**

## 📝 Notes

- **Default Password**: Set a standard password for demo users (e.g., "Demo123!")
- **Email Setup**: Use a consistent email domain for the university
- **Documentation**: Keep a list of all demo users and their credentials
- **Reset Process**: Document how to reset demo data and users

---

This setup provides a realistic demonstration of how ERPNext handles different user roles and permissions in an educational institution setting.
