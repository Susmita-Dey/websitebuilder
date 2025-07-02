"use client";

import { useState } from "react";
import WebsiteGenerator from "@/components/WebsiteGenerator";
import PageList from "@/components/PageList";
import PagePreview from "@/components/PagePreview";
import VisualEditor from "@/components/VisualEditor";
import AIEditPrompt from "@/components/AIEditPrompt";
import { Page, Website } from "@/lib/types";

export default function Home() {
  const [website, setWebsite] = useState<Website | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleWebsiteGenerated = (generatedWebsite: Website) => {
    setWebsite(generatedWebsite);
    if (generatedWebsite.pages.length > 0) {
      setSelectedPage(generatedWebsite.pages[0]);
    }
  };

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
    setShowEditor(false);
  };

  const handlePageUpdate = (updatedPage: Page) => {
    if (!website) return;
    const updatedWebsite = {
      ...website,
      pages: website.pages.map((page) =>
        page.name === updatedPage.name ? updatedPage : page
      ),
    };
    setWebsite(updatedWebsite);
    setSelectedPage(updatedPage);
  };

  const handleNewWebsite = () => {
    setWebsite(null);
    setSelectedPage(null);
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-3 rounded-full shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 4h16v16H4V4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 10h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 4v16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 drop-shadow-lg">
              AI Website Generator
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl text-center">
            Instantly create beautiful, multi-page websites with the power of
            AI. Describe your vision and watch it come to life!
          </p>
        </header>

        {/* Main Content */}
        {!website ? (
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl p-8 border border-white/40">
              <WebsiteGenerator
                onWebsiteGenerated={handleWebsiteGenerated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 sticky top-10 self-start">
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-white/40 p-4">
                <PageList
                  pages={website.pages}
                  selectedPage={selectedPage}
                  onPageSelect={handlePageSelect}
                  onNewWebsite={handleNewWebsite}
                />

                {selectedPage && (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => selectedPage && setShowEditor((v) => !v)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-sm
                        ${
                          showEditor
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                            : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
                        }
                      `}
                      aria-label={
                        showEditor
                          ? "Switch to View Mode"
                          : "Switch to Edit Mode"
                      }
                      title={
                        showEditor
                          ? "Switch to View Mode"
                          : "Switch to Edit Mode"
                      }
                    >
                      {showEditor ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M4 10h12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10 4v12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          View Mode
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M4 4h12v12H4V4z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 8h12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 4v12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Edit Mode
                        </>
                      )}
                    </button>

                    <AIEditPrompt
                      websiteId={website.id}
                      pageName={selectedPage.name}
                      onPageUpdate={handlePageUpdate}
                    />
                  </div>
                )}
              </div>
            </aside>

            {/* Main Preview/Editor */}
            <main className="lg:col-span-3">
              {selectedPage && (
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-white/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedPage.name} Page
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedPage.description}
                      </p>
                    </div>
                  </div>

                  <div className="transition-all duration-300">
                    {showEditor ? (
                      <VisualEditor
                        page={selectedPage}
                        onPageUpdate={handlePageUpdate}
                      />
                    ) : (
                      <PagePreview page={selectedPage} />
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Floating New Website Button */}
      {website && (
        <button
          onClick={handleNewWebsite}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Start a new website"
          title="Start a new website"
        >
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 5v10M5 10h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New Website
        </button>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-16 pb-8 flex flex-col items-center text-gray-400 text-sm">
        <span>
          &copy; {new Date().getFullYear()} AI Website Generator &mdash; Crafted
          with <span className="text-pink-400">♥</span> using Next.js & Tailwind
          CSS
        </span>
      </footer>
    </div>
  );
}
