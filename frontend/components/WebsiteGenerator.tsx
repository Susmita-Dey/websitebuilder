"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateWebsite } from "@/lib/api";
import { WebsiteGeneratorProps } from "@/lib/types";

const WebsiteGenerator = ({
  onWebsiteGenerated,
  isLoading,
  setIsLoading,
}: WebsiteGeneratorProps) => {
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return alert("Please enter a description.");
    setIsLoading(true);
    try {
      const website = await generateWebsite(description.trim());
      onWebsiteGenerated(website);
      router.push(`/project/${website.id}`);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate website. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setDescription(prompt);
    setTimeout(() => {
      (
        document.getElementById("website-gen-form") as HTMLFormElement
      )?.requestSubmit();
    }, 0);
  };

  const handleClear = () => setDescription("");

  const examplePrompts = [
    "A mindfulness coach website with Home, About, and Contact pages",
    "A modern restaurant website with menu, about, and reservations pages",
    "A portfolio website for a photographer with gallery and contact sections",
    "A small bakery business website with products and location pages",
    "A personal blog with posts, about, and contact sections",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Form Container */}
        <div className="dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 md:p-12 transition-all duration-300 hover:shadow-3xl">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Describe Your Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Share your website idea and let our AI bring it to life
            </p>
          </div>

          {/* Form */}
          <form
            id="website-gen-form"
            onSubmit={handleSubmit}
            className="space-y-8"
            aria-busy={isLoading}
          >
            <div className="space-y-3">
              <label
                htmlFor="description"
                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 text-center"
              >
                What kind of website do you need?
              </label>
              <div className="relative max-w-3xl mx-auto">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A modern coffee shop website with menu, locations, and online ordering..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                  disabled={isLoading}
                  autoFocus
                />
                {description && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="Clear"
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
              <div className="flex justify-between items-center max-w-3xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Be specific for better results</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description.length}/500 characters
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !description.trim()}
                className="relative px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="ml-3">Creating Magic...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Website
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-12 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <div className="mx-4 text-gray-500 dark:text-gray-400 font-medium">
              or try an example
            </div>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
              Get inspired with these examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(prompt)}
                  className="group relative p-6 text-left bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 group-hover:scale-110 transition-transform duration-200"></div>
                    <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {prompt}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Lightning Fast
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate complete websites in under 30 seconds
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Mobile Ready
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Responsive designs that look great on all devices
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Fully Customizable
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Edit and refine your website after generation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
