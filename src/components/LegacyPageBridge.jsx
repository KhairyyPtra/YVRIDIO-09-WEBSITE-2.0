import { useEffect } from "react";

export function LegacyPageBridge({ pageId, activePage }) {
  useEffect(() => {
    const pageElement = document.getElementById(pageId);
    if (!pageElement) return undefined;

    pageElement.classList.toggle("active", pageId === activePage);

    return undefined;
  }, [pageId, activePage]);

  return null;
}