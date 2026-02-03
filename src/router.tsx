import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

// Lazy load pages for performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const MoviesPage = lazy(() => import('@/pages/MoviesPage'));
const TVShowsPage = lazy(() => import('@/pages/TVShowsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-2 border-[#7B61FF]/20 border-t-[#7B61FF] rounded-full animate-spin" />
  </div>
);

function Layout() {
  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navigation />
      <main className="flex-grow animate-fade-in optimize-gpu">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies',
        element: <MoviesPage />,
      },
      {
        path: 'tv-shows',
        element: <TVShowsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetailPage />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
      </Suspense>
    ),
  },
]);
