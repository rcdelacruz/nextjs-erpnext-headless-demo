'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { getErrorMessage } from '@/lib/utils';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { DEMO_USERS } from '@/lib/auth/role-permissions';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, checkAuth } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (checkAuth()) {
      router.push('/dashboard');
    }
  }, [router, checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        console.log('✅ Login successful, redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        setError('Invalid username or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleQuickLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setFormData({ username, password });

    try {
      const success = await login(username, password);
      if (success) {
        console.log('✅ Quick login successful, redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        setError('Quick login failed. Please check your ERPNext configuration.');
      }
    } catch (err: any) {
      console.error('❌ Quick login error:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <AcademicCapIcon className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduCore ERP</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your ERPNext educational management account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your username or email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !formData.username || !formData.password}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Demo Users Quick Login */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Users - Quick Login</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {DEMO_USERS.map((demoUser) => (
                <button
                  key={demoUser.username}
                  onClick={() => handleQuickLogin(demoUser.username, demoUser.password)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-2 text-left text-xs bg-white rounded border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-3 h-3 text-blue-600" />
                    <span className="font-medium text-blue-900">{demoUser.username}</span>
                  </div>
                  <span className="text-blue-600 text-xs">{demoUser.description}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
              <p className="font-medium mb-1">All Demo Users Available:</p>
              <p><strong>admin</strong> - Full system access</p>
              <p><strong>academic.admin</strong> - Academic administration</p>
              <p><strong>registrar</strong> - Student enrollment & records</p>
              <p><strong>prof.smith</strong> - Faculty member access</p>
              <p><strong>student.doe</strong> - Student self-service</p>
              <p><strong>data.clerk</strong> - Data entry operations</p>
              <p><strong>reports.viewer</strong> - Reports and analytics</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Click any demo user to login instantly. Make sure your ERPNext instance is running.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
          <div className="text-xs text-gray-500">
            Powered by ERPNext • Built with Next.js
          </div>
        </div>

        {/* System Status */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
