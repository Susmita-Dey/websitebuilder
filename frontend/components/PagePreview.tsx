"use client";
import { Page } from "@/lib/types";
import React, { useRef, useState, useEffect } from "react";

interface PagePreviewProps {
  page: Page;
  viewport: "desktop" | "tablet" | "mobile";
}

const PagePreview = ({ page, viewport }: PagePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  const getViewportDimensions = () => {
    switch (viewport) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      default:
        return { width: "100%", height: "600px" };
    }
  };

  const handleReload = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = page.html;
    }
  };

  useEffect(() => {
    setLoading(true);
  }, [page.html, viewport]);

  const { width, height } = getViewportDimensions();

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className="bg-white dark:bg-muted border border-border rounded-xl shadow relative overflow-hidden"
        style={{
          width,
          height,
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20 text-sm font-medium">
          <span className="truncate">Preview: {page.name}</span>
          <button
            onClick={handleReload}
            disabled={loading}
            className="text-xs px-2 py-1 rounded border bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
          >
            Reload
          </button>
        </div>

        {/* Preview Iframe */}
        <div className="relative w-full h-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-muted bg-opacity-80 z-10">
              <span className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent" />
            </div>
          )}
          <iframe
            key={viewport + page.html} // <-- force reload on viewport or html change
            ref={iframeRef}
            srcDoc={page.html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setLoading(false)}
            title={`Preview of ${page.name}`}
            aria-label={`Preview of ${page.name}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
