'use client';

import { useState } from 'react';
import { Clock, Eye, Link as LinkIcon, FileText, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<number | ''>('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl === '' ? undefined : Number(ttl),
          max_views: maxViews === '' ? undefined : Number(maxViews),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
      setContent('');
      setTtl('');
      setMaxViews('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Pastebin-Lite
          </h1>
          <p className="text-slate-400 text-lg">
            Create temporary, secure, and self-destructing pastes.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Content
              </label>
              <textarea
                id="content"
                rows={10}
                required
                className="block w-full rounded-xl border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm placeholder:text-slate-600 transition-all"
                placeholder="Paste your code or text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="ttl" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  TTL (Seconds)
                </label>
                <input
                  type="number"
                  id="ttl"
                  min="1"
                  className="block w-full rounded-xl border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="Optional (e.g. 3600)"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="maxViews" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  Max Views
                </label>
                <input
                  type="number"
                  id="maxViews"
                  min="1"
                  className="block w-full rounded-xl border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="Optional (e.g. 5)"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Paste
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-slate-900/50 border border-indigo-500/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm font-medium">Paste Created Successfully!</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    readOnly
                    className="block w-full rounded-lg border-slate-700 bg-slate-800 text-slate-300 text-sm font-mono pl-10 pr-4 py-2"
                    value={result.url}
                  />
                </div>
                <a
                  href={`/p/${result.id}`}
                  className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-100 bg-indigo-600/50 hover:bg-indigo-600 transition-all"
                >
                  View Paste
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
