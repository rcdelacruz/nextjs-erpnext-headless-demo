'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface Course {
  name: string;
  course_name: string;
  creation: string;
  modified: string;
}

interface CourseListProps {
  onAddCourse?: () => void;
}

export function CourseListReal({ onAddCourse }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      console.log('Loading courses from ERPNext...');

      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'get_list',
          doctype: 'Course',
          limit_page_length: 50,
          fields: ['name', 'course_name', 'creation', 'modified']
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCourses(result.data || []);
        console.log('Courses loaded:', result.data?.length || 0);
      } else {
        throw new Error('Failed to load courses');
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses');
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
            <p className="mt-2 text-gray-600">Loading courses...</p>
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
            <Button onClick={loadCourses} className="mt-2">
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
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {onAddCourse && (
          <button
            onClick={onAddCourse}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Course
          </button>
        )}
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first course to the curriculum.
            </p>
            {onAddCourse && (
              <button
                onClick={onAddCourse}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Course
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-600" />
                  {course.course_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>Course ID:</strong> {course.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Created:</strong> {new Date(course.creation).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Active
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
