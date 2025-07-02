import React from "react";
import { PageListProps } from "@/lib/types";

const PageList = ({
  pages,
  selectedPage,
  onPageSelect,
  onNewWebsite,
}: PageListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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

      <div className="space-y-2">
        {pages.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            No pages yet. Click{" "}
            <span className="font-semibold text-indigo-600">New Website</span>{" "}
            to get started!
          </div>
        ) : (
          pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => onPageSelect(page)}
              className={`w-full flex items-start gap-3 text-left p-3 rounded-lg transition-colors border ${
                selectedPage?.name === page.name
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow"
                  : "text-gray-700 border-transparent hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            >
              <span className="mt-1 text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 10h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>
                <div className="font-medium">{page.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {page.description}
                </div>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {pages.length} page{pages.length !== 1 ? "s" : ""} generated
        </div>
      </div>
    </div>
  );
};

export default PageList;
