// ERPNext Configuration
export const ERPNEXT_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL || 'https://demo.erpnext.com',
  siteName: process.env.NEXT_PUBLIC_ERPNEXT_SITE_NAME || '',
  timeout: parseInt(process.env.ERPNEXT_TIMEOUT || '10000'),
  endpoints: {
    // Authentication endpoints
    login: '/api/method/login',
    logout: '/api/method/logout',
    
    // Resource endpoints
    resource: '/api/resource',
    method: '/api/method',
    
    // File upload
    upload: '/api/method/upload_file',
    
    // Search
    search: '/api/method/frappe.desk.search.search_link',
  },
};

// API Headers for ERPNext
export const getApiHeaders = (apiKey?: string, apiSecret?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add API key authentication if available
  if (apiKey && apiSecret) {
    headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
  }

  return headers;
};

// Environment variables
export const ERPNEXT_BASE_URL = process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL || 'https://demo.erpnext.com';
export const ERPNEXT_SITE_NAME = process.env.NEXT_PUBLIC_ERPNEXT_SITE_NAME || '';
export const ERPNEXT_API_KEY = process.env.ERPNEXT_API_KEY || '';
export const ERPNEXT_API_SECRET = process.env.ERPNEXT_API_SECRET || '';
export const ERPNEXT_USERNAME = process.env.ERPNEXT_USERNAME || '';
export const ERPNEXT_PASSWORD = process.env.ERPNEXT_PASSWORD || '';

// Common field mappings for ERPNext doctypes
export const COMMON_FIELDS = {
  base: ['name', 'creation', 'modified', 'modified_by', 'owner', 'docstatus'],
  student: [
    'student_name', 'student_email_id', 'student_mobile_number', 'student_id',
    'joining_date', 'program', 'student_batch_name', 'academic_year',
    'student_category', 'date_of_birth', 'guardian_name', 'guardian_mobile_number',
    'guardian_email', 'address_line_1', 'city', 'emergency_contact_name',
    'emergency_contact_mobile'
  ],
  customer: [
    'customer_name', 'customer_type', 'customer_group', 'territory',
    'email_id', 'mobile_no', 'phone_no', 'website', 'disabled'
  ],
  supplier: [
    'supplier_name', 'supplier_type', 'supplier_group', 'country',
    'email_id', 'mobile_no', 'phone_no', 'website', 'disabled'
  ],
  program: [
    'program_name', 'program_code', 'department', 'program_abbreviation',
    'description', 'is_published', 'duration', 'max_students', 'fees'
  ],
  course: [
    'course_name', 'course_code', 'department', 'course_abbreviation',
    'description', 'is_published', 'credit_hours', 'max_students'
  ],
  academic_year: [
    'academic_year_name', 'year_start_date', 'year_end_date', 'is_default', 'disabled'
  ]
};

// ERPNext specific filters/domains
export const ERPNEXT_FILTERS = {
  active_students: { docstatus: ['!=', 2], disabled: ['!=', 1] },
  active_customers: { disabled: ['!=', 1] },
  active_suppliers: { disabled: ['!=', 1] },
  published_programs: { is_published: 1, disabled: ['!=', 1] },
  published_courses: { is_published: 1, disabled: ['!=', 1] },
  current_academic_year: { is_default: 1, disabled: ['!=', 1] }
};
