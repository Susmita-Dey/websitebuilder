"use client";

import { editWebsite } from "@/lib/api";
import { AIEditPromptProps } from "@/lib/types";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
        (
          document.getElementById("ai-edit-form") as HTMLFormElement
        )?.requestSubmit();
      }
    }, 0);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">AI Edit Page</CardTitle>
        <CardDescription>
          Describe how you want to change this page. The AI will update the
          content for you.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="ai-edit-form"
          onSubmit={handlePromptSubmit}
          aria-busy={isLoading}
          className="space-y-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="ai-prompt">Edit Instructions</Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to change..."
              rows={3}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Applying Changes...
              </span>
            ) : (
              "Apply Changes"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-2">Example prompts:</p>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                className="justify-start text-left text-xs h-auto py-2 px-3"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEditPrompt;
