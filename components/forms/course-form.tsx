'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils';
import { BookOpenIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Course } from '@/types';

interface CourseFormData {
  course_name: string;
  course_code?: string;
  department?: string;
  course_abbreviation?: string;
  description?: string;
  credit_hours?: number;
  max_students?: number;
  is_published?: boolean;
}

interface CourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  course?: Course;
}

export function CourseForm({ onSuccess, onCancel, course }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: course ? {
      course_name: course.course_name,
      course_code: course.course_code,
      department: course.department,
      course_abbreviation: course.course_abbreviation,
      description: course.description,
      credit_hours: course.credit_hours,
      max_students: course.max_students,
      is_published: course.is_published,
    } : {
      is_published: false,
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const method = course ? 'update' : 'create';
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          doctype: 'Course',
          ...(course ? { name: course.name } : {}),
          data: {
            course_name: data.course_name,
            description: data.description,
          },
        }),
      });

      const result = await response.json();
      if (response.ok && !result.error) {
        onSuccess();
      } else {
        throw new Error(result.error || 'Failed to save course');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {course ? 'Edit Course' : 'Add New Course'}
        </h2>
        <p className="text-slate-600">Create a new course offering for the academic program.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="alert-error">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Course Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Course Information</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="course_name" className="form-label">
                Course Name *
              </label>
              <input
                id="course_name"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                {...register('course_name', {
                  required: 'Course name is required',
                  minLength: {
                    value: 2,
                    message: 'Course name must be at least 2 characters',
                  },
                })}
                className="form-input"
              />
              {errors.course_name && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.course_name.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="course_code" className="form-label">
                Course Code
              </label>
              <input
                id="course_code"
                type="text"
                placeholder="e.g., CS101"
                {...register('course_code')}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Course description..."
              {...register('description')}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-buttons">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="form-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="form-button-primary"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {course ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              course ? 'Update Course' : 'Create Course'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
