'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { ArrowLeftIcon, BugAntIcon } from '@heroicons/react/24/outline';

export default function DebugPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
  }, [router, checkAuth]);

  const runDebugTest = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test ERPNext connection and get system info
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'call_method',
          method_name: 'frappe.utils.get_site_info',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Get additional debug information
      const debugData = {
        timestamp: new Date().toISOString(),
        erpnext_response: result,
        environment: {
          base_url: process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL,
          site_name: process.env.NEXT_PUBLIC_ERPNEXT_SITE_NAME,
        },
        browser_info: {
          user_agent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
        },
      };

      setDebugInfo(debugData);
    } catch (err: any) {
      console.error('Debug test failed:', err);
      setError(err.message || 'Debug test failed');
    } finally {
      setLoading(false);
    }
  };

  const testDoctypes = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctypes = ['Student', 'Program', 'Course', 'Academic Year', 'Customer', 'Supplier'];
      const results = {};

      for (const doctype of doctypes) {
        try {
          const response = await fetch('/api/erpnext/operation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              doctype: doctype,
              method: 'get_count',
              filters: {},
            }),
          });

          if (response.ok) {
            const result = await response.json();
            results[doctype] = {
              status: 'success',
              count: result.data || 0,
            };
          } else {
            results[doctype] = {
              status: 'error',
              error: `HTTP ${response.status}`,
            };
          }
        } catch (err: any) {
          results[doctype] = {
            status: 'error',
            error: err.message,
          };
        }
      }

      setDebugInfo({
        timestamp: new Date().toISOString(),
        doctype_tests: results,
        test_type: 'doctype_availability',
      });
    } catch (err: any) {
      setError(err.message || 'Doctype test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BugAntIcon className="h-6 w-6 text-red-600 mr-2" />
                ERPNext Debug Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Use this page to debug ERPNext connection and test API functionality.
                </p>

                <div className="flex space-x-4">
                  <LoadingButton
                    onClick={runDebugTest}
                    isLoading={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Test ERPNext Connection
                  </LoadingButton>

                  <LoadingButton
                    onClick={testDoctypes}
                    isLoading={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Test Doctypes
                  </LoadingButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </CardContent>
            </Card>
          )}

          {debugInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded">
                  <pre className="text-sm overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ERPNext Base URL:</strong>
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL || 'Not configured'}
                  </code>
                </div>
                <div>
                  <strong>Site Name:</strong>
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {process.env.NEXT_PUBLIC_ERPNEXT_SITE_NAME || 'Not configured'}
                  </code>
                </div>
                <div>
                  <strong>API Key Configured:</strong>
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {process.env.ERPNEXT_API_KEY ? 'Yes' : 'No'}
                  </code>
                </div>
                <div>
                  <strong>Current Time:</strong>
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {new Date().toISOString()}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
