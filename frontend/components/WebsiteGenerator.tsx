"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateWebsite } from "@/lib/api";
import { WebsiteGeneratorProps } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WebsiteGenerator = ({
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
      router.push(`/project/${website.website_id}`);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header Outside Card */}
      <div className="text-center max-w-2xl mb-10">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Describe Your Vision
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Share your website idea and let our AI bring it to life.
        </p>
      </div>

      {/* Card with form */}
      <Card className="w-full max-w-4xl dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl mb-6">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            What kind of website do you need?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="website-gen-form"
            onSubmit={handleSubmit}
            className="space-y-6"
            aria-busy={isLoading}
          >
            <div className="relative max-w-4xl mx-auto mb-6">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A modern coffee shop website with menu, locations, and online ordering..."
                rows={5}
                maxLength={500}
                disabled={isLoading}
                className="text-base bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none"
              />
              {description && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Clear"
                >
                  ✕
                </Button>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>Be specific for better results</span>
                </div>
                <span>{description.length}/500 characters</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading || !description.trim()}
                className="px-8 py-3 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:brightness-110 transition-all duration-300 min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="flex space-x-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                    <span>Creating Magic...</span>
                  </div>
                ) : (
                  <>
                    <span>🚀</span> Generate Website
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="flex items-center w-full max-w-4xl">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        <span className="mx-6 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
          or try an example
        </span>
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      </div>

      {/* Example Prompts */}
      <div className="space-y-8 text-center w-full max-w-5xl mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Get inspired with these examples
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {examplePrompts.map((prompt, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              onClick={() => handleExampleClick(prompt)}
              disabled={isLoading}
              className="text-left h-auto py-5 px-6 rounded-xl border-gray-300 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
