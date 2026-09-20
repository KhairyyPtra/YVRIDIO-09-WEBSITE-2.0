import { useEffect, useState } from "react";
import { PAGE_IDS } from "../config/navigation";

function getInitialPage() {
  const savedPage = window.localStorage.getItem("activePage");
  return PAGE_IDS.includes(savedPage) ? savedPage : "home";
}

export function useLegacyNavigation() {
  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    const legacyShowPage = window.showPage;
    const legacyActivatePage = window.activatePage;

    const syncPage = (pageId) => {
      if (!PAGE_IDS.includes(pageId)) return;

      setActivePage(pageId);
      document.body.dataset.reactPage = pageId;
    };

    window.showPage = (pageId) => {
      syncPage(pageId);
      legacyShowPage?.(pageId);
    };

    window.activatePage = (pageId) => {
      syncPage(pageId);
      legacyActivatePage?.(pageId);
    };

    document.body.dataset.reactPage = activePage;

    return () => {
      window.showPage = legacyShowPage;
      window.activatePage = legacyActivatePage;
      delete document.body.dataset.reactPage;
    };
  }, [activePage]);

  return { activePage };
}