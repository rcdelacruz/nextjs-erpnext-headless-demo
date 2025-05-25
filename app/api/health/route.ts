import { NextResponse } from 'next/server';
import { ERPNEXT_BASE_URL } from '@/lib/erpnext/config';

export async function GET() {
  try {
    // Check if ERPNext is accessible
    const response = await fetch(`${ERPNEXT_BASE_URL}/api/method/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    const isERPNextHealthy = response.ok;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        erpnext: {
          status: isERPNextHealthy ? 'healthy' : 'unhealthy',
          url: ERPNEXT_BASE_URL,
        },
        nextjs: {
          status: 'healthy',
        },
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          erpnext: {
            status: 'unhealthy',
            url: ERPNEXT_BASE_URL,
            error: 'Connection failed',
          },
          nextjs: {
            status: 'healthy',
          },
        },
      },
      { status: 503 }
    );
  }
}
