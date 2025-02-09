export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-lg text-gray-600">Loading...</span>
    </div>
  );
} 