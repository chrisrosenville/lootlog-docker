import { create } from "zustand";
import { User, UserRoles } from "@/types/user.types";
import { ROUTE_PERMISSIONS } from "../constants/permissions";
import { signInAction } from "@/lib/db/auth";

interface AuthState {
  user?: User | null;
  accessToken?: string | null;
  isLoading: boolean;
  error: string | null;

  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;

  hasAccess: (path: string) => boolean;
  getAccessibleRoutes: () => string[];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  accessToken: undefined,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);

      const res = await signInAction(formData);

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      set({
        user: res.user,
        accessToken: res.token,
        isLoading: false,
      });

      return { ok: true, message: "Signed in successfully" };
    } catch (error) {
      console.log("Login error:", error);
      set({ error: "An unknown error occurred", isLoading: false });
      return { ok: false, message: "An unknown error occurred" };
    }
  },

  logout: () => {
    set({ user: null, accessToken: null });
  },

  hasAccess: (path) => {
    const { user } = get();
    if (!user) return false;

    const allowedRoles = ROUTE_PERMISSIONS[path] || [];
    return user.roles.some((role) => allowedRoles.includes(role));
  },

  getAccessibleRoutes: () => {
    const { user } = get();
    if (!user) return [];

    return Object.keys(ROUTE_PERMISSIONS).filter((path) => {
      const allowedRoles = ROUTE_PERMISSIONS[path];
      return user.roles.some((role) => allowedRoles.includes(role));
    });
  },
}));

// components/ProtectedRoute.tsx
// import { useRouter } from 'next/router';
// import { ReactNode, useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';

// interface ProtectedRouteProps {
//   children: ReactNode;
//   path: string;
// }

// export const ProtectedRoute = ({ children, path }: ProtectedRouteProps) => {
//   const router = useRouter();
//   const { user, hasAccess, isLoading } = useAuthStore();

//   useEffect(() => {
//     // If not loading and either no user or no access, redirect
//     if (!isLoading && (!user || !hasAccess(path))) {
//       if (!user) {
//         router.push('/login');
//       } else {
//         // User is logged in but doesn't have access to this page
//         router.push('/dashboard');
//       }
//     }
//   }, [user, isLoading, path, hasAccess, router]);

//   // Show loading state
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // Don't render anything during redirect
//   if (!user || !hasAccess(path)) {
//     return null;
//   }

//   return <>{children}</>;
// };

// components/Navigation.tsx
// import Link from 'next/link';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/router';

// const Navigation = () => {
//   const { getAccessibleRoutes } = useAuthStore();
//   const router = useRouter();

//   // Map of routes to display names
//   const navItems = {
//     '/dashboard': 'Dashboard',
//     '/dashboard/create-article': 'Create Article',
//     '/dashboard/my-articles': 'My Articles',
//     '/dashboard/manage-users': 'Manage Users',
//     '/dashboard/analytics': 'Analytics'
//   };

//   // Get routes the user can access
//   const accessibleRoutes = getAccessibleRoutes();

//   // Filter navigation items based on accessible routes
//   const userNavItems = Object.entries(navItems)
//     .filter(([path]) => accessibleRoutes.includes(path));

//   return (
//     <nav className="dashboard-nav">
//       <ul>
//         {userNavItems.map(([path, name]) => (
//           <li key={path} className={router.pathname === path ? 'active' : ''}>
//             <Link href={path}>{name}</Link>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Navigation;

// hooks/useInitAuth.ts
// import { useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';

// export const useInitAuth = () => {
//   const { user, token, isLoading } = useAuthStore();

//   useEffect(() => {
//     // If we have a token but no user, fetch user data
//     const fetchUserData = async () => {
//       if (token && !user && !isLoading) {
//         try {
//           const response = await fetch('/api/auth/me', {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });

//           if (response.ok) {
//             const userData = await response.json();
//             useAuthStore.setState({ user: userData });
//           } else {
//             // Token invalid, clear it
//             useAuthStore.getState().logout();
//           }
//         } catch (error) {
//           console.error('Failed to fetch user data', error);
//         }
//       }
//     };

//     fetchUserData();
//   }, [token, user, isLoading]);

//   return { isInitialized: !token || !!user || isLoading };
// };

// pages/_app.tsx
// import { useInitAuth } from '@/hooks/useInitAuth';

// function MyApp({ Component, pageProps }) {
//   // Initialize auth on app load
//   const { isInitialized } = useInitAuth();

//   if (!isInitialized) {
//     return <div>Loading application...</div>;
//   }

//   return <Component {...pageProps} />;
// }

// export default MyApp;

// layouts/DashboardLayout.tsx
// import Navigation from '@/components/Navigation';
// import { ReactNode } from 'react';

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
//   return (
//     <div className="dashboard-container">
//       <aside className="dashboard-sidebar">
//         <Navigation />
//       </aside>
//       <main className="dashboard-content">
//         {children}
//       </main>
//     </div>
//   );
// };

// pages/dashboard/index.tsx
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { DashboardLayout } from '@/layouts/DashboardLayout';
// import { useAuthStore } from '@/store/authStore';

// export default function DashboardPage() {
//   const { user } = useAuthStore();

//   return (
//     <ProtectedRoute path="/dashboard">
//       <DashboardLayout>
//         <h1>Dashboard</h1>
//         <div className="user-info">
//           <h2>Your Profile</h2>
//           <p>Name: {user?.name}</p>
//           <p>Email: {user?.email}</p>
//           <p>Username: {user?.username}</p>
//           <p>Roles: {user?.roles.join(', ')}</p>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }

// Example page with role restriction
// pages/dashboard/create-article.tsx
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { DashboardLayout } from '@/layouts/DashboardLayout';
// import { signInAction } from '@/lib/db/auth';

// export default function CreateArticlePage() {
//   return (
//     <ProtectedRoute path="/dashboard/create-article">
//       <DashboardLayout>
//         <h1>Create New Article</h1>
//         {/* Article creation form */}
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }
