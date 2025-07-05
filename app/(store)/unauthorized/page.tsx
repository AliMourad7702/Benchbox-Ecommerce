// app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        href="/"
        className="text-blue-600 hover:underline text-base"
      >
        Go back home
      </Link>
    </div>
  );
}
