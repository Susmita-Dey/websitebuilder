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
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Clean up highlights on mode exit
  useEffect(() => {
    if (!editMode && iframeRef.current?.contentDocument) {
      iframeRef.current.contentDocument
        .querySelectorAll(".visual-editor-selected, .visual-editor-hover")
        .forEach((el) =>
          el.classList.remove("visual-editor-selected", "visual-editor-hover")
        );
      setSelectedElement(null);
      setIsEditing(false);
    }
  }, [editMode, page.html]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      setLoading(false);
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Remove previous listeners/styles
      doc.querySelectorAll("[data-ve-listener]").forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
      doc.querySelectorAll("style[data-ve-style]").forEach((el) => el.remove());

      if (!editMode) return;

      // Add click/hover listeners to editable elements
      const editableElements = doc.querySelectorAll(
        "[contenteditable='true'], h1, h2, h3, h4, h5, h6, p, a, span, button, div"
      );
      editableElements.forEach((element) => {
        (element as HTMLElement).setAttribute("data-ve-listener", "true");
        element.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          doc.querySelectorAll(".visual-editor-selected").forEach((el) => {
            el.classList.remove("visual-editor-selected");
          });
          element.classList.add("visual-editor-selected");
          setSelectedElement(element as HTMLElement);
          setEditValue(element.textContent || "");
          setIsEditing(true);
        });
        element.addEventListener("mouseenter", () => {
          element.classList.add("visual-editor-hover");
        });
        element.addEventListener("mouseleave", () => {
          element.classList.remove("visual-editor-hover");
        });
      });

      // Add CSS for visual editor
      const style = doc.createElement("style");
      style.setAttribute("data-ve-style", "true");
      style.textContent = `
        .visual-editor-hover {
          outline: 2px dashed #6366f1 !important;
          cursor: pointer !important;
        }
        .visual-editor-selected {
          outline: 2px solid #6366f1 !important;
          background-color: rgba(99, 102, 241, 0.08) !important;
        }
      `;
      doc.head.appendChild(style);
    };

    setLoading(true);
    iframe.addEventListener("load", handleIframeLoad);
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [page.html, editMode]);

  const handleSaveEdit = () => {
    if (!selectedElement) return;
    selectedElement.textContent = editValue;
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    const updatedHtml = iframe.contentDocument.documentElement.outerHTML;
    onPageUpdate({ ...page, html: updatedHtml });
    setIsEditing(false);
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedElement) {
      selectedElement.classList.remove("visual-editor-selected");
    }
    setSelectedElement(null);
  };

  return (
    <div className="relative">
      <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-2 flex items-center justify-between">
        <div className="text-sm text-indigo-700 flex items-center gap-2">
          <strong>Visual Editor</strong>
          <span className="hidden sm:inline">
            | Click "Edit Mode" to enable editing
          </span>
        </div>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`px-3 py-1 rounded font-medium text-sm transition ${
            editMode
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50"
          } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={isEditing}
          aria-pressed={editMode}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      {isEditing && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
            autoFocus
            aria-label="Edit text"
          />
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="h-[600px] border border-gray-200 bg-white overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          srcDoc={page.html}
          className="w-full h-full border-0"
          title={`Visual Editor for ${page.name} page`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default VisualEditor;
