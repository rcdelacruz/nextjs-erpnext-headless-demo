'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils';
import { CalendarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { AcademicYear } from '@/types';

interface AcademicYearFormData {
  academic_year_name: string;
  year_start_date: string;
  year_end_date: string;
  is_default?: boolean;
}

interface AcademicYearFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  academicYear?: AcademicYear;
}

export function AcademicYearForm({ onSuccess, onCancel, academicYear }: AcademicYearFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AcademicYearFormData>({
    defaultValues: academicYear ? {
      academic_year_name: academicYear.academic_year_name,
      year_start_date: academicYear.year_start_date,
      year_end_date: academicYear.year_end_date,
      is_default: academicYear.is_default,
    } : {
      is_default: false,
    },
  });

  const startDate = watch('year_start_date');

  const onSubmit = async (data: AcademicYearFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const method = academicYear ? 'update' : 'create';
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          doctype: 'Academic Year',
          ...(academicYear ? { name: academicYear.name } : {}),
          data: {
            academic_year_name: data.academic_year_name,
            year_start_date: data.year_start_date,
            year_end_date: data.year_end_date,
          },
        }),
      });

      const result = await response.json();
      if (response.ok && !result.error) {
        onSuccess();
      } else {
        throw new Error(result.error || 'Failed to save academic year');
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
          {academicYear ? 'Edit Academic Year' : 'Add New Academic Year'}
        </h2>
        <p className="text-slate-600">Define the academic year period and enrollment dates.</p>
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

        {/* Academic Year Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Academic Year Information</h3>

          <div className="form-group">
            <label htmlFor="academic_year_name" className="form-label">
              Academic Year Name *
            </label>
            <input
              id="academic_year_name"
              type="text"
              placeholder="e.g., 2024-25"
              {...register('academic_year_name', {
                required: 'Academic year name is required',
                minLength: {
                  value: 2,
                  message: 'Academic year name must be at least 2 characters',
                },
              })}
              className="form-input"
            />
            {errors.academic_year_name && (
              <p className="form-error">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.academic_year_name.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="year_start_date" className="form-label">
                Start Date *
              </label>
              <input
                id="year_start_date"
                type="date"
                {...register('year_start_date', {
                  required: 'Start date is required',
                })}
                className="form-input"
              />
              {errors.year_start_date && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.year_start_date.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="year_end_date" className="form-label">
                End Date *
              </label>
              <input
                id="year_end_date"
                type="date"
                min={startDate}
                {...register('year_end_date', {
                  required: 'End date is required',
                  validate: (value) => {
                    if (startDate && value <= startDate) {
                      return 'End date must be after start date';
                    }
                    return true;
                  },
                })}
                className="form-input"
              />
              {errors.year_end_date && (
                <p className="form-error">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.year_end_date.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Is Default */}
        <div className="flex items-center">
          <input
            id="is_default"
            type="checkbox"
            {...register('is_default')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
            Set as default academic year
          </label>
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
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {academicYear ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              academicYear ? 'Update Academic Year' : 'Create Academic Year'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
