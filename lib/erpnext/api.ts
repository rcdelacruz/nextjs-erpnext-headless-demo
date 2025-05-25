import axios, { AxiosResponse } from 'axios';
import { ERPNEXT_CONFIG, getApiHeaders, ERPNEXT_API_KEY, ERPNEXT_API_SECRET } from './config';
import type {
  ERPNextLoginResponse,
  ERPNextError,
  ERPNextListResponse,
  ERPNextCreateResponse,
  ERPNextUpdateResponse,
  ERPNextSearchParams,
} from '@/types';

class ERPNextAPIService {
  private apiKey: string | null = null;
  private apiSecret: string | null = null;

  constructor() {
    // Initialize with environment API keys if available
    if (ERPNEXT_API_KEY && ERPNEXT_API_SECRET) {
      this.apiKey = ERPNEXT_API_KEY;
      this.apiSecret = ERPNEXT_API_SECRET;
    }
    // Restore session on initialization
    this.restoreSession();
  }

  private formatError(error: any): ERPNextError {
    if (error?.response?.data) {
      const data = error.response.data;
      return {
        message: data.message || data.exc || 'ERPNext operation failed',
        indicator: data.indicator,
        title: data.title,
        exc_type: data.exc_type,
        exc: data.exc,
      };
    }
    return {
      message: error.message || 'Network Error',
    };
  }

  private clearSession() {
    this.apiKey = null;
    this.apiSecret = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('erpnext_session');
    }
  }

  private restoreSession() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('erpnext_session');
        if (stored) {
          const session = JSON.parse(stored);
          if (session.apiKey && session.apiSecret) {
            this.apiKey = session.apiKey;
            this.apiSecret = session.apiSecret;
          }
        }
      } catch (error) {
        console.error('Failed to restore ERPNext session:', error);
        this.clearSession();
      }
    }
  }

  // Authentication - this will be used via API route
  async login(username: string, password: string): Promise<ERPNextLoginResponse> {
    throw new Error('Use auth store login method instead');
  }

  async logout(): Promise<void> {
    try {
      if (this.apiKey && this.apiSecret) {
        await axios.post(
          `${ERPNEXT_CONFIG.baseURL}${ERPNEXT_CONFIG.endpoints.logout}`,
          {},
          {
            headers: getApiHeaders(this.apiKey, this.apiSecret),
            timeout: ERPNEXT_CONFIG.timeout,
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Get list of documents
  async getList<T>(
    doctype: string,
    params: ERPNextSearchParams = {}
  ): Promise<ERPNextListResponse<T>> {
    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'get_list',
          filters: params.filters || {},
          fields: params.fields || [],
          limit_start: params.limit_start || 0,
          limit_page_length: params.limit_page_length || 20,
          order_by: params.order_by || 'modified desc',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return {
        data: result.data || [],
        message: result.message,
      };
    } catch (error) {
      console.error('Get list operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Get single document
  async getDoc<T>(doctype: string, name: string, fields?: string[]): Promise<T | null> {
    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'get_doc',
          name: name,
          fields: fields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Get document operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Create document
  async create<T>(doctype: string, data: Record<string, any>): Promise<ERPNextCreateResponse> {
    try {
      console.log(`Creating ${doctype} with data:`, data);
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'create',
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      console.log(`Created document: ${result.data.name}`);
      return result;
    } catch (error) {
      console.error('Create operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Update document
  async update(doctype: string, name: string, data: Record<string, any>): Promise<ERPNextUpdateResponse> {
    try {
      console.log(`Updating ${doctype} ${name} with data:`, data);
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'update',
          name: name,
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      console.log(`Updated document: ${result.data.name}`);
      return result;
    } catch (error) {
      console.error('Update operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Delete document
  async delete(doctype: string, name: string): Promise<boolean> {
    try {
      console.log(`Deleting ${doctype} ${name}`);
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'delete',
          name: name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      console.log(`Deleted document: ${name}`);
      return true;
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Call ERPNext method
  async callMethod(method: string, args: Record<string, any> = {}): Promise<any> {
    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'call_method',
          method_name: method,
          args: args,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Method call failed:', error);
      throw this.formatError(error);
    }
  }

  // Search documents
  async search(doctype: string, query: string, filters: Record<string, any> = {}): Promise<any[]> {
    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'search',
          doctype: doctype,
          query: query,
          filters: filters,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Search operation failed:', error);
      throw this.formatError(error);
    }
  }

  // Get document count
  async getCount(doctype: string, filters: Record<string, any> = {}): Promise<number> {
    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctype: doctype,
          method: 'get_count',
          filters: filters,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw this.formatError(errorData);
      }

      const result = await response.json();
      return result.data || 0;
    } catch (error) {
      console.error('Count operation failed:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const erpnextAPI = new ERPNextAPIService();
