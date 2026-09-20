import { useEffect, useState } from "react";
import {
  Archive,
  BookOpen,
  LayoutDashboard,
  Menu,
  Network,
  Users,
  X
} from "lucide-react";
import { PAGE_IDS } from "../config/navigation";
import "./AppShell.css";

const navigation = [
  { id: "home", label: "Beranda", description: "Ringkasan kelas", Icon: LayoutDashboard },
  { id: "struktur", label: "Struktur", description: "Organisasi kelas", Icon: Network },
  { id: "anggota", label: "Anggota", description: "Crew directory", Icon: Users },
  { id: "galeri", label: "Kenangan", description: "Arsip visual", Icon: Archive },
  { id: "favorit", label: "Favorit", description: "Pilihan tersimpan", Icon: BookOpen }
];

const pageTitles = {
  home: "Beranda",
  struktur: "Struktur kelas",
  anggota: "Crew directory",
  galeri: "Arsip kenangan",
  favorit: "Favorit tersimpan"
};

export function AppShell({ activePage, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("app-shell-active");
    return () => document.body.classList.remove("app-shell-active");
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  const navigate = (pageId) => {
    if (!PAGE_IDS.includes(pageId)) return;
    window.showPage?.(pageId);
    setMenuOpen(false);
  };

  return (
    <div className={`app-shell${menuOpen ? " menu-open" : ""}`}>
      <button
        className="app-shell-backdrop"
        type="button"
        aria-label="Tutup navigasi"
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`app-sidebar${menuOpen ? " is-open" : ""}`}>
        <div className="app-sidebar-brand">
          <img src="/assets/images/favicon.png" alt="" />
          <div>
            <strong>YVRIDIO'09</strong>
            <span>CLASS ARCHIVE</span>
          </div>
          <button
            className="app-sidebar-close"
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="app-sidebar-rule" />
        <span className="app-sidebar-label">WORKSPACE</span>

        <nav className="app-sidebar-nav" aria-label="Navigasi utama">
          {navigation.map(({ id, label, description, Icon }) => (
            <button
              className={`app-nav-item${activePage === id ? " is-active" : ""}`}
              type="button"
              key={id}
              aria-current={activePage === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <span className="app-nav-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <span className="app-nav-copy">
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <span className="app-sidebar-status"><i /> SYSTEM ONLINE</span>
          <p>Class archive active.</p>
        </div>
      </aside>

      <header className="app-topbar">
        <button
          className="app-menu-trigger"
          type="button"
          aria-label="Buka navigasi"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="app-topbar-heading">
          <span>YVRIDIO'09 / WORKSPACE</span>
          <strong>{pageTitles[activePage] || "Beranda"}</strong>
        </div>
        <div className="app-topbar-meta">
          <span className="app-topbar-dot" />
          <span>LIVE ARCHIVE</span>
        </div>
      </header>

      <main className="app-shell-content">{children}</main>
    </div>
  );
}