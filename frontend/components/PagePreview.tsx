import { PagePreviewProps } from "@/lib/types";
import React, { useRef, useState } from "react";

type ViewportSize = "desktop" | "tablet" | "mobile";

const PagePreview = ({ page }: PagePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  const handleReload = () => {
    setLoading(true);
    // Force reload by resetting srcDoc
    if (iframeRef.current) {
      iframeRef.current.srcdoc = page.html;
    }
  };

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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow h-[600px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <span
          className="text-sm font-medium text-gray-700 truncate"
          title={page.name}
        >
          Preview: {page.name}
        </span>
        <button
          onClick={handleReload}
          className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100"
          aria-label="Reload preview"
          disabled={loading}
        >
          Reload
        </button>
      </div>
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          srcDoc={page.html}
          className="w-full h-full border-0 rounded-b-xl"
          title={`Preview of ${page.name} page`}
          sandbox="allow-scripts allow-same-origin"
          aria-label={`Preview of ${page.name} page`}
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default PagePreview;
