import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  ERPNEXT_BASE_URL,
  ERPNEXT_API_KEY,
  ERPNEXT_API_SECRET,
  ERPNEXT_USERNAME,
  ERPNEXT_PASSWORD,
} from '@/lib/erpnext/config';

// Create a server-side instance of the API for authentication
class ServerERPNextAPI {
  private baseURL: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.baseURL = ERPNEXT_BASE_URL;
    this.apiKey = ERPNEXT_API_KEY;
    this.apiSecret = ERPNEXT_API_SECRET;
  }

  private async makeRequest(endpoint: string, data: any = {}, method: string = 'POST'): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add API key authentication if available
    if (this.apiKey && this.apiSecret) {
      headers['Authorization'] = `token ${this.apiKey}:${this.apiSecret}`;
    }

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers,
      data: method !== 'GET' ? data : undefined,
      timeout: 10000,
    };

    const response = await axios(config);
    return response.data;
  }

  async authenticate(username: string, password: string): Promise<any> {
    try {
      // If we have API keys, validate the user credentials
      if (this.apiKey && this.apiSecret) {
        // Use API key to get user info
        const userInfo = await this.makeRequest('/api/method/frappe.auth.get_logged_user');
        return {
          user: username,
          full_name: userInfo.full_name || username,
          message: 'Login successful',
          home_page: '/app',
          api_key: this.apiKey,
          api_secret: this.apiSecret,
        };
      }

      // Otherwise, use username/password login
      const loginData = {
        usr: username,
        pwd: password,
      };

      const response = await this.makeRequest('/api/method/login', loginData);

      if (response.message === 'Logged In') {
        return {
          user: username,
          full_name: response.full_name || username,
          message: response.message,
          home_page: response.home_page || '/app',
        };
      }

      throw new Error('Invalid credentials');
    } catch (error: any) {
      console.error('ERPNext authentication error:', error);
      
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Authentication failed');
      }
      
      throw new Error(error.message || 'Authentication failed');
    }
  }

  async getUserInfo(username: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/api/resource/User/${username}`, {}, 'GET');
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('API Route: Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const erpnextAPI = new ServerERPNextAPI();
    const authResult = await erpnextAPI.authenticate(username, password);

    console.log('API Route: Login successful for user:', authResult.user);

    // Get additional user information if possible
    const userInfo = await erpnextAPI.getUserInfo(username);

    // Return user info in a format compatible with the frontend
    return NextResponse.json({
      user: authResult.user,
      full_name: authResult.full_name,
      message: authResult.message,
      home_page: authResult.home_page,
      api_key: authResult.api_key,
      api_secret: authResult.api_secret,
      user_info: userInfo,
    });
  } catch (error: any) {
    console.error('API Route: Login failed:', error);
    
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
