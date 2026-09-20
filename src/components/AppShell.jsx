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
  { id: "struktur", label: "Struktur", description: "Susunan kelas", Icon: Network },
  { id: "anggota", label: "Anggota", description: "Teman sekelas", Icon: Users },
  { id: "galeri", label: "Kenangan", description: "Kumpulan foto", Icon: Archive },
  { id: "favorit", label: "Favorit", description: "Yang kamu simpan", Icon: BookOpen }
];

const pageTitles = {
  home: "Beranda",
  struktur: "Susunan kelas",
  anggota: "Teman sekelas",
  galeri: "Kumpulan kenangan",
  favorit: "Favoritmu"
};

export function AppShell({ activePage, children }) {
  const [menuOpen, setMenuOpen] = useState(() =>
    typeof window !== "undefined" && window.innerWidth > 820
  );

  useEffect(() => {
    document.body.classList.add("app-shell-active");
    return () => document.body.classList.remove("app-shell-active");
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 820) {
      setMenuOpen(false);
    }
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
            <span>ARSIP KELAS</span>
          </div>
        </div>

        <div className="app-sidebar-rule" />
        <span className="app-sidebar-label">MENU UTAMA</span>

        <nav className="app-sidebar-nav" aria-label="Menu utama">
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
          <span className="app-sidebar-status"><i /> SEMUA SIAP</span>
          <p>Cerita kelasmu ada di sini.</p>
        </div>
      </aside>

      <header className="app-topbar">
        <button
          className="app-menu-trigger"
          type="button"
          aria-label={menuOpen ? "Lipat navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="app-topbar-heading">
          <span>YVRIDIO'09 / RUANG CERITA</span>
          <strong>{pageTitles[activePage] || "Beranda"}</strong>
        </div>
        <div className="app-topbar-meta">
          <span className="app-topbar-dot" />
          <span>CERITA TERBARU</span>
        </div>
      </header>

      <main className="app-shell-content">{children}</main>
    </div>
  );
}