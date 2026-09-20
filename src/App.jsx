import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { MembersPage } from "./pages/MembersPage";
import { MemoriesPage } from "./pages/MemoriesPage";
import { StructurePage } from "./pages/StructurePage";
import { useLegacyNavigation } from "./hooks/useLegacyNavigation";
import { IconLayer } from "./components/IconLayer";
import { AppShell } from "./components/AppShell";

export function App() {
  const { activePage } = useLegacyNavigation();

  return (
    <AppShell activePage={activePage}>
      <div id="react-page-orchestrator" data-active-page={activePage}>
        <IconLayer />
        <HomePage activePage={activePage} />
        <StructurePage activePage={activePage} />
        <MembersPage activePage={activePage} />
        <MemoriesPage activePage={activePage} />
        <FavoritesPage activePage={activePage} />
      </div>
    </AppShell>
  );
}