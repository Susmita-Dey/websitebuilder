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
    if (isLoading) return;
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      alert("Please enter a prompt to edit the page.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await editWebsite(websiteId, pageName, trimmedPrompt);
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

  const handleExampleClick = async (example: string) => {
    setPrompt(example);
    // Optionally auto-submit on click:
    setTimeout(() => {
      if (!isLoading) {
        // Simulate form submission for accessibility
        (document.getElementById("ai-edit-form") as HTMLFormElement)?.requestSubmit();
      }
    }, 0);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-4">
      <h4 className="text-base font-semibold text-gray-900 mb-1">AI Edit Page</h4>
      <p className="text-sm text-gray-600 mb-4">
        Describe how you want to change this page. The AI will update the content for you.
      </p>
      <form
        id="ai-edit-form"
        onSubmit={handlePromptSubmit}
        className="space-y-4"
        aria-busy={isLoading}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to change..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Applying Changes...
            </span>
          ) : (
            "Apply Changes"
          )}
        </button>
      </form>
      <div className="mt-5">
        <p className="text-xs text-gray-500 mb-2">Example prompts:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="block w-full text-left px-3 py-2 text-xs text-gray-700 bg-gray-100 rounded-md border border-gray-200 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
              disabled={isLoading}
              tabIndex={0}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIEditPrompt;