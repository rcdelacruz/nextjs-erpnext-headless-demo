'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { LoadingPage } from '@/components/ui/loading';
import { ModernDashboard } from '@/components/dashboard/modern-dashboard';


export default function DashboardPage() {
  const router = useRouter();
  const { checkAuth, user } = useAuthStore();
  const [stats, setStats] = useState({
    students: 0,
    customers: 0,
    suppliers: 0,
    courses: 0,
    currentAcademicYear: null as any,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    loadDashboardStats();
  }, [router, checkAuth]);

  const loadDashboardStats = async () => {
    try {
      console.log('Loading real ERPNext data...');

      // Load all data in parallel
      const [studentsResult, coursesResult, customersResult, suppliersResult] = await Promise.allSettled([
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Student', limit_page_length: 100 }),
        }).then(res => res.json()),
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Course', limit_page_length: 100 }),
        }).then(res => res.json()),
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Customer', limit_page_length: 100 }),
        }).then(res => res.json()),
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Supplier', limit_page_length: 100 }),
        }).then(res => res.json()),
      ]);

      const studentsCount = studentsResult.status === 'fulfilled' ? (studentsResult.value.data?.length || 0) : 0;
      const coursesCount = coursesResult.status === 'fulfilled' ? (coursesResult.value.data?.length || 0) : 0;
      const customersCount = customersResult.status === 'fulfilled' ? (customersResult.value.data?.length || 0) : 0;
      const suppliersCount = suppliersResult.status === 'fulfilled' ? (suppliersResult.value.data?.length || 0) : 0;

      setStats({
        students: studentsCount,
        customers: customersCount,
        suppliers: suppliersCount,
        courses: coursesCount,
        currentAcademicYear: {
          name: '2024-2025',
          start_date: '2024-08-01',
          end_date: '2025-07-31'
        },
      });

      console.log('Real ERPNext data loaded successfully:', {
        students: studentsCount,
        courses: coursesCount,
        customers: customersCount,
        suppliers: suppliersCount
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Fallback to demo data
      setStats({
        students: 0,
        customers: 0,
        suppliers: 0,
        courses: 0,
        currentAcademicYear: 'Error loading data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ModernDashboard stats={stats} user={user} />
      </main>
    </div>
  );
}
