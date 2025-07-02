interface Page {
  name: string;
  slug: string;
  html: string;
  description: string;
}

interface PagePreviewProps {
  page: Page;
  viewport: "mobile" | "tablet" | "desktop";
}

interface Website {
  id: string;
  name: string;
  description?: string;
  pages: Page[];
}

interface PageListProps {
  pages: Page[];
  selectedPage: Page | null;
  onPageSelect: (page: Page) => void;
  onNewWebsite: () => void;
}

interface VisualEditorProps {
  page: Page;
  onPageUpdate: (page: Page) => void;
  viewport: "mobile" | "tablet" | "desktop";
}

interface AIEditPromptProps {
  websiteId: string;
  pageName: string;
  onPageUpdate: (page: any) => void;
}

interface WebsiteGeneratorProps {
  onWebsiteGenerated: (website: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export type {
  Page,
  PagePreviewProps,
  Website,
  PageListProps,
  VisualEditorProps,
  AIEditPromptProps,
  WebsiteGeneratorProps,
};
