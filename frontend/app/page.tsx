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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Website Generator
          </h1>
          <p className="text-lg text-gray-600">
            Describe your website and watch it come to life with AI
          </p>
        </header>

        {!website ? (
          <div className="max-w-2xl mx-auto">
            <WebsiteGenerator
              onWebsiteGenerated={handleWebsiteGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Page List */}
            <div className="lg:col-span-1">
              <PageList
                pages={website.pages}
                selectedPage={selectedPage}
                onPageSelect={handlePageSelect}
                onNewWebsite={() => {
                  setWebsite(null);
                  setSelectedPage(null);
                  setShowEditor(false);
                }}
              />

              {selectedPage && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowEditor(!showEditor)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {showEditor ? "View Mode" : "Edit Mode"}
                  </button>

                  <AIEditPrompt
                    websiteId={website.id}
                    pageName={selectedPage.name}
                    onPageUpdate={handlePageUpdate}
                  />
                </div>
              )}
            </div>

            {/* Main Content - Preview */}
            <div className="lg:col-span-3">
              {selectedPage && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedPage.name} Page
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedPage.description}
                    </p>
                  </div>

                  {showEditor ? (
                    <VisualEditor
                      page={selectedPage}
                      onPageUpdate={handlePageUpdate}
                    />
                  ) : (
                    <PagePreview page={selectedPage} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
