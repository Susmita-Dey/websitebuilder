"use client";

import { editWebsite } from "@/lib/api";
import { AIEditPromptProps } from "@/lib/types";
import React, { useState } from "react";

const AIEditPrompt = ({
  websiteId,
  pageName,
  onPageUpdate,
}: AIEditPromptProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a prompt to edit the page.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await editWebsite(websiteId, pageName, prompt);
      onPageUpdate(result.updated_page);
      setPrompt("");
    } catch (error) {
      console.error("Error editing page:", error);
      alert("Failed to edit the page. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "Make the background white and center all text",
    "Change the color scheme to dark mode",
    "Add a hero section with a call-to-action button",
    "Make the text larger and more readable",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">AI Edit</h4>

      <form onSubmit={handlePromptSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to change..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Applying Changes...
            </div>
          ) : (
            "Apply Changes"
          )}
        </button>
      </form>

      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Examples:</p>
        <div className="space-y-1">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="block w-full text-left px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIEditPrompt;
