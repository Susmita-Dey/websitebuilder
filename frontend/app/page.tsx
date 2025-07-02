"use client";

import { useState } from "react";
import WebsiteGenerator from "@/components/WebsiteGenerator";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 relative overflow-x-hidden flex flex-col">
      {/* Decorative Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <main className="mx-auto p-4 flex flex-col items-center justify-center">
        {/* Generator Component */}
        <WebsiteGenerator isLoading={isLoading} setIsLoading={setIsLoading} />
      </main>

      {/* Footer */}
      <footer className="relative pb-8 flex flex-col items-center text-gray-600 dark:text-gray-400 text-sm text-center px-4">
        <span>
          &copy; {new Date().getFullYear()} AI Website Generator — Built with{" "}
          <span className="text-pink-500 font-bold">♥</span> using{" "}
          <Button variant="link" className="p-0 h-auto text-indigo-600" asChild>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
          </Button>{" "}
          &
          <Button
            variant="link"
            className="p-0 h-auto text-indigo-600 ml-1"
            asChild
          >
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tailwind CSS
            </a>
          </Button>
        </span>
      </footer>
    </div>
  );
}
