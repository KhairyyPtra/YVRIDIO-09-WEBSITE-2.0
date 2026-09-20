import { LegacyPageBridge } from "../components/LegacyPageBridge";
import "./StructurePage.css";

export function StructurePage({ activePage }) {
  return <LegacyPageBridge pageId="struktur" activePage={activePage} />;
}