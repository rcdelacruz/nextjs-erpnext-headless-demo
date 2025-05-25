'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/utils';
import type { StudentFormData } from '@/types';

interface StudentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentForm({ onSuccess, onCancel }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>();

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'create',
          doctype: 'Student',
          data: {
            first_name: data.student_name.split(' ')[0],
            last_name: data.student_name.split(' ').slice(1).join(' '),
            student_name: data.student_name,
            student_email_id: data.student_email_id,
            joining_date: data.joining_date,
            guardian_name: data.guardian_name,
            guardian_mobile_number: data.guardian_mobile_number,
            guardian_email: data.guardian_email,
          },
        }),
      });

      const result = await response.json();
      if (response.ok && !result.error) {
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Failed to create student');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Student</h2>
        <p className="text-slate-600">Enter student information to create a new enrollment record.</p>
      </div>

      <Card className="card-elevated">
        <CardContent className="p-8">
          {error && (
            <div className="alert-error mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">Personal Information</h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-group">
                  <label htmlFor="student_name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="student_name"
                    {...register('student_name', { required: 'Name is required' })}
                    className="form-input"
                    placeholder="Enter student's full name"
                  />
                  {errors.student_name && (
                    <p className="form-error">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.student_name.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="student_email_id" className="form-label">
                    Email Address *
                  </label>
                  <input
                    id="student_email_id"
                    type="email"
                    {...register('student_email_id', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="form-input"
                    placeholder="student@university.edu"
                  />
                  {errors.student_email_id && (
                    <p className="form-error">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.student_email_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="form-group">
                  <label htmlFor="student_mobile_number" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    id="student_mobile_number"
                    {...register('student_mobile_number')}
                    className="form-input"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date_of_birth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    id="date_of_birth"
                    type="date"
                    {...register('date_of_birth')}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="joining_date" className="form-label">
                    Joining Date *
                  </label>
                  <input
                    id="joining_date"
                    type="date"
                    {...register('joining_date', { required: 'Joining date is required' })}
                    className="form-input"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  {errors.joining_date && (
                    <p className="form-error">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.joining_date.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Guardian Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">Guardian Information</h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-group">
                  <label htmlFor="guardian_name" className="form-label">
                    Guardian Name *
                  </label>
                  <input
                    id="guardian_name"
                    {...register('guardian_name', { required: 'Guardian name is required' })}
                    className="form-input"
                    placeholder="Enter guardian's full name"
                  />
                  {errors.guardian_name && (
                    <p className="form-error">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.guardian_name.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="guardian_email" className="form-label">
                    Guardian Email
                  </label>
                  <input
                    id="guardian_email"
                    type="email"
                    {...register('guardian_email')}
                    className="form-input"
                    placeholder="guardian@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-group">
                  <label htmlFor="guardian_mobile_number" className="form-label">
                    Guardian Mobile *
                  </label>
                  <input
                    id="guardian_mobile_number"
                    {...register('guardian_mobile_number', { required: 'Guardian mobile is required' })}
                    className="form-input"
                    placeholder="+1234567890"
                  />
                  {errors.guardian_mobile_number && (
                    <p className="form-error">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.guardian_mobile_number.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="emergency_contact_name" className="form-label">
                    Emergency Contact
                  </label>
                  <input
                    id="emergency_contact_name"
                    {...register('emergency_contact_name')}
                    className="form-input"
                    placeholder="Emergency contact name"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-buttons">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="form-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="form-button-primary"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Student...
                  </>
                ) : (
                  'Add Student'
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
