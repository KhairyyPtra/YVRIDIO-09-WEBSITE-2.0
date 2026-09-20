import "./StructurePage.css";

export function StructurePage({ activePage }) {
  return (
    <div id="struktur" className={`page${activePage === "struktur" ? " active" : ""}`}>
      <section className="structure-section">
        <div className="structure-hero"><div className="structure-content">
          <span className="structure-eyebrow">✦ SUSUNAN KELAS YVRIDIO'09 ✦</span>
          <h2>Orang-orang<br /><span>di balik cerita.</span></h2>
          <p className="structure-subtitle">Bukan sekadar struktur.<br />Ini adalah orang-orang yang menjaga satu kelas tetap berjalan.</p>
          <div className="structure-divider"><span>✦</span><div /><span>✦</span></div>
          <p className="structure-description">Setiap peran punya cerita. Bersama-sama, mereka menjadi bagian dari perjalanan YVRIDIO'09.</p>
          <div className="structure-counter"><div><strong>1</strong><span>KELAS</span></div><div className="structure-counter-line" /><div><strong>9</strong><span>PERAN</span></div></div>
        </div></div>
        <div className="structure-organization"><div className="structure-heading"><div><span>✦ SUSUNAN TEMAN ✦</span><h3>Yang membuat kelas ini berjalan</h3></div></div><div className="tree-container"><div className="tree-level leadership-grid"><div className="tree-card gold"><span>Ketua kelas</span><h4>YVRIDIO'09</h4><p>Satu kelas, satu cerita.</p></div></div><div className="tree-level department-grid"><div className="tree-card"><span>Koordinator</span><h4>Teman-teman kelas</h4><p>Saling membantu setiap hari.</p></div><div className="tree-card"><span>Penggerak</span><h4>Panitia dan pengurus</h4><p>Membuat kegiatan jadi berarti.</p></div></div></div></div>
      </section>
    </div>
  );
}