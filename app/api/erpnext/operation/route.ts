import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  ERPNEXT_BASE_URL,
  ERPNEXT_API_KEY,
  ERPNEXT_API_SECRET,
  ERPNEXT_USERNAME,
  ERPNEXT_PASSWORD,
  getApiHeaders,
} from '@/lib/erpnext/config';

export async function POST(request: NextRequest) {
  try {
    const {
      doctype,
      method,
      name,
      data,
      filters,
      fields,
      limit_start,
      limit_page_length,
      order_by,
      method_name,
      args,
      query,
    } = await request.json();

    console.log('=== ERPNext API DEBUG ===');
    console.log('URL:', ERPNEXT_BASE_URL);
    console.log('Request:', { doctype, method, name, filters, fields });
    console.log('Using API Key:', !!ERPNEXT_API_KEY);

    let endpoint = '';
    let requestData: any = {};
    let httpMethod = 'GET';

    // Determine the appropriate endpoint and method
    switch (method) {
      case 'get_list':
        endpoint = `/api/resource/${doctype}`;
        httpMethod = 'GET';
        // Build query parameters for GET request
        const params = new URLSearchParams();
        if (filters && Object.keys(filters).length > 0) {
          params.append('filters', JSON.stringify(filters));
        }
        if (fields && fields.length > 0) {
          params.append('fields', JSON.stringify(fields));
        }
        if (limit_start !== undefined) {
          params.append('limit_start', limit_start.toString());
        }
        if (limit_page_length !== undefined) {
          params.append('limit_page_length', limit_page_length.toString());
        }
        if (order_by) {
          params.append('order_by', order_by);
        }
        if (params.toString()) {
          endpoint += `?${params.toString()}`;
        }
        break;

      case 'get_doc':
        endpoint = `/api/resource/${doctype}/${name}`;
        httpMethod = 'GET';
        if (fields && fields.length > 0) {
          endpoint += `?fields=${JSON.stringify(fields)}`;
        }
        break;

      case 'create':
        endpoint = `/api/resource/${doctype}`;
        httpMethod = 'POST';
        requestData = data;
        break;

      case 'update':
        endpoint = `/api/resource/${doctype}/${name}`;
        httpMethod = 'PUT';
        requestData = data;
        break;

      case 'delete':
        endpoint = `/api/resource/${doctype}/${name}`;
        httpMethod = 'DELETE';
        break;

      case 'get_count':
        endpoint = `/api/method/frappe.client.get_count`;
        httpMethod = 'POST';
        requestData = {
          doctype: doctype,
          filters: filters || {},
        };
        break;

      case 'call_method':
        endpoint = `/api/method/${method_name}`;
        httpMethod = 'POST';
        requestData = args || {};
        break;

      case 'search':
        endpoint = `/api/method/frappe.desk.search.search_link`;
        httpMethod = 'POST';
        requestData = {
          doctype: doctype,
          txt: query,
          filters: filters || {},
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported method: ${method}` },
          { status: 400 }
        );
    }

    console.log('Full URL:', `${ERPNEXT_BASE_URL}${endpoint}`);
    console.log('HTTP Method:', httpMethod);
    console.log('Request data:', requestData);

    // Prepare headers
    const headers = getApiHeaders(ERPNEXT_API_KEY, ERPNEXT_API_SECRET);

    // If no API key, try username/password authentication
    if (!ERPNEXT_API_KEY && ERPNEXT_USERNAME && ERPNEXT_PASSWORD) {
      // For username/password, we need to login first to get session
      // This is a simplified approach - in production, you'd want to manage sessions properly
      const auth = Buffer.from(`${ERPNEXT_USERNAME}:${ERPNEXT_PASSWORD}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    let response;
    if (httpMethod === 'GET') {
      response = await axios.get(`${ERPNEXT_BASE_URL}${endpoint}`, {
        headers,
        timeout: 30000, // Increased to 30 seconds
      });
    } else {
      response = await axios({
        method: httpMethod.toLowerCase(),
        url: `${ERPNEXT_BASE_URL}${endpoint}`,
        data: requestData,
        headers,
        timeout: 30000, // Increased to 30 seconds
      });
    }

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // ERPNext typically returns data in a 'data' field for successful responses
    if (response.data) {
      return NextResponse.json({
        data: response.data.data || response.data,
        message: response.data.message,
      });
    }

    return NextResponse.json({ data: null });
  } catch (error: any) {
    console.error('ERPNext API Error:', error);

    // Handle different types of errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      console.error('ERPNext error response:', errorData);

      return NextResponse.json(
        {
          error: errorData.message || errorData.exc || 'ERPNext operation failed',
          details: errorData,
        },
        { status }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Network error occurred' },
      { status: 500 }
    );
  }
}
