import { PageListProps } from "@/lib/types";
import React from "react";

const PageList = ({
  pages,
  selectedPage,
  onPageSelect,
  onNewWebsite,
}: PageListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pages</h3>
        <button
          onClick={onNewWebsite}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          New Website
        </button>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <button
            key={page.slug}
            onClick={() => onPageSelect(page)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedPage?.name === page.name
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="font-medium">{page.name}</div>
            <div className="text-sm text-gray-500 mt-1">{page.description}</div>
          </button>
        ))}
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
