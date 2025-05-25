'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingPage, Loading } from '@/components/ui/loading';
import { CustomerService, SupplierService } from '@/lib/erpnext/services';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { ArrowLeftIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { Partner } from '@/types';

export default function PartnersPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    loadPartners();
  }, [router, checkAuth]);

  const loadPartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading real partners data from ERPNext...');

      // Load real customers and suppliers data
      const [customersResult, suppliersResult] = await Promise.allSettled([
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Customer', limit_page_length: 50 }),
        }).then(res => res.json()),
        fetch('/api/erpnext/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'get_list', doctype: 'Supplier', limit_page_length: 50 }),
        }).then(res => res.json()),
      ]);

      if (customersResult.status === 'fulfilled') {
        setCustomers(customersResult.value.data || []);
        console.log('Customers loaded:', customersResult.value.data?.length || 0);
      }

      if (suppliersResult.status === 'fulfilled') {
        setSuppliers(suppliersResult.value.data || []);
        console.log('Suppliers loaded:', suppliersResult.value.data?.length || 0);
      }

      console.log('Partners data loaded successfully');
    } catch (err) {
      console.error('Error loading partners:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage text="Loading partners..." />;
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading partners: {error}
            <Button variant="outline" size="sm" onClick={loadPartners} className="ml-2">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-2">
            Manage your customers and suppliers
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customers */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Customers ({customers.length})
            </h2>

            {customers.length === 0 ? (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <UserGroupIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-600 text-center">
                    Get started by adding your first customer to the system.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.name} className="card-interactive p-6 group">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${customer.customer_type === 'Company' ? 'from-blue-500 to-blue-600' : 'from-emerald-500 to-emerald-600'} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        {customer.customer_type === 'Company' ? (
                          <BuildingOfficeIcon className="w-6 h-6" />
                        ) : (
                          <UserGroupIcon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {customer.customer_name || customer.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {customer.customer_type === 'Company' ? 'Company' : 'Individual'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {customer.email_id && (
                        <p className="text-slate-600 flex items-center">
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{customer.email_id}</span>
                        </p>
                      )}
                      {customer.mobile_no && (
                        <p className="text-slate-600 flex items-center">
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{customer.mobile_no}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suppliers */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Suppliers ({suppliers.length})
            </h2>

            {suppliers.length === 0 ? (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <BuildingOfficeIcon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
                  <p className="text-gray-600 text-center">
                    Get started by adding your first supplier to the system.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.name} className="card-interactive p-6 group">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${supplier.supplier_type === 'Company' ? 'from-amber-500 to-amber-600' : 'from-emerald-500 to-emerald-600'} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        {supplier.supplier_type === 'Company' ? (
                          <BuildingOfficeIcon className="w-6 h-6" />
                        ) : (
                          <UserGroupIcon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {supplier.supplier_name || supplier.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {supplier.supplier_type === 'Company' ? 'Company' : 'Individual'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {supplier.email_id && (
                        <p className="text-slate-600 flex items-center">
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{supplier.email_id}</span>
                        </p>
                      )}
                      {supplier.mobile_no && (
                        <p className="text-slate-600 flex items-center">
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{supplier.mobile_no}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
