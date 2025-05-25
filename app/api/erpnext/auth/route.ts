import { NextRequest, NextResponse } from 'next/server';

// ERPNext Authentication API Route
// This route handles direct ERPNext authentication for testing purposes

export async function POST(request: NextRequest) {
  try {
    const { username, password, method = 'login' } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'ERPNext base URL not configured' },
        { status: 500 }
      );
    }

    // If API key is available, use it for authentication
    if (apiKey && apiSecret) {
      try {
        // Test the API key by making a simple request
        const response = await fetch(`${baseUrl}/api/method/frappe.auth.get_logged_user`, {
          method: 'GET',
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          return NextResponse.json({
            success: true,
            method: 'api_key',
            user: userData.message || username,
            message: 'Authenticated using API key',
          });
        } else {
          throw new Error('API key authentication failed');
        }
      } catch (error) {
        console.error('API key auth failed:', error);
        // Fall back to username/password if API key fails
      }
    }

    // Username/password authentication
    if (username && password) {
      try {
        const loginResponse = await fetch(`${baseUrl}/api/method/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usr: username,
            pwd: password,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          return NextResponse.json({
            success: true,
            method: 'password',
            user: username,
            data: loginData,
            message: 'Authenticated using username/password',
          });
        } else {
          const errorData = await loginResponse.json();
          return NextResponse.json(
            { 
              error: 'Authentication failed',
              details: errorData.message || 'Invalid credentials'
            },
            { status: 401 }
          );
        }
      } catch (error: any) {
        return NextResponse.json(
          { 
            error: 'ERPNext connection failed',
            details: error.message
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Username and password required' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('ERPNext auth error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication request failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // GET method for checking authentication status
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'ERPNext base URL not configured' },
        { status: 500 }
      );
    }

    if (apiKey && apiSecret) {
      try {
        const response = await fetch(`${baseUrl}/api/method/frappe.auth.get_logged_user`, {
          method: 'GET',
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          return NextResponse.json({
            authenticated: true,
            user: userData.message,
            method: 'api_key',
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }

    return NextResponse.json({
      authenticated: false,
      message: 'No valid authentication found',
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Auth check failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
