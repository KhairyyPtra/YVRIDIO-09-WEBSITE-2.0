import { LegacyPageBridge } from "../components/LegacyPageBridge";
import "./HomePage.css";

export function HomePage({ activePage }) {
  return <LegacyPageBridge pageId="home" activePage={activePage} />;
}