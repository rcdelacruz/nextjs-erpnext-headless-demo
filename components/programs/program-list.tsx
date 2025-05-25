'use client';

import { useState, useEffect } from 'react';
import { ProgramService } from '@/lib/erpnext/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingCard, LoadingButton } from '@/components/ui/loading';
import { formatDate, getErrorMessage, formatCurrency } from '@/lib/utils';
import { 
  AcademicCapIcon, 
  PlusIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { Program } from '@/types';

interface ProgramListProps {
  onAddProgram: () => void;
}

export function ProgramList({ onAddProgram }: ProgramListProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ProgramService.getAll(50, 0);
      setPrograms(response.data || []);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingCard title="Loading programs..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to Load Programs
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <LoadingButton
            onClick={loadPrograms}
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
            <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
            Programs
          </h1>
          <p className="text-gray-600 mt-2">
            Manage academic programs and degrees ({programs.length} programs)
          </p>
        </div>
        <LoadingButton
          onClick={onAddProgram}
          className="bg-blue-600 hover:bg-blue-700"
          isLoading={false}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Program
        </LoadingButton>
      </div>

      {/* Programs List */}
      {programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AcademicCapIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first program</p>
            <LoadingButton
              onClick={onAddProgram}
              isLoading={false}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Program
            </LoadingButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card 
              key={program.name} 
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {program.program_name}
                    </CardTitle>
                    {program.program_code && (
                      <div className="text-sm text-gray-500">
                        Code: {program.program_code}
                      </div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.is_published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {program.department && (
                    <div className="text-sm text-gray-600">
                      <strong>Department:</strong> {program.department}
                    </div>
                  )}
                  
                  {program.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {program.duration} {program.duration_type || 'years'}
                      </span>
                    </div>
                  )}
                  
                  {program.max_students && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {program.enrolled_students || 0} / {program.max_students} students
                      </span>
                    </div>
                  )}
                  
                  {program.fees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatCurrency(program.fees)}</span>
                    </div>
                  )}
                  
                  {program.description && (
                    <div className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      {program.description.length > 100 
                        ? `${program.description.substring(0, 100)}...` 
                        : program.description
                      }
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Created: {formatDate(program.creation)}
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
