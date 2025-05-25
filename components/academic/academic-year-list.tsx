'use client';

import { useState, useEffect } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingCard, LoadingButton } from '@/components/ui/loading';
import { formatDate, getErrorMessage } from '@/lib/utils';
import {
  CalendarIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { AcademicYear } from '@/types';

interface AcademicYearListProps {
  onAddAcademicYear: () => void;
}

export function AcademicYearList({ onAddAcademicYear }: AcademicYearListProps) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/erpnext/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'get_list',
          doctype: 'Academic Year',
          limit_page_length: 50,
          fields: ['name', 'academic_year_name', 'year_start_date', 'year_end_date', 'creation', 'modified']
        }),
      });

      const result = await response.json();
      if (response.ok && !result.error) {
        setAcademicYears(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to load academic years');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingCard title="Loading academic years..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to Load Academic Years
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <LoadingButton
            onClick={loadAcademicYears}
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
            <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
            Academic Years
          </h1>
          <p className="text-gray-600 mt-2">
            Manage academic year configurations ({academicYears.length} years)
          </p>
        </div>
        <button
          onClick={onAddAcademicYear}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Academic Year
        </button>
      </div>

      {/* Academic Years List */}
      {academicYears.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No academic years found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first academic year</p>
            <button
              onClick={onAddAcademicYear}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Academic Year
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicYears.map((year) => (
            <Card
              key={year.name}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {year.academic_year_name}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {formatDate(year.year_start_date)} - {formatDate(year.year_end_date)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      Duration: {Math.ceil(
                        (new Date(year.year_end_date).getTime() - new Date(year.year_start_date).getTime())
                        / (1000 * 60 * 60 * 24)
                      )} days
                    </span>
                  </div>


                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Created: {formatDate(year.creation)}
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
