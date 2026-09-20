import "./HomePage.css";

export function HomePage({ activePage }) {
  return (
    <div id="home" className={`page${activePage === "home" ? " active" : ""}`}>
      <section className="home-section">
        <div className="home-hero">
          <div className="home-content">
            <span className="home-eyebrow">YVRIDIO'09 / RUANG KELAS</span>
            <h2>Satu kelas,<br /><span>satu cerita.</span></h2>
            <p className="home-subtitle">Pusat ringkasan untuk teman sekelas, kumpulan kenangan, dan perjalanan YVRIDIO'09.</p>
            <div className="home-divider"><span>✦</span><div /><span>✦</span></div>
            <div className="home-quote">
              <h3 id="quote-title">Catatan hari ini</h3>
              <p id="random-quote">Kita pernah satu orbit.</p>
              <span className="quote-source">- YVRIDIO'09</span>
            </div>
            <div className="home-countdown">
              <div className="countdown-label"><span>✦</span> AGENDA BERIKUTNYA <span>✦</span></div>
              <h3>HARI KELULUSAN</h3>
              <div className="countdown-time"><span id="timer">Menghitung...</span></div>
              <p>Waktu berjalan, cerita tetap tersimpan.</p>
            </div>
            <div className="home-actions">
              <button className="home-btn primary" type="button" onClick={() => window.showPage?.("galeri")}>🌌 Buka Kumpulan Kenangan</button>
              <button className="home-btn secondary" type="button" onClick={() => window.showPage?.("anggota")}>👨🏻‍🎓 Lihat Teman Sekelas</button>
            </div>
          </div>
          <aside className="home-dashboard-panel" aria-label="Ringkasan kelas">
            <div className="dashboard-panel-header"><span className="dashboard-kicker">KABAR KELAS</span><span className="dashboard-status"><i /> SIAP</span></div>
            <div className="dashboard-panel-line" />
            <div className="dashboard-status-list">
              <div className="dashboard-status-item"><span className="dashboard-status-index">01</span><div><strong>Kumpulan kenangan</strong><span>Foto-foto siap dijelajahi</span></div><b>Bisa dibuka</b></div>
              <div className="dashboard-status-item"><span className="dashboard-status-index">02</span><div><strong>Teman sekelas</strong><span>34 orang di kelas ini</span></div><b>34</b></div>
              <div className="dashboard-status-item"><span className="dashboard-status-index">03</span><div><strong>Cerita bersama</strong><span>Satu perjalanan, banyak cerita</span></div><b>Berjalan</b></div>
            </div>
            <div className="dashboard-panel-footer"><span>TERAKHIR DIPERBARUI</span><strong>YVRIDIO'09 / SIAP</strong></div>
          </aside>
        </div>
        <div className="home-info">
          <div className="home-info-card"><span className="home-info-icon">👨🏻‍🎓</span><div><strong>34</strong><span>ORANG</span></div></div>
          <div className="home-info-card"><span className="home-info-icon">📸</span><div><strong>287</strong><span>KENANGAN</span></div></div>
          <div className="home-info-card"><span className="home-info-icon">🚀</span><div><strong>1</strong><span>SATU KELAS</span></div></div>
        </div>
      </section>
    </div>
  );
}