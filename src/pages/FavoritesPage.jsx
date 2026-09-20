import { LegacyPageBridge } from "../components/LegacyPageBridge";
import "./FavoritesPage.css";

export function FavoritesPage({ activePage }) {
  return <LegacyPageBridge pageId="favorit" activePage={activePage} />;
}