import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();
  
  let status = 404;
  let message = 'Page not found';
  let description = "The page you're looking for doesn't exist or has been moved.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || 'Something went wrong';
    if (status === 404) {
      message = 'Page not found';
      description = "The page you're looking for doesn't exist or has been moved.";
    }
  } else if (error instanceof Error) {
    message = 'Something went wrong';
    description = error.message;
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-[#F5C518]" />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-white mb-2">{status}</h1>
        
        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-white mb-4">{message}</h2>
        <p className="text-white/60 mb-8">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F5C518] text-white font-semibold rounded-lg hover:bg-[#6B51E8] transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
