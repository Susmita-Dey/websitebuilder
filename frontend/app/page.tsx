"use client";

import { useState } from "react";
import WebsiteGenerator from "@/components/WebsiteGenerator";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 relative overflow-x-hidden flex flex-col items-center justify-center my-5">
      {/* Decorative Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 flex justify-center items-center flex-col">
        {/* Hero Section */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Website Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into stunning websites in seconds. Just
            describe what you want, and watch the magic happen.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <WebsiteGenerator isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 pb-8 flex flex-col items-center text-gray-500 text-sm text-center px-4">
        <span>
          &copy; {new Date().getFullYear()} AI Website Generator — Built with{" "}
          <span className="text-pink-400">♥</span> using Next.js & Tailwind CSS
        </span>
      </footer>
    </div>
  );
}
