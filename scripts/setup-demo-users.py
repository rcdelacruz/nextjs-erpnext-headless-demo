#!/usr/bin/env python3
"""
ERPNext Demo Users Setup Script

This script creates demo users with different roles for the EduCore ERP demo.
Run this script in your ERPNext environment to set up the demo users.

Usage:
    bench --site your-site.local execute scripts.setup-demo-users.setup_demo_users
"""

import frappe
from frappe import _

def setup_demo_users():
    """Create demo users with different roles and permissions"""
    
    print("Setting up demo users for EduCore ERP...")
    
    # Define demo users
    demo_users = [
        {
            "email": "academic.admin@university.edu",
            "first_name": "Academic",
            "last_name": "Administrator",
            "username": "academic.admin",
            "roles": ["Education Manager", "System Manager"],
            "user_type": "System User"
        },
        {
            "email": "finance.manager@university.edu", 
            "first_name": "Finance",
            "last_name": "Manager",
            "username": "finance.manager",
            "roles": ["Accounts Manager", "Accounts User"],
            "user_type": "System User"
        },
        {
            "email": "registrar@university.edu",
            "first_name": "University",
            "last_name": "Registrar", 
            "username": "registrar",
            "roles": ["Education User", "Student User"],
            "user_type": "System User"
        },
        {
            "email": "prof.smith@university.edu",
            "first_name": "John",
            "last_name": "Smith",
            "username": "prof.smith", 
            "roles": ["Education User", "Instructor"],
            "user_type": "System User"
        },
        {
            "email": "jane.doe@student.university.edu",
            "first_name": "Jane",
            "last_name": "Doe",
            "username": "student.doe",
            "roles": ["Student"],
            "user_type": "Website User"
        },
        {
            "email": "data.clerk@university.edu",
            "first_name": "Data",
            "last_name": "Clerk",
            "username": "data.clerk",
            "roles": ["Data Entry User"],
            "user_type": "System User"
        },
        {
            "email": "reports.viewer@university.edu",
            "first_name": "Reports",
            "last_name": "Viewer", 
            "username": "reports.viewer",
            "roles": ["Report User"],
            "user_type": "System User"
        }
    ]
    
    # Create custom roles first
    create_custom_roles()
    
    # Create users
    for user_data in demo_users:
        create_demo_user(user_data)
    
    print("Demo users setup completed!")
    print("\nDemo Users Created:")
    print("==================")
    for user in demo_users:
        print(f"Username: {user['username']}")
        print(f"Email: {user['email']}")
        print(f"Roles: {', '.join(user['roles'])}")
        print(f"Password: Demo123!")
        print("-" * 40)

def create_custom_roles():
    """Create custom roles for the education system"""
    
    custom_roles = [
        {
            "role_name": "Education Manager",
            "description": "Manages academic programs and policies"
        },
        {
            "role_name": "Education User", 
            "description": "Basic education module access"
        },
        {
            "role_name": "Student User",
            "description": "Student enrollment and records management"
        },
        {
            "role_name": "Instructor",
            "description": "Faculty member access to courses and students"
        },
        {
            "role_name": "Student", 
            "description": "Student self-service access"
        },
        {
            "role_name": "Data Entry User",
            "description": "Basic data entry access"
        },
        {
            "role_name": "Report User",
            "description": "Reports viewing access"
        }
    ]
    
    for role_data in custom_roles:
        if not frappe.db.exists("Role", role_data["role_name"]):
            role = frappe.get_doc({
                "doctype": "Role",
                "role_name": role_data["role_name"],
                "description": role_data["description"]
            })
            role.insert(ignore_permissions=True)
            print(f"Created role: {role_data['role_name']}")

def create_demo_user(user_data):
    """Create a single demo user"""
    
    email = user_data["email"]
    
    # Check if user already exists
    if frappe.db.exists("User", email):
        print(f"User {email} already exists, skipping...")
        return
    
    # Create user
    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": user_data["first_name"],
        "last_name": user_data["last_name"],
        "username": user_data["username"],
        "user_type": user_data["user_type"],
        "send_welcome_email": 0,
        "new_password": "Demo123!"
    })
    
    # Add roles
    for role in user_data["roles"]:
        user.append("roles", {
            "role": role
        })
    
    user.insert(ignore_permissions=True)
    print(f"Created user: {email}")

def setup_role_permissions():
    """Set up role permissions for education doctypes"""
    
    # Education Manager permissions
    education_manager_perms = [
        {"doctype": "Student", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1},
        {"doctype": "Program", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1},
        {"doctype": "Course", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1},
        {"doctype": "Academic Year", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1},
        {"doctype": "Student Group", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1},
        {"doctype": "Instructor", "permlevel": 0, "read": 1, "write": 1, "create": 1, "delete": 1}
    ]
    
    # Education User permissions  
    education_user_perms = [
        {"doctype": "Student", "permlevel": 0, "read": 1, "write": 1, "create": 1},
        {"doctype": "Program", "permlevel": 0, "read": 1},
        {"doctype": "Course", "permlevel": 0, "read": 1, "write": 1, "create": 1},
        {"doctype": "Academic Year", "permlevel": 0, "read": 1}
    ]
    
    # Student User permissions
    student_user_perms = [
        {"doctype": "Student", "permlevel": 0, "read": 1, "write": 1, "create": 1},
        {"doctype": "Program", "permlevel": 0, "read": 1},
        {"doctype": "Course", "permlevel": 0, "read": 1},
        {"doctype": "Academic Year", "permlevel": 0, "read": 1}
    ]
    
    # Instructor permissions
    instructor_perms = [
        {"doctype": "Student", "permlevel": 0, "read": 1},
        {"doctype": "Program", "permlevel": 0, "read": 1},
        {"doctype": "Course", "permlevel": 0, "read": 1, "write": 1},
        {"doctype": "Academic Year", "permlevel": 0, "read": 1},
        {"doctype": "Student Group", "permlevel": 0, "read": 1}
    ]
    
    # Student permissions (limited)
    student_perms = [
        {"doctype": "Student", "permlevel": 0, "read": 1, "if_owner": 1},
        {"doctype": "Program", "permlevel": 0, "read": 1},
        {"doctype": "Course", "permlevel": 0, "read": 1},
        {"doctype": "Academic Year", "permlevel": 0, "read": 1}
    ]
    
    # Apply permissions
    role_permissions = {
        "Education Manager": education_manager_perms,
        "Education User": education_user_perms,
        "Student User": student_user_perms,
        "Instructor": instructor_perms,
        "Student": student_perms
    }
    
    for role, permissions in role_permissions.items():
        for perm in permissions:
            create_custom_permission(role, perm)

def create_custom_permission(role, perm_data):
    """Create a custom permission for a role"""
    
    # Check if permission already exists
    existing = frappe.db.exists("Custom DocPerm", {
        "parent": perm_data["doctype"],
        "role": role,
        "permlevel": perm_data["permlevel"]
    })
    
    if existing:
        return
    
    # Create permission
    permission = frappe.get_doc({
        "doctype": "Custom DocPerm",
        "parent": perm_data["doctype"],
        "parenttype": "DocType",
        "parentfield": "permissions",
        "role": role,
        "permlevel": perm_data["permlevel"],
        "read": perm_data.get("read", 0),
        "write": perm_data.get("write", 0),
        "create": perm_data.get("create", 0),
        "delete": perm_data.get("delete", 0),
        "if_owner": perm_data.get("if_owner", 0)
    })
    
    permission.insert(ignore_permissions=True)

if __name__ == "__main__":
    setup_demo_users()
    setup_role_permissions()
