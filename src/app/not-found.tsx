import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-slate-300 dark:text-slate-800 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Paste non-existent or expired</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    The paste you are looking for has either reached its view limit, expired based on time, or never existed in the first place.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
