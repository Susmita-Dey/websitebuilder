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

  // Clean up on edit mode toggle or page change
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
      if (!doc || !editMode) return;

      // Remove stale listeners/styles
      doc
        .querySelectorAll("[data-ve-listener]")
        .forEach((el) => el.replaceWith(el.cloneNode(true)));
      doc.querySelectorAll("style[data-ve-style]").forEach((el) => el.remove());

      // Add listeners
      const editableElements = doc.querySelectorAll(
        "[contenteditable='true'], h1, h2, h3, h4, h5, h6, p, a, span, button, div"
      );

      editableElements.forEach((element) => {
        const el = element as HTMLElement;
        el.setAttribute("data-ve-listener", "true");

        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          doc.querySelectorAll(".visual-editor-selected").forEach((el) => {
            el.classList.remove("visual-editor-selected");
          });

          el.classList.add("visual-editor-selected");
          setSelectedElement(el);
          setEditValue(el.textContent || "");
          setIsEditing(true);
        });

        el.addEventListener("mouseenter", () =>
          el.classList.add("visual-editor-hover")
        );
        el.addEventListener("mouseleave", () =>
          el.classList.remove("visual-editor-hover")
        );
      });

      // Style overlays
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
    return () => iframe.removeEventListener("load", handleIframeLoad);
  }, [page.html, editMode]);

  const handleSaveEdit = () => {
    if (!selectedElement || !iframeRef.current?.contentDocument) return;

    selectedElement.textContent = editValue;
    const updatedHtml =
      iframeRef.current.contentDocument.documentElement.outerHTML;

    onPageUpdate({ ...page, html: updatedHtml });

    setIsEditing(false);
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    selectedElement?.classList.remove("visual-editor-selected");
    setSelectedElement(null);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted text-sm font-medium">
        <div className="text-muted-foreground">
          <strong className="text-foreground">Visual Editor</strong>{" "}
          <span className="hidden sm:inline">
            | Click &quot;Edit Mode&quot; to begin editing
          </span>
        </div>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`px-3 py-1 rounded font-medium transition text-sm ${
            editMode
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-white dark:bg-background text-indigo-700 border border-indigo-300 hover:bg-muted"
          } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={isEditing}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      {/* Inline Edit Panel */}
      {isEditing && (
        <div className="absolute z-20 top-5 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg shadow-md px-4 py-3 flex flex-col sm:flex-row gap-2 items-center animate-fade-in">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="px-3 py-1 border border-border rounded w-full sm:w-auto text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Edit text"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-muted text-muted-foreground border border-border rounded text-sm hover:bg-muted/60 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
            <span className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          srcDoc={page.html}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
          title={`Visual Editor - ${page.name}`}
        />
      </div>
    </div>
  );
};

export default VisualEditor;
