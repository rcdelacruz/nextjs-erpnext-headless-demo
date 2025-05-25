import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, ERPNextLoginResponse } from '@/types';
import { assignDemoRoles } from '@/lib/auth/role-permissions';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string): Promise<boolean> => {
        try {
          console.log('Auth: Starting login process for username:', username);

          // Use Next.js API route for ERPNext authentication
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          console.log('Auth: API response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Auth: API error:', errorData);
            throw new Error(errorData.error || 'Authentication failed');
          }

          const result = await response.json();
          console.log('Auth: Login successful for user:', result.user);

          if (!result.user) {
            console.error('Auth: No user in result');
            return false;
          }

          // Create compatible user object for ERPNext
          const baseUser: ERPNextLoginResponse = {
            user: result.user,
            full_name: result.full_name,
            message: result.message,
            home_page: result.home_page,
            api_key: result.api_key,
            api_secret: result.api_secret,
          };

          // Assign demo roles for testing (in production, get roles from ERPNext API)
          const userWithRoles = assignDemoRoles(baseUser);

          console.log('Auth: Setting authentication state with roles:', userWithRoles.roles);
          set({
            isAuthenticated: true,
            user: userWithRoles,
          });

          // Store session in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('erpnext_session', JSON.stringify({
              user: result.user,
              full_name: result.full_name,
              api_key: result.api_key,
              api_secret: result.api_secret,
              timestamp: Date.now(),
            }));
          }

          return true;
        } catch (error: any) {
          console.error('Auth: Login failed:', error);
          set({
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async (): Promise<void> => {
        try {
          console.log('Auth: Starting logout process');

          // Call ERPNext logout endpoint if we have valid session
          const { user } = get();
          if (user?.api_key && user?.api_secret) {
            try {
              await fetch('/api/erpnext/operation', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  method: 'call_method',
                  method_name: 'logout',
                }),
              });
            } catch (error) {
              console.error('Auth: Logout API call failed:', error);
              // Continue with local logout even if API call fails
            }
          }

          // Clear local state
          set({
            isAuthenticated: false,
            user: null,
          });

          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('erpnext_session');
          }

          console.log('Auth: Logout completed');
        } catch (error) {
          console.error('Auth: Logout error:', error);
          // Force clear state even on error
          set({
            isAuthenticated: false,
            user: null,
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('erpnext_session');
          }
        }
      },

      checkAuth: (): boolean => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) {
          // Try to restore session from localStorage
          if (typeof window !== 'undefined') {
            try {
              const stored = localStorage.getItem('erpnext_session');
              if (stored) {
                const session = JSON.parse(stored);

                // Check if session is not too old (24 hours)
                const sessionAge = Date.now() - (session.timestamp || 0);
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                if (session.user && sessionAge < maxAge) {
                  console.log('Auth: Session restored for user:', session.user);

                  const baseUser = {
                    user: session.user,
                    full_name: session.full_name,
                    message: 'Session restored',
                    home_page: '/app',
                    api_key: session.api_key,
                    api_secret: session.api_secret,
                  };

                  // Assign demo roles for restored session
                  const userWithRoles = assignDemoRoles(baseUser);

                  set({
                    isAuthenticated: true,
                    user: userWithRoles,
                  });
                  return true;
                } else {
                  // Session expired, clear it
                  localStorage.removeItem('erpnext_session');
                }
              }
            } catch (error) {
              console.error('Auth: Failed to restore session:', error);
              localStorage.removeItem('erpnext_session');
            }
          }
          return false;
        }

        return true;
      },
    }),
    {
      name: 'erpnext-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
