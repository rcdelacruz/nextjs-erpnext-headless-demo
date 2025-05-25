'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { ArrowLeftIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function ApiTestPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [selectedTest, setSelectedTest] = useState('health');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiTests = {
    health: {
      name: 'Health Check',
      endpoint: '/api/health',
      method: 'GET',
      description: 'Test if the API and ERPNext connection are working',
      body: '',
    },
    student_list: {
      name: 'Get Students',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Fetch list of students from ERPNext',
      body: JSON.stringify({
        doctype: 'Student',
        method: 'get_list',
        limit_page_length: 5,
      }, null, 2),
    },
    student_count: {
      name: 'Count Students',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Get total count of students',
      body: JSON.stringify({
        doctype: 'Student',
        method: 'get_count',
        filters: {},
      }, null, 2),
    },
    program_list: {
      name: 'Get Programs',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Fetch list of academic programs',
      body: JSON.stringify({
        doctype: 'Program',
        method: 'get_list',
        limit_page_length: 5,
      }, null, 2),
    },
    course_list: {
      name: 'Get Courses',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Fetch list of courses',
      body: JSON.stringify({
        doctype: 'Course',
        method: 'get_list',
        limit_page_length: 5,
      }, null, 2),
    },
    system_info: {
      name: 'System Info',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Get ERPNext system information',
      body: JSON.stringify({
        method: 'call_method',
        method_name: 'frappe.utils.get_site_info',
      }, null, 2),
    },
    custom: {
      name: 'Custom Request',
      endpoint: '/api/erpnext/operation',
      method: 'POST',
      description: 'Send a custom request to ERPNext',
      body: JSON.stringify({
        doctype: 'Student',
        method: 'get_list',
        filters: {},
        fields: ['name', 'student_name', 'student_email_id'],
        limit_page_length: 3,
      }, null, 2),
    },
  };

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
  }, [router, checkAuth]);

  useEffect(() => {
    setRequestBody(apiTests[selectedTest].body);
  }, [selectedTest]);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const test = apiTests[selectedTest];
      const startTime = Date.now();

      let fetchOptions: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.method === 'POST' && requestBody.trim()) {
        fetchOptions.body = requestBody;
      }

      const response = await fetch(test.endpoint, fetchOptions);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
      });

    } catch (err: any) {
      console.error('API test failed:', err);
      setError(err.message || 'API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CodeBracketIcon className="h-6 w-6 text-blue-600 mr-2" />
                  API Test Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="test-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Test:
                    </label>
                    <select
                      id="test-select"
                      value={selectedTest}
                      onChange={(e) => setSelectedTest(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(apiTests).map(([key, test]) => (
                        <option key={key} value={key}>
                          {test.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {apiTests[selectedTest].description}
                    </p>
                    <div className="bg-gray-100 p-2 rounded text-sm">
                      <strong>Endpoint:</strong> {apiTests[selectedTest].endpoint}
                      <br />
                      <strong>Method:</strong> {apiTests[selectedTest].method}
                    </div>
                  </div>

                  {apiTests[selectedTest].method === 'POST' && (
                    <div>
                      <label htmlFor="request-body" className="block text-sm font-medium text-gray-700 mb-2">
                        Request Body:
                      </label>
                      <textarea
                        id="request-body"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        placeholder="Enter JSON request body..."
                      />
                    </div>
                  )}

                  <LoadingButton
                    onClick={runTest}
                    isLoading={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Run Test
                  </LoadingButton>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
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

            {response && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Response
                    <span className={`px-2 py-1 rounded text-sm ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <strong>Response Time:</strong> {response.responseTime}ms
                      <br />
                      <strong>Timestamp:</strong> {response.timestamp}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Response Data:</h4>
                      <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        <pre className="text-sm">
                          {typeof response.data === 'string' 
                            ? response.data 
                            : JSON.stringify(response.data, null, 2)
                          }
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Response Headers:</h4>
                      <div className="bg-gray-100 p-4 rounded overflow-auto max-h-32">
                        <pre className="text-sm">
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!response && !error && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <CodeBracketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No response yet</h3>
                  <p className="text-gray-500">
                    Select a test and click "Run Test" to see the API response.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
