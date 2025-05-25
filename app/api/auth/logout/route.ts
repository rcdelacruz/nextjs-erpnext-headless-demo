import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For ERPNext, logout is typically handled client-side
    // since we're using API keys rather than session-based authentication
    
    // Clear any server-side session data if needed
    // In this case, we're using API keys, so there's no server session to clear
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support GET method for logout as well
  return POST(request);
}
