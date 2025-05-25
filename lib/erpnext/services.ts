import { erpnextAPI } from './api';
import { COMMON_FIELDS, ERPNEXT_FILTERS } from './config';
import type {
  Student,
  Customer,
  Supplier,
  Program,
  Course,
  AcademicYear,
  ERPNextListResponse,
  ERPNextCreateResponse,
  DashboardStats,
} from '@/types';

// Student Service
export class StudentService {
  private static doctype = 'Student';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<Student>> {
    return erpnextAPI.getList<Student>(this.doctype, {
      filters: ERPNEXT_FILTERS.active_students,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.student],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'student_name asc',
    });
  }

  static async getById(name: string): Promise<Student | null> {
    return erpnextAPI.getDoc<Student>(this.doctype, name, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.student,
      'blood_group',
      'nationality',
      'guardian_relation',
      'address_line_2',
      'state',
      'pincode',
      'country',
      'emergency_contact_relation',
      'admission_date',
      'title',
      'middle_name',
      'last_name',
      'gender',
    ]);
  }

  static async create(data: Partial<Student>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<Student>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Student update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }

  static async search(query: string): Promise<Student[]> {
    return erpnextAPI.search(this.doctype, query, ERPNEXT_FILTERS.active_students);
  }

  static async getCount(): Promise<number> {
    return erpnextAPI.getCount(this.doctype, ERPNEXT_FILTERS.active_students);
  }
}

// Customer Service
export class CustomerService {
  private static doctype = 'Customer';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<Customer>> {
    return erpnextAPI.getList<Customer>(this.doctype, {
      filters: ERPNEXT_FILTERS.active_customers,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.customer],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'customer_name asc',
    });
  }

  static async getById(name: string): Promise<Customer | null> {
    return erpnextAPI.getDoc<Customer>(this.doctype, name, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.customer,
      'customer_primary_address',
      'customer_primary_contact',
      'is_internal_customer',
      'represents_company',
      'market_segment',
      'industry',
      'customer_details',
    ]);
  }

  static async create(data: Partial<Customer>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<Customer>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Customer update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }

  static async getCount(): Promise<number> {
    return erpnextAPI.getCount(this.doctype, ERPNEXT_FILTERS.active_customers);
  }
}

// Supplier Service
export class SupplierService {
  private static doctype = 'Supplier';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<Supplier>> {
    return erpnextAPI.getList<Supplier>(this.doctype, {
      filters: ERPNEXT_FILTERS.active_suppliers,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.supplier],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'supplier_name asc',
    });
  }

  static async getById(name: string): Promise<Supplier | null> {
    return erpnextAPI.getDoc<Supplier>(this.doctype, name, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.supplier,
      'supplier_primary_address',
      'supplier_primary_contact',
      'is_internal_supplier',
      'represents_company',
      'supplier_details',
    ]);
  }

  static async create(data: Partial<Supplier>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<Supplier>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Supplier update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }

  static async getCount(): Promise<number> {
    return erpnextAPI.getCount(this.doctype, ERPNEXT_FILTERS.active_suppliers);
  }
}

// Program Service (Course equivalent in ERPNext Education)
export class ProgramService {
  private static doctype = 'Program';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<Program>> {
    return erpnextAPI.getList<Program>(this.doctype, {
      filters: ERPNEXT_FILTERS.published_programs,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.program],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'program_name asc',
    });
  }

  static async getById(name: string): Promise<Program | null> {
    return erpnextAPI.getDoc<Program>(this.doctype, name, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.program,
      'duration_type',
      'application_fee',
      'eligibility',
      'introduction',
    ]);
  }

  static async create(data: Partial<Program>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<Program>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Program update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }

  static async getCount(): Promise<number> {
    return erpnextAPI.getCount(this.doctype, ERPNEXT_FILTERS.published_programs);
  }
}

// Course Service
export class CourseService {
  private static doctype = 'Course';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<Course>> {
    return erpnextAPI.getList<Course>(this.doctype, {
      filters: ERPNEXT_FILTERS.published_courses,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.course],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'course_name asc',
    });
  }

  static async getById(name: string): Promise<Course | null> {
    return erpnextAPI.getDoc<Course>(this.doctype, name, [
      ...COMMON_FIELDS.base,
      ...COMMON_FIELDS.course,
      'course_intro',
    ]);
  }

  static async create(data: Partial<Course>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<Course>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Course update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }

  static async getCount(): Promise<number> {
    return erpnextAPI.getCount(this.doctype, ERPNEXT_FILTERS.published_courses);
  }
}

// Academic Year Service
export class AcademicYearService {
  private static doctype = 'Academic Year';

  static async getAll(limit = 20, offset = 0): Promise<ERPNextListResponse<AcademicYear>> {
    return erpnextAPI.getList<AcademicYear>(this.doctype, {
      filters: { disabled: ['!=', 1] },
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.academic_year],
      limit_start: offset,
      limit_page_length: limit,
      order_by: 'year_start_date desc',
    });
  }

  static async getCurrent(): Promise<AcademicYear | null> {
    const result = await erpnextAPI.getList<AcademicYear>(this.doctype, {
      filters: ERPNEXT_FILTERS.current_academic_year,
      fields: [...COMMON_FIELDS.base, ...COMMON_FIELDS.academic_year],
      limit_page_length: 1,
    });
    return result.data.length > 0 ? result.data[0] : null;
  }

  static async getById(name: string): Promise<AcademicYear | null> {
    return erpnextAPI.getDoc<AcademicYear>(this.doctype, name);
  }

  static async create(data: Partial<AcademicYear>): Promise<ERPNextCreateResponse> {
    return erpnextAPI.create(this.doctype, data);
  }

  static async update(name: string, data: Partial<AcademicYear>): Promise<boolean> {
    try {
      await erpnextAPI.update(this.doctype, name, data);
      return true;
    } catch (error) {
      console.error('Academic Year update failed:', error);
      return false;
    }
  }

  static async delete(name: string): Promise<boolean> {
    return erpnextAPI.delete(this.doctype, name);
  }
}

// Dashboard Service
export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    try {
      console.log('Loading basic ERPNext stats (Education module may not be installed)...');

      // Only load basic doctypes that exist in all ERPNext installations
      const customerCount = await CustomerService.getCount();
      await new Promise(resolve => setTimeout(resolve, 200));

      const supplierCount = await SupplierService.getCount();
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log('Basic stats loaded successfully');
      return {
        total_students: 0, // Education module not available
        total_programs: 0, // Education module not available
        total_courses: 0,  // Education module not available
        total_customers: customerCount,
        total_suppliers: supplierCount,
        current_academic_year: 'Education module not installed',
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        total_students: 0,
        total_programs: 0,
        total_courses: 0,
        total_customers: 0,
        total_suppliers: 0,
        current_academic_year: 'Error loading data',
      };
    }
  }
}
