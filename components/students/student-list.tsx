'use client';

import { useState, useEffect } from 'react';
import { StudentService } from '@/lib/erpnext/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingCard, LoadingButton } from '@/components/ui/loading';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { 
  UserGroupIcon, 
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import type { Student } from '@/types';

interface StudentListProps {
  onAddStudent: () => void;
}

export function StudentList({ onAddStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await StudentService.getAll(50, 0);
      setStudents(response.data || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingCard title="Loading students..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to Load Students
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <LoadingButton
            onClick={loadStudents}
            isLoading={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </LoadingButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
            Students
          </h1>
          <p className="text-gray-600 mt-2">
            Manage student information and academic records ({students.length} students)
          </p>
        </div>
        <LoadingButton
          onClick={onAddStudent}
          className="bg-blue-600 hover:bg-blue-700"
          isLoading={false}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Student
        </LoadingButton>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search students by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.active !== false).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredStudents.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No students found' : 'No students yet'}
            </div>
            <div className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first student'
              }
            </div>
            {!searchTerm && (
              <LoadingButton
                onClick={onAddStudent}
                isLoading={false}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Student
              </LoadingButton>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.name} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {student.student_name}
                    </CardTitle>
                    {student.student_id && (
                      <div className="text-sm text-gray-500">
                        ID: {student.student_id}
                      </div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.active !== false 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.active !== false ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {student.student_email_id && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{student.student_email_id}</span>
                    </div>
                  )}
                  {student.student_mobile_number && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{student.student_mobile_number}</span>
                    </div>
                  )}
                  {student.program && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{student.program}</span>
                    </div>
                  )}
                  {student.guardian_name && (
                    <div className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      Guardian: {student.guardian_name}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Joined: {formatDate(student.joining_date)}
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
