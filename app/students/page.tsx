'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { StudentListReal } from '@/components/students/student-list-real';
import { StudentForm } from '@/components/forms/student-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function StudentsPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router, checkAuth]);

  if (isLoading) {
    return <LoadingPage text="Loading students..." />;
  }

  const handleAddStudent = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Refresh the page to show the new student
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
            <StudentListReal onAddStudent={handleAddStudent} />
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
                Back to Students
              </Button>
            </div>
            <StudentForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
