'use client';

import { useState, useEffect } from 'react';
import { CourseService } from '@/lib/erpnext/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingCard, LoadingButton } from '@/components/ui/loading';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { 
  BookOpenIcon, 
  PlusIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import type { Course } from '@/types';

interface CourseListProps {
  onAddCourse: () => void;
}

export function CourseList({ onAddCourse }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CourseService.getAll(50, 0);
      setCourses(response.data || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingCard title="Loading courses..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to Load Courses
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <LoadingButton
            onClick={loadCourses}
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
            <BookOpenIcon className="h-8 w-8 text-blue-600 mr-3" />
            Courses
          </h1>
          <p className="text-gray-600 mt-2">
            Manage course offerings and curriculum ({courses.length} courses)
          </p>
        </div>
        <LoadingButton
          onClick={onAddCourse}
          className="bg-blue-600 hover:bg-blue-700"
          isLoading={false}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Course
        </LoadingButton>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpenIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first course</p>
            <LoadingButton
              onClick={onAddCourse}
              isLoading={false}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Course
            </LoadingButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.name} 
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {course.course_name}
                    </CardTitle>
                    {course.course_code && (
                      <div className="text-sm text-gray-500">
                        Code: {course.course_code}
                      </div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {course.department && (
                    <div className="text-sm text-gray-600">
                      <strong>Department:</strong> {course.department}
                    </div>
                  )}
                  
                  {course.credit_hours && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{course.credit_hours} credit hours</span>
                    </div>
                  )}
                  
                  {course.max_students && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {course.enrolled_students || 0} / {course.max_students} students
                      </span>
                    </div>
                  )}
                  
                  {course.description && (
                    <div className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description
                      }
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Created: {formatDate(course.creation)}
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
