interface Page {
  name: string;
  slug: string;
  html: string;
  description: string;
}

interface PagePreviewProps {
  page: Page;
}

interface Website {
  id: string;
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
}

interface AIEditPromptProps {
  websiteId: string;
  pageName: string;
  onPageUpdate: (page: any) => void;
}

export type {
  Page,
  PagePreviewProps,
  Website,
  PageListProps,
  VisualEditorProps,
  AIEditPromptProps,
};
