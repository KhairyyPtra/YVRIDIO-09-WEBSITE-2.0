import { LegacyPageBridge } from "../components/LegacyPageBridge";
import "./MemoriesPage.css";

export function MemoriesPage({ activePage }) {
  return <LegacyPageBridge pageId="galeri" activePage={activePage} />;
}