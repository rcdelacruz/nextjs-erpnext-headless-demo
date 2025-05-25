// ERPNext API Types
export interface ERPNextLoginResponse {
  message: string;
  home_page: string;
  full_name: string;
  user: string;
  api_key?: string;
  api_secret?: string;
}

export interface ERPNextError {
  message: string;
  indicator?: string;
  title?: string;
  exc_type?: string;
  exc?: string;
}

export interface ERPNextRecord {
  name: string;
  creation?: string;
  modified?: string;
  modified_by?: string;
  owner?: string;
  docstatus?: number;
  idx?: number;
}

// Student Types - Enhanced for Educational Management
export interface Student extends ERPNextRecord {
  student_name: string;
  student_email_id?: string;
  student_mobile_number?: string;
  student_id?: string;
  joining_date?: string;
  program?: string;
  student_batch_name?: string;
  active?: boolean;
  // Enhanced fields for Phase 1
  academic_year?: string;
  student_category?: string;
  date_of_birth?: string;
  blood_group?: string;
  nationality?: string;
  // Guardian Information
  guardian?: string;
  guardian_name?: string;
  guardian_mobile_number?: string;
  guardian_email?: string;
  guardian_relation?: string;
  // Address Information
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_mobile?: string;
  emergency_contact_relation?: string;
  // Academic Information
  admission_date?: string;
  student_applicant?: string;
  title?: string;
  middle_name?: string;
  last_name?: string;
  gender?: string;
}

export interface StudentFormData {
  student_name: string;
  student_email_id?: string;
  student_mobile_number?: string;
  student_id?: string;
  joining_date?: string;
  program?: string;
  academic_year?: string;
  student_category?: string;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_mobile_number?: string;
  guardian_email?: string;
  address_line_1?: string;
  city?: string;
  emergency_contact_name?: string;
  emergency_contact_mobile?: string;
}

// Customer/Supplier Types (ERPNext Partners equivalent)
export interface Customer extends ERPNextRecord {
  customer_name: string;
  customer_type?: string;
  customer_group?: string;
  territory?: string;
  email_id?: string;
  mobile_no?: string;
  phone_no?: string;
  website?: string;
  customer_primary_address?: string;
  customer_primary_contact?: string;
  is_internal_customer?: boolean;
  represents_company?: string;
  market_segment?: string;
  industry?: string;
  customer_details?: string;
  disabled?: boolean;
}

export interface Supplier extends ERPNextRecord {
  supplier_name: string;
  supplier_type?: string;
  supplier_group?: string;
  country?: string;
  email_id?: string;
  mobile_no?: string;
  phone_no?: string;
  website?: string;
  supplier_primary_address?: string;
  supplier_primary_contact?: string;
  is_internal_supplier?: boolean;
  represents_company?: string;
  supplier_details?: string;
  disabled?: boolean;
}

// Course/Program Types - Enhanced for Educational Management
export interface Program extends ERPNextRecord {
  program_name: string;
  program_code?: string;
  department?: string;
  program_abbreviation?: string;
  description?: string;
  is_published?: boolean;
  // Enhanced fields
  duration?: number;
  duration_type?: string;
  max_students?: number;
  enrolled_students?: number;
  fees?: number;
  application_fee?: number;
  eligibility?: string;
  introduction?: string;
}

export interface Course extends ERPNextRecord {
  course_name: string;
  course_code?: string;
  department?: string;
  course_abbreviation?: string;
  description?: string;
  is_published?: boolean;
  // Enhanced fields
  credit_hours?: number;
  max_students?: number;
  enrolled_students?: number;
  course_intro?: string;
}

// Academic Year Types
export interface AcademicYear extends ERPNextRecord {
  academic_year_name: string;
  year_start_date: string;
  year_end_date: string;
  is_default?: boolean;
  disabled?: boolean;
}

// Academic Term Types
export interface AcademicTerm extends ERPNextRecord {
  academic_year: string;
  term_name: string;
  term_start_date: string;
  term_end_date: string;
}

// Student Group Types (Class/Section equivalent)
export interface StudentGroup extends ERPNextRecord {
  student_group_name: string;
  academic_year: string;
  academic_term?: string;
  program?: string;
  batch?: string;
  max_strength?: number;
  group_roll_number?: string;
  disabled?: boolean;
}

// Fee Structure Types
export interface FeeStructure extends ERPNextRecord {
  academic_year: string;
  program?: string;
  student_category?: string;
  receivable_account: string;
  income_account: string;
  cost_center: string;
  company: string;
  due_date?: string;
  is_recurring?: boolean;
  disabled?: boolean;
}

// Fee Category Types
export interface FeeCategory extends ERPNextRecord {
  category_name: string;
  description?: string;
}

// Fees Types
export interface Fees extends ERPNextRecord {
  student: string;
  academic_year: string;
  academic_term?: string;
  fee_structure?: string;
  program?: string;
  student_name?: string;
  posting_date: string;
  due_date: string;
  total_amount: number;
  outstanding_amount: number;
  grand_total: number;
  status?: string;
  company: string;
}

// Student Attendance Types
export interface StudentAttendance extends ERPNextRecord {
  student: string;
  student_name?: string;
  course_schedule?: string;
  student_group?: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Late';
  leave_application?: string;
  late_entry?: boolean;
  early_exit?: boolean;
}

// API Response Types
export interface ERPNextListResponse<T> {
  data: T[];
  message?: string;
}

export interface ERPNextCreateResponse {
  data: {
    name: string;
    [key: string]: any;
  };
  message?: string;
}

export interface ERPNextUpdateResponse {
  data: {
    name: string;
    [key: string]: any;
  };
  message?: string;
}

// Auth Store Types
export interface AuthState {
  isAuthenticated: boolean;
  user: ERPNextLoginResponse | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Filter Types for ERPNext
export interface ERPNextFilter {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'not like' | 'in' | 'not in' | 'is' | 'is not';
  value: any;
}

export interface ERPNextSearchParams {
  filters?: ERPNextFilter[] | Record<string, any>;
  fields?: string[];
  limit_start?: number;
  limit_page_length?: number;
  order_by?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_students: number;
  total_programs: number;
  total_courses: number;
  total_customers: number;
  total_suppliers: number;
  current_academic_year?: string;
}
