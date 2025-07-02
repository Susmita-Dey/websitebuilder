import { PagePreviewProps } from "@/lib/types";
import React from "react";

const PagePreview = ({ page }: PagePreviewProps) => {
  return (
    <div className="h-[600px] border border-gray-200 bg-white overflow-hidden">
      <iframe
        srcDoc={page.html}
        className="w-full h-full border-0"
        title={`Preview of ${page.name} page`}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default PagePreview;
