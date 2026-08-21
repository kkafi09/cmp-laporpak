import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from '@tanstack/react-router';
import { CitizenPortal } from './pages/CitizenPortal';
import { TrackComplaint } from './pages/TrackComplaint';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { TriageDashboard } from './pages/TriageDashboard';
import { OpdManagement } from './pages/OpdManagement';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SettingsPage } from './pages/SettingsPage';

// 1. Root Route
const rootRoute = createRootRoute({
  component: () => <Outlet />
});

// 2. Public Citizen Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CitizenPortal
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lacak',
  component: TrackComplaint
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage
});

// 3. Admin Layout & Subroutes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout
});

const adminTriageRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: TriageDashboard
});

const adminOpdRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/opd',
  component: OpdManagement
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/analytics',
  component: AnalyticsDashboard
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: SettingsPage
});

// 4. Assemble Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  trackRoute,
  loginRoute,
  registerRoute,
  adminLayoutRoute.addChildren([
    adminTriageRoute,
    adminOpdRoute,
    adminAnalyticsRoute,
    adminSettingsRoute
  ])
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
