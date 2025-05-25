'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { AcademicYearList } from '@/components/academic/academic-year-list';
import { AcademicYearForm } from '@/components/forms/academic-year-form';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AcademicYearsPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router, checkAuth]);

  if (isLoading) {
    return <LoadingPage text="Loading academic years..." />;
  }

  const handleAddAcademicYear = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    window.location.reload();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!showForm ? (
          <>
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <AcademicYearList onAddAcademicYear={handleAddAcademicYear} />
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <Button
                variant="outline"
                onClick={handleFormCancel}
                className="mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Academic Years
              </Button>
            </div>
            <AcademicYearForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
