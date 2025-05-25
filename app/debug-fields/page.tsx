'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function DebugFieldsPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [selectedDoctype, setSelectedDoctype] = useState('Student');
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doctypes = [
    'Student',
    'Program', 
    'Course',
    'Academic Year',
    'Customer',
    'Supplier',
    'User',
    'Company',
    'Student Group',
    'Fee Structure',
    'Instructor',
    'Student Batch Name',
  ];

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
  }, [router, checkAuth]);

  const fetchFields = async (doctype: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get doctype meta information from ERPNext
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'call_method',
          method_name: 'frappe.desk.form.meta.get_meta',
          args: { doctype: doctype },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.fields) {
        setFields(result.data.fields);
      } else {
        // Fallback: try to get a sample document to infer fields
        const sampleResponse = await fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctype: doctype,
            method: 'get_list',
            limit_page_length: 1,
          }),
        });

        if (sampleResponse.ok) {
          const sampleResult = await sampleResponse.json();
          if (sampleResult.data && sampleResult.data.length > 0) {
            const sampleDoc = sampleResult.data[0];
            const inferredFields = Object.keys(sampleDoc).map(key => ({
              fieldname: key,
              fieldtype: typeof sampleDoc[key] === 'string' ? 'Data' : 
                         typeof sampleDoc[key] === 'number' ? 'Int' :
                         typeof sampleDoc[key] === 'boolean' ? 'Check' : 'Data',
              label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              reqd: 0,
              read_only: 0,
            }));
            setFields(inferredFields);
          } else {
            setFields([]);
          }
        } else {
          throw new Error('Could not fetch field information');
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch fields:', err);
      setError(err.message || 'Failed to fetch fields');
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctype) {
      fetchFields(selectedDoctype);
    }
  }, [selectedDoctype]);

  const getFieldTypeColor = (fieldtype: string) => {
    const colors = {
      'Data': 'bg-blue-100 text-blue-800',
      'Text': 'bg-green-100 text-green-800',
      'Int': 'bg-purple-100 text-purple-800',
      'Float': 'bg-purple-100 text-purple-800',
      'Currency': 'bg-yellow-100 text-yellow-800',
      'Date': 'bg-orange-100 text-orange-800',
      'Datetime': 'bg-orange-100 text-orange-800',
      'Check': 'bg-gray-100 text-gray-800',
      'Select': 'bg-indigo-100 text-indigo-800',
      'Link': 'bg-red-100 text-red-800',
      'Table': 'bg-pink-100 text-pink-800',
      'HTML': 'bg-teal-100 text-teal-800',
    };
    return colors[fieldtype] || 'bg-gray-100 text-gray-800';
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                ERPNext Doctype Fields Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="doctype-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Doctype:
                  </label>
                  <select
                    id="doctype-select"
                    value={selectedDoctype}
                    onChange={(e) => setSelectedDoctype(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {doctypes.map((doctype) => (
                      <option key={doctype} value={doctype}>
                        {doctype}
                      </option>
                    ))}
                  </select>
                </div>

                <LoadingButton
                  onClick={() => fetchFields(selectedDoctype)}
                  isLoading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Refresh Fields
                </LoadingButton>
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

          {fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDoctype} Fields ({fields.length} fields)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Label
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Required
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Read Only
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fields.map((field, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {field.fieldname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.label || field.fieldname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getFieldTypeColor(field.fieldtype)}`}>
                              {field.fieldtype}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.reqd ? (
                              <span className="text-red-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field.read_only ? (
                              <span className="text-orange-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && fields.length === 0 && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
                <p className="text-gray-500">
                  Select a doctype and click "Refresh Fields" to explore its structure.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
