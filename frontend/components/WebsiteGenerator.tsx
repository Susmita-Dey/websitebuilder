"use client";

import { useState } from "react";
import { generateWebsite } from "@/lib/api";
import { WebsiteGeneratorProps } from "@/lib/types";

const WebsiteGenerator = ({
  onWebsiteGenerated,
  isLoading,
  setIsLoading,
}: WebsiteGeneratorProps) => {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please enter a description for your website.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateWebsite(description);
      onWebsiteGenerated(result);
    } catch (error) {
      console.error("Error generating website:", error);
      alert("Failed to generate website. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "A mindfulness coach website with 3 pages: Home, About, Contact",
    "A modern restaurant website with menu, about, and reservations pages",
    "A portfolio website for a photographer with gallery and contact sections",
    "A small business website for a bakery with home, products, and location pages",
    "A personal blog website with posts, about, and contact pages",
  ];

  const handleExampleClick = (prompt: string) => {
    setDescription(prompt);
    setTimeout(() => {
      (
        document.getElementById("website-gen-form") as HTMLFormElement
      )?.requestSubmit();
    }, 0);
  };

  const handleClear = () => setDescription("");

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Describe Your Website
        </h2>
        <p className="text-gray-600">
          Tell us what kind of website you want, and our AI will build it for
          you.
        </p>
      </div>

      <form
        id="website-gen-form"
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-busy={isLoading}
      >
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Website Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I want a website for..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none pr-10"
              disabled={isLoading}
              autoFocus
            />
            {description && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
                aria-label="Clear description"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M6 6l8 8M6 14L14 6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !description.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Your Website...
            </div>
          ) : (
            "Generate Website"
          )}
        </button>
      </form>

      <div className="my-8 border-t border-gray-200"></div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Example prompts:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(prompt)}
              className="text-left p-3 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition-colors"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
