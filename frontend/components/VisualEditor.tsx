"use client";

import { VisualEditorProps } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

import React from "react";

const VisualEditor = ({ page, onPageUpdate }: VisualEditorProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Add click event listener to all editable elements
      const editableElements = doc.querySelectorAll(
        "[contenteditable='true'], h1, h2, h3,h4,h5,h6 p, a, span, button, div"
      );

      editableElements.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Remove previous highlights
          doc.querySelectorAll(".visual-editor-selected").forEach((el) => {
            el.classList.remove("visual-editor-selected");
          });

          // Highlight selected element
          element.classList.add("visual-editor-selected");
          setSelectedElement(element as HTMLElement);
          setEditValue(element.textContent || "");
          setIsEditing(true);
        });

        // Add hover effect
        element.addEventListener("mouseenter", () => {
          element.classList.add("visual-editor-hover");
        });

        element.addEventListener("mouseleave", () => {
          element.classList.remove("visual-editor-hover");
        });
      });

      // add CSS for visual editor
      const style = doc.createElement("style");
      style.textContent = `
        .visual-editor-hover {
          outline: 2px dashed #3b82f6 !important;
          cursor: pointer !important;
        }
        .visual-editor-selected {
          outline: 2px solid #3b82f6 !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `;
      doc.head.appendChild(style);
    };

    // Set up iframe load event
    iframe.addEventListener("load", handleIframeLoad);
    // Clean up event listener on unmount
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [page.html]);
  const handleSaveEdit = () => {
    if (!selectedElement) return;

    selectedElement.textContent = editValue;

    // Get updated HTML
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const updatedHtml = iframe.contentDocument.documentElement.outerHTML;

    const updatedPage = {
      ...page,
      html: updatedHtml,
    };

    onPageUpdate(updatedPage);
    setIsEditing(false);
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedElement(null);
    if (selectedElement) {
      selectedElement.classList.remove("visual-editor-selected");
    }
  };

  return (
    <div className="relative">
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-700">
            <strong>Visual Editor Mode:</strong> Click on any text element to
            edit it
          </div>
          {isEditing && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-[600px] border border-gray-200 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          srcDoc={page.html}
          className="w-full h-full border-0"
          title={`Visual Editor for ${page.name} page`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <div className="absolute top-0 right-0 p-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>
    </div>
  );
};

export default VisualEditor;
