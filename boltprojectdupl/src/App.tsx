import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import { logger } from './utils/logger';

// Lazy load components with Sentry profiling
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Family = React.lazy(() => import('./pages/Family'));
const Chores = React.lazy(() => import('./pages/Chores'));
const Rewards = React.lazy(() => import('./pages/Rewards'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Support = React.lazy(() => import('./pages/Support'));
const Login = React.lazy(() => import('./pages/Login'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const ChildProfile = React.lazy(() => import('./pages/ChildProfile'));

// Enhanced loading fallback component
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Error fallback for critical failures
const CriticalErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
      <div className="text-red-600 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Application Error
      </h1>
      <p className="text-gray-600 mb-6">
        The application failed to load. Please refresh the page or contact support if the problem persists.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

// Wrap the entire app with Sentry's error boundary
const SentryRouter = Sentry.withSentryRouting(Router);

function App() {
  const { user, loading, error } = useAuth();

  // Log app initialization
  React.useEffect(() => {
    logger.info('App: Application initialized', {
      hasUser: !!user,
      userRole: user?.user_metadata?.role,
      timestamp: new Date().toISOString(),
    });
  }, [user]);

  // Show loading state while auth is initializing
  if (loading) {
    return <LoadingFallback message="Initializing application..." />;
  }

  // Show error state if auth failed critically
  if (error && !user) {
    logger.error('App: Critical auth error', { error });
    return <CriticalErrorFallback />;
  }

  // Unauthenticated routes
  if (!user) {
    return (
      <SentryRouter>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            logger.error('App: Unauthenticated route error', {
              error: error.message,
              componentStack: errorInfo.componentStack,
            });
          }}
        >
          <Suspense fallback={<LoadingFallback message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </SentryRouter>
    );
  }

  // Check if user is a child and redirect to profile if needed
  const isChild = user.user_metadata?.role === 'child';

  // Authenticated routes
  return (
    <SentryRouter>
      <Layout>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            logger.error('App: Authenticated route error', {
              error: error.message,
              componentStack: errorInfo.componentStack,
              userId: user.id,
              userRole: user.user_metadata?.role,
            });
          }}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        >
          <Suspense fallback={<LoadingFallback message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Navigate to={isChild ? "/profile" : "/dashboard"} replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ChildProfile />} />
              <Route path="/family" element={<Family />} />
              <Route path="/chores" element={<Chores />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Navigate to={isChild ? "/profile" : "/dashboard"} replace />} />
              <Route path="*" element={<Navigate to={isChild ? "/profile" : "/dashboard"} replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </SentryRouter>
  );
}

export default Sentry.withProfiler(App);