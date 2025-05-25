'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProgramService } from '@/lib/erpnext/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils';
import { AcademicCapIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Program } from '@/types';

interface ProgramFormData {
  program_name: string;
  program_code?: string;
  department?: string;
  program_abbreviation?: string;
  description?: string;
  duration?: number;
  duration_type?: string;
  max_students?: number;
  fees?: number;
  application_fee?: number;
  eligibility?: string;
  is_published?: boolean;
}

interface ProgramFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  program?: Program;
}

export function ProgramForm({ onSuccess, onCancel, program }: ProgramFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramFormData>({
    defaultValues: program ? {
      program_name: program.program_name,
      program_code: program.program_code,
      department: program.department,
      program_abbreviation: program.program_abbreviation,
      description: program.description,
      duration: program.duration,
      duration_type: program.duration_type,
      max_students: program.max_students,
      fees: program.fees,
      application_fee: program.application_fee,
      eligibility: program.eligibility,
      is_published: program.is_published,
    } : {
      duration_type: 'Years',
      is_published: false,
    },
  });

  const onSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (program) {
        await ProgramService.update(program.name, data);
      } else {
        await ProgramService.create(data);
      }
      onSuccess();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
          {program ? 'Edit Program' : 'Add New Program'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Program Name */}
          <div>
            <label htmlFor="program_name" className="block text-sm font-medium text-gray-700 mb-2">
              Program Name *
            </label>
            <Input
              id="program_name"
              type="text"
              placeholder="e.g., Bachelor of Computer Science"
              {...register('program_name', {
                required: 'Program name is required',
                minLength: {
                  value: 2,
                  message: 'Program name must be at least 2 characters',
                },
              })}
              className={errors.program_name ? 'border-red-500' : ''}
            />
            {errors.program_name && (
              <p className="text-red-600 text-sm mt-1">{errors.program_name.message}</p>
            )}
          </div>

          {/* Program Code */}
          <div>
            <label htmlFor="program_code" className="block text-sm font-medium text-gray-700 mb-2">
              Program Code
            </label>
            <Input
              id="program_code"
              type="text"
              placeholder="e.g., BCS"
              {...register('program_code')}
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <Input
              id="department"
              type="text"
              placeholder="e.g., Computer Science"
              {...register('department')}
            />
          </div>

          {/* Program Abbreviation */}
          <div>
            <label htmlFor="program_abbreviation" className="block text-sm font-medium text-gray-700 mb-2">
              Program Abbreviation
            </label>
            <Input
              id="program_abbreviation"
              type="text"
              placeholder="e.g., B.CS"
              {...register('program_abbreviation')}
            />
          </div>

          {/* Duration and Duration Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="e.g., 4"
                {...register('duration', {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Duration must be at least 1',
                  },
                })}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="duration_type" className="block text-sm font-medium text-gray-700 mb-2">
                Duration Type
              </label>
              <select
                id="duration_type"
                {...register('duration_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Years">Years</option>
                <option value="Months">Months</option>
                <option value="Semesters">Semesters</option>
              </select>
            </div>
          </div>

          {/* Max Students */}
          <div>
            <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Students
            </label>
            <Input
              id="max_students"
              type="number"
              min="1"
              placeholder="e.g., 100"
              {...register('max_students', {
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Maximum students must be at least 1',
                },
              })}
              className={errors.max_students ? 'border-red-500' : ''}
            />
            {errors.max_students && (
              <p className="text-red-600 text-sm mt-1">{errors.max_students.message}</p>
            )}
          </div>

          {/* Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-2">
                Program Fees
              </label>
              <Input
                id="fees"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 50000"
                {...register('fees', {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Fees must be positive',
                  },
                })}
                className={errors.fees ? 'border-red-500' : ''}
              />
              {errors.fees && (
                <p className="text-red-600 text-sm mt-1">{errors.fees.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="application_fee" className="block text-sm font-medium text-gray-700 mb-2">
                Application Fee
              </label>
              <Input
                id="application_fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 1000"
                {...register('application_fee', {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Application fee must be positive',
                  },
                })}
                className={errors.application_fee ? 'border-red-500' : ''}
              />
              {errors.application_fee && (
                <p className="text-red-600 text-sm mt-1">{errors.application_fee.message}</p>
              )}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility Criteria
            </label>
            <textarea
              id="eligibility"
              rows={3}
              placeholder="e.g., High school diploma or equivalent..."
              {...register('eligibility')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Program description..."
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Is Published */}
          <div className="flex items-center">
            <input
              id="is_published"
              type="checkbox"
              {...register('is_published')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
              Publish program (make it available for enrollment)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText={program ? 'Updating...' : 'Creating...'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {program ? 'Update Program' : 'Create Program'}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
