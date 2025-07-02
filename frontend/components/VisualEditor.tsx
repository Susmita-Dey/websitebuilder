"use client";

import { VisualEditorProps } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const VisualEditor = ({ page, onPageUpdate, viewport }: VisualEditorProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editStyle, setEditStyle] = useState("");
  const [loading, setLoading] = useState(true);

  // Set up event listeners for selecting elements in edit mode
  useEffect(() => {
    if (!editMode || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    setLoading(false);

    // Remove previous listeners and highlights
    doc.querySelectorAll(".ve-selected, .ve-hover").forEach((el) => {
      el.classList.remove("ve-selected", "ve-hover");
    });

    const editable = doc.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, a, span, button, div"
    );

    editable.forEach((el) => {
      el.addEventListener("mouseenter", () => el.classList.add("ve-hover"));
      el.addEventListener("mouseleave", () => el.classList.remove("ve-hover"));
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        doc
          .querySelectorAll(".ve-selected")
          .forEach((el) => el.classList.remove("ve-selected"));
        el.classList.add("ve-selected");
        setSelected(el as HTMLElement);
        setEditValue((el as HTMLElement).textContent || "");
        setEditStyle((el as HTMLElement).getAttribute("style") || "");
      });
    });

    // Add highlight styles
    const style = doc.createElement("style");
    style.textContent = `
      .ve-hover { outline: 2px dashed #6366f1 !important; cursor: pointer !important; }
      .ve-selected { outline: 2px solid #6366f1 !important; background: rgba(99,102,241,0.08) !important; }
    `;
    style.setAttribute("data-ve-style", "true");
    doc.head.appendChild(style);

    return () => {
      // Clean up listeners and styles
      editable.forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
      doc.querySelectorAll("style[data-ve-style]").forEach((el) => el.remove());
    };
  }, [editMode, page.html]);

  // Remove selection on exit edit mode or page change
  useEffect(() => {
    if (!editMode) setSelected(null);
  }, [editMode, page.html]);

  const handleSave = () => {
    if (!selected || !iframeRef.current?.contentDocument) return;
    selected.textContent = editValue;
    selected.setAttribute("style", editStyle);
    const updatedHtml =
      iframeRef.current.contentDocument.documentElement.outerHTML;
    onPageUpdate({ ...page, html: updatedHtml });
    setSelected(null);
  };

  const getViewportDimensions = () => {
    switch (viewport) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      default:
        return { width: "100%", height: "600px" };
    }
  };
  const { width, height } = getViewportDimensions();

  return (
    <Card className="relative overflow-hidden" style={{ width, height }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted text-sm font-medium">
        <div>
          <span className="font-semibold">Visual Editor</span>
          <span className="ml-2 text-xs text-muted-foreground">
            {editMode
              ? "Click an element to edit"
              : "Enable edit mode to begin"}
          </span>
        </div>
        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>

      {/* Edit Panel */}
      {editMode && selected && (
        <Card className="absolute z-20 top-5 left-1/2 -translate-x-1/2 border border-border rounded-lg shadow-md px-4 py-3 flex flex-col sm:flex-row gap-2 items-center w-[90%] max-w-xl">
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full sm:w-auto text-sm"
            aria-label="Edit text"
          />
          <Input
            type="text"
            value={editStyle}
            onChange={(e) => setEditStyle(e.target.value)}
            className="w-full sm:w-auto text-sm"
            aria-label="Edit style"
            placeholder="CSS style (e.g. color: red; font-size: 2rem;)"
          />
          <Button size="sm" variant="default" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
            Cancel
          </Button>
        </Card>
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
          onLoad={() => setLoading(false)}
        />
      </div>
    </Card>
  );
};

export default VisualEditor;
