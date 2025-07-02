import React from "react";
import { PageListProps } from "@/lib/types";

const PageList = ({
  pages,
  selectedPage,
  onPageSelect,
  onNewWebsite,
}: PageListProps) => {
  return (
    <div className="bg-background border border-border rounded-xl shadow p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <span className="inline-block w-5 h-5 text-indigo-500">
            <svg fill="none" viewBox="0 0 20 20" className="w-5 h-5">
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
          </span>
          Pages
        </h3>

        <button
          onClick={onNewWebsite}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <path
              d="M10 5v10M5 10h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New Website
        </button>
      </div>

      {/* Page List */}
      {pages.length === 0 ? (
        <div className="text-muted-foreground text-sm text-center py-8">
          No pages yet. Click{" "}
          <span className="font-semibold text-indigo-600">New Website</span> to
          get started!
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => onPageSelect(page)}
              className={`w-full text-left p-3 rounded-lg border transition text-sm space-y-1
                ${
                  selectedPage?.name === page.name
                    ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow"
                    : "border-border text-foreground hover:bg-muted/40"
                }`}
            >
              <div className="font-medium">{page.name}</div>
              <div className="text-muted-foreground text-xs">
                {page.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-border text-sm text-muted-foreground">
        {pages.length} page{pages.length !== 1 && "s"} generated
      </div>
    </div>
  );
};

export default PageList;
