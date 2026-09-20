import { LegacyPageBridge } from "../components/LegacyPageBridge";
import "./MembersPage.css";

export function MembersPage({ activePage }) {
  return <LegacyPageBridge pageId="anggota" activePage={activePage} />;
}