"use client";

import AIEditPrompt from "@/components/AIEditPrompt";
import PageList from "@/components/PageList";
import PagePreview from "@/components/PagePreview";
import VisualEditor from "@/components/VisualEditor";
import { Page, Website } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

type Viewport = "desktop" | "tablet" | "mobile";

const ProjectPage = () => {
  const [website, setWebsite] = useState<Website | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("desktop");

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
      pages: website.pages.map((p) =>
        p.name === updatedPage.name ? updatedPage : p
      ),
    };
    setWebsite(updatedWebsite);
    setSelectedPage(updatedPage);
  };

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <PageList
            pages={website?.pages ?? []}
            selectedPage={selectedPage}
            onPageSelect={handlePageSelect}
            onNewWebsite={() => {
              setWebsite(null);
              setSelectedPage(null);
              setShowEditor(false);
            }}
          />
          {selectedPage && (
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => setShowEditor((v) => !v)}
                variant={showEditor ? "default" : "outline"}
                className="w-full"
              >
                {showEditor ? "View Mode" : "Edit Mode"}
              </Button>
              <AIEditPrompt
                websiteId={website?.id ?? ""}
                pageName={selectedPage.name}
                onPageUpdate={handlePageUpdate}
              />
            </div>
          )}
        </aside>

        {/* Main Preview */}
        <main className="lg:col-span-3 space-y-6">
          {selectedPage && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-muted px-4 py-3 rounded-lg border">
                <div>
                  <h2 className="text-lg font-bold">{selectedPage.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {selectedPage.description}
                  </p>
                </div>

                <ToggleGroup
                  type="single"
                  value={viewport}
                  onValueChange={(val) =>
                    setViewport((val as Viewport) || "desktop")
                  }
                  className="mt-3 sm:mt-0"
                >
                  <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
                  <ToggleGroupItem value="tablet">Tablet</ToggleGroupItem>
                  <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div>
                {showEditor ? (
                  <VisualEditor
                    page={selectedPage}
                    onPageUpdate={handlePageUpdate}
                    viewport={viewport}
                  />
                ) : (
                  <PagePreview page={selectedPage} viewport={viewport} />
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectPage;
