'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface Student {
  name: string;
  student_name: string;
  first_name: string;
  last_name: string;
  student_email_id: string;
  joining_date: string;
  enabled: number;
}

interface StudentListProps {
  onAddStudent?: () => void;
}

export function StudentListReal({ onAddStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      console.log('Loading students from ERPNext...');

      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'get_list',
          doctype: 'Student',
          limit_page_length: 50,
          fields: ['name', 'student_name', 'first_name', 'last_name', 'student_email_id', 'joining_date', 'enabled']
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setStudents(result.data || []);
        console.log('Students loaded:', result.data?.length || 0);
      } else {
        throw new Error('Failed to load students');
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={loadStudents} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>
        {onAddStudent && (
          <button
            onClick={onAddStudent}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Student
          </button>
        )}
      </div>

      {/* Students Grid */}
      {students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first student to the system.
            </p>
            {onAddStudent && (
              <button
                onClick={onAddStudent}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Student
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  {student.student_name || `${student.first_name} ${student.last_name}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>Student ID:</strong> {student.name}
                  </p>
                  {student.student_email_id && (
                    <p className="text-gray-600">
                      <strong>Email:</strong> {student.student_email_id}
                    </p>
                  )}
                  {student.joining_date && (
                    <p className="text-gray-600">
                      <strong>Joined:</strong> {new Date(student.joining_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {student.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
