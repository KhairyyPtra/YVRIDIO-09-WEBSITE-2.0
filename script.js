// ======================================================
// YVRIDIO'09 — MAIN JAVASCRIPT
// ======================================================


// ======================================================
// 1. NAVIGASI HALAMAN
// ======================================================

function showPage(pageId) {

  // Tutup modal anggota jika masih terbuka
  if (typeof closeMemberDetail === "function") {
    closeMemberDetail();
  }

  closeMenu();

  // Transisi khusus ke tab Kenangan
  if (pageId === "galeri") {
    playKenanganWarp(() => {
      activatePage("galeri");
    });
    return;
  }

  activatePage(pageId);
}


function activatePage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const targetPage =
    document.getElementById(pageId);

  if (targetPage) {

    targetPage.classList.add("active");

    localStorage.setItem(
      "activePage",
      pageId
    );
  }

  // Setiap masuk Kenangan: acak ulang urutan foto
  if (pageId === "galeri" && typeof shuffleMemories === "function") {
    shuffleMemories();
  }

  if (pageId === "favorit" && typeof renderFavoritesPage === "function") {
    renderFavoritesPage();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ======================================================
// KENANGAN WARP — MENEMBUS RUANG & WAKTU
// ======================================================

let kenanganWarpRunning = false;

function playKenanganWarp(onComplete) {

  const warp =
    document.getElementById("kenangan-warp");

  const bar =
    document.getElementById("warpProgressBar");

  const status =
    document.getElementById("warpStatus");

  if (!warp) {
    if (typeof onComplete === "function") {
      onComplete();
    }
    return;
  }

  // Jika sedang berjalan, jangan double-trigger
  if (kenanganWarpRunning) {
    return;
  }

  kenanganWarpRunning = true;

  const messages = [
    "MEMBUKA PORTAL...",
    "MELINTASI ORBIT...",
    "MENEMBUS RUANG & WAKTU...",
    "MENYUSURI JEJAK KENANGAN...",
    "HAMPIR TIBA..."
  ];

  if (bar) {
    bar.style.width = "0%";
  }

  if (status) {
    status.textContent = messages[0];
  }

  warp.classList.remove("leaving");
  warp.classList.add("active");
  warp.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  const duration = 5000;
  const start = performance.now();
  let lastMsgIndex = 0;

  function tick(now) {

    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for more dramatic feel near the end
    const eased =
      1 - Math.pow(1 - progress, 3);

    if (bar) {
      bar.style.width = (eased * 100).toFixed(1) + "%";
    }

    const msgIndex =
      Math.min(
        Math.floor(progress * messages.length),
        messages.length - 1
      );

    if (status && msgIndex !== lastMsgIndex) {
      lastMsgIndex = msgIndex;
      status.textContent = messages[msgIndex];
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    // Selesai — aktifkan halaman, lalu fade out warp
    if (typeof onComplete === "function") {
      onComplete();
    }

    warp.classList.add("leaving");
    warp.classList.remove("active");
    warp.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    setTimeout(() => {
      warp.classList.remove("leaving");
      if (bar) {
        bar.style.width = "0%";
      }
      kenanganWarpRunning = false;
    }, 500);
  }

  requestAnimationFrame(tick);
}


// ======================================================
// RESTORE HALAMAN TERAKHIR SAAT REFRESH
// ======================================================

function restoreActivePage() {

  const savedPage =
    localStorage.getItem("activePage");

  if (savedPage) {

    const savedElement =
      document.getElementById(savedPage);

    if (savedElement) {

      // Langsung aktifkan tanpa warp saat refresh
      activatePage(savedPage);

      return;
    }
  }

  activatePage("home");
}


// ======================================================
// 2. SIDE MENU
// ======================================================

let menuScrollY = 0;

function lockBodyScroll() {
  menuScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add("menu-open");
  document.body.style.top = `-${menuScrollY}px`;
}

function unlockBodyScroll() {
  document.body.classList.remove("menu-open");
  document.body.style.top = "";
  window.scrollTo(0, menuScrollY);
}

function toggleMenu() {

  const sideMenu =
    document.getElementById("sideMenu");

  const overlay =
    document.getElementById("menuOverlay");

  if (!sideMenu || !overlay) {
    return;
  }

  const willOpen =
    !sideMenu.classList.contains("active");

  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");

  if (willOpen) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
}


function closeMenu() {

  const sideMenu =
    document.getElementById("sideMenu");

  const overlay =
    document.getElementById("menuOverlay");

  if (sideMenu) {
    sideMenu.classList.remove("active");
  }

  if (overlay) {
    overlay.classList.remove("active");
  }

  if (document.body.classList.contains("menu-open")) {
    unlockBodyScroll();
  }
}


// ======================================================
// 3. ESC
// ======================================================

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeMenu();

      const modal =
        document.getElementById("modal");

      if (
        modal &&
        modal.classList.contains("active")
      ) {

        closeModal();
      }

      const memberModal =
        document.getElementById(
          "memberDetailModal"
        );

      if (memberModal) {

        closeMemberDetail();
      }
    }
  }
);


// ======================================================
// 4. RANDOM QUOTES
// ======================================================

const quotes = [

  "Kita pernah satu orbit.",

  "Bukan berpisah, hanya pindah galaksi.",

  "Kenangan kita mengambang di antara bintang.",

  "Sekelas hari ini, legenda selamanya.",

  "Dari ruang kelas ke ruang kenangan, kita tetap satu.",

  "Dulu satu kelas, sekarang satu kenangan.",

  "Orbit boleh berubah, cerita tetap sama.",

  "Suatu hari nanti, kita akan merindukan semua ini.",

  "Dari ruang kelas sampai ke ruang angkasa!.",

  "Kita pernah berada di tempat yang sama, pada waktu yang sama.",

  "Jarak boleh memisahkan, kenangan tidak."

];


function randomQuote() {

  const quoteTitle =
    document.getElementById(
      "quote-title"
    );

  const quoteEl =
    document.getElementById(
      "random-quote"
    );

  if (
    !quoteEl ||
    quotes.length === 0
  ) {

    return;
  }

  if (quoteTitle) {

    quoteTitle.innerText =
      "Quotes of the Day";
  }

  const randomIndex =
    Math.floor(
      Math.random() *
      quotes.length
    );

  quoteEl.innerText =
    quotes[randomIndex];
}


// ======================================================
// 5. PHOTO VIEWER
// ======================================================

let currentPhotoIndex = 0;

// Sumber galeri modal: "memory" (Kenangan) atau "favorit"
let modalGallerySource = "memory";


// ======================================================
// AMBIL SELURUH FOTO KENANGAN
// ======================================================

function getMemoryImages() {

  const gallery =
    document.getElementById(
      "memoryGallery"
    );

  if (!gallery) {
    return [];
  }

  return Array.from(
    gallery.querySelectorAll(
      ".memory-card img"
    )
  );
}


// ======================================================
// AMBIL FOTO SESUAI SUMBER MODAL (Kenangan / Favorit)
// ======================================================

function getModalImages() {

  if (modalGallerySource === "favorit") {

    const gallery =
      document.getElementById(
        "favoritGallery"
      );

    if (!gallery) {
      return [];
    }

    return Array.from(
      gallery.querySelectorAll(
        ".memory-card img"
      )
    );
  }

  return getMemoryImages();
}


function normalizeImageSrc(src) {

  try {
    const u = new URL(src, window.location.href);
    return u.pathname + u.search;
  } catch (e) {
    return String(src || "");
  }
}


// ======================================================
// BUKA MODAL FOTO
// source: "memory" | "favorit" (default: memory)
// ======================================================

function openModal(src, source) {

  modalGallerySource =
    source === "favorit"
      ? "favorit"
      : "memory";

  const images =
    getModalImages();

  if (images.length === 0) {
    return;
  }

  const targetKey =
    normalizeImageSrc(src);

  const clickedIndex =
    images.findIndex(
      image =>
        normalizeImageSrc(
          image.currentSrc || image.src
        ) === targetKey
    );

  if (clickedIndex >= 0) {

    currentPhotoIndex =
      clickedIndex;

  } else {

    currentPhotoIndex = 0;
  }

  updateModalPhoto();

  const modal =
    document.getElementById(
      "modal"
    );

  if (!modal) {
    return;
  }

  modal.classList.add(
    "active"
  );

  document.body.style.overflow =
    "hidden";
}


// ======================================================
// UPDATE FOTO MODAL
// ======================================================

function updateModalPhoto() {

  const images =
    getModalImages();

  const modalImg =
    document.getElementById(
      "modal-img"
    );

  const counter =
    document.getElementById(
      "modal-counter"
    );

  if (
    images.length === 0 ||
    !modalImg
  ) {

    return;
  }

  if (currentPhotoIndex < 0) {

    currentPhotoIndex =
      images.length - 1;
  }

  if (
    currentPhotoIndex >=
    images.length
  ) {

    currentPhotoIndex = 0;
  }

  const selectedImage =
    images[currentPhotoIndex];

  modalImg.src =
    selectedImage.src;

  modalImg.alt =
    selectedImage.alt ||
    "Kenangan YVRIDIO'09";

  if (counter) {

    counter.innerText =
      `${currentPhotoIndex + 1} / ${images.length}`;
  }

  if (typeof syncModalFavoriteButton === "function") {
    syncModalFavoriteButton();
  }
}


// ======================================================
// FOTO SEBELUMNYA
// ======================================================

function previousPhoto() {

  const images =
    getModalImages();

  if (images.length === 0) {
    return;
  }

  currentPhotoIndex--;

  if (currentPhotoIndex < 0) {

    currentPhotoIndex =
      images.length - 1;
  }

  updateModalPhoto();
}


// ======================================================
// FOTO BERIKUTNYA
// ======================================================

function nextPhoto() {

  const images =
    getModalImages();

  if (images.length === 0) {
    return;
  }

  currentPhotoIndex++;

  if (
    currentPhotoIndex >=
    images.length
  ) {

    currentPhotoIndex = 0;
  }

  updateModalPhoto();
}


// ======================================================
// TUTUP MODAL FOTO
// ======================================================

function closeModal() {

  const modal =
    document.getElementById(
      "modal"
    );

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "active"
  );

  document.body.style.overflow =
    "";
}


// ======================================================
// 6. KLIK FOTO GALERI
// ======================================================

document.addEventListener(
  "click",
  function(event) {

    const image =
      event.target.closest(
        "#memoryGallery .memory-card img"
      );

    if (image) {

      openModal(
        image.src,
        "memory"
      );
    }
  }
);


// ======================================================
// 7. KLIK AREA LUAR FOTO
// ======================================================

document.addEventListener(
  "click",
  function(event) {

    const modal =
      document.getElementById(
        "modal"
      );

    if (!modal) {
      return;
    }

    if (
      event.target === modal
    ) {

      closeModal();
    }
  }
);


// ======================================================
// 8. KEYBOARD PHOTO NAVIGATION
// ======================================================

document.addEventListener(
  "keydown",
  function(event) {

    const modal =
      document.getElementById(
        "modal"
      );

    if (
      !modal ||
      !modal.classList.contains(
        "active"
      )
    ) {

      return;
    }

    if (
      event.key ===
      "ArrowLeft"
    ) {

      event.preventDefault();

      previousPhoto();
    }

    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();

      nextPhoto();
    }
  }
);


// ======================================================
// 9. SWIPE FOTO UNTUK HP
// ======================================================

let touchStartX = 0;
let touchEndX = 0;

const photoModal =
  document.getElementById(
    "modal"
  );

if (photoModal) {

  photoModal.addEventListener(
    "touchstart",
    function(event) {

      touchStartX =
        event.changedTouches[0]
          .screenX;
    },
    {
      passive: true
    }
  );

  photoModal.addEventListener(
    "touchend",
    function(event) {

      touchEndX =
        event.changedTouches[0]
          .screenX;

      handleSwipe();
    },
    {
      passive: true
    }
  );
}


function handleSwipe() {

  const swipeDistance =
    touchEndX -
    touchStartX;

  if (
    Math.abs(
      swipeDistance
    ) < 50
  ) {

    return;
  }

  if (
    swipeDistance < 0
  ) {

    nextPhoto();

  } else {

    previousPhoto();
  }
}


// ======================================================
// 10. MUSIC PLAYER
// ======================================================


// ======================================================
// PLAYLIST
// ======================================================

const playlist = [

  {
    title: "Tujuh Belas",
    artist: "Tulus",
    src:
      "assets/music/Tujuh Belas - Tulus _ Lirik Lagu [pk4mW_C2H50].mp3"
  },

  {
    title: "Ingatlah Hari Ini",
    artist: "Project Pop",
    src:
      "assets/music/Project Pop - Ingatlah Hari Ini Lirik Lagu Indonesia.mp3"
  },

  {
    title: "Ini Abadi",
    artist: "Perunggu",
    src:
      "assets/music/Ini Abadi - Perunggu Lirik Lagu.mp3"
  },

  {
    title: "Terbuang Dalam Waktu",
    artist: "Barasuara",
    src:
      "assets/music/Barasuara - Terbuang dalam Waktu Lirik Lagu.mp3"
  },

  {
    title: "About You",
    artist: "The 1975",
    src:
      "assets/music/The 1975 - About You.mp3"
  },

  {
    title: "Teman Sejati",
    artist: "HIVI",
    src:
      "assets/music/HIVI - Teman Sejati (Official Lyric Video).mp3"
  },

  {
    title: "everything u are",
    artist: "Hindia",
    src:
      "assets/music/Hindia - everything u are Lirik Lagu.mp3"
  },

  {
    title: "Dan",
    artist: "Sheila On 7",
    src:
      "assets/music/Sheila On 7 - Dan... Lirik Lagu.mp3"
  },

  {
    title: "Forever Young",
    artist: "Alphaville",
    src:
      "assets/music/Alphaville - Forever Young (Lyrics).mp3"
  },

  {
    title: "33x",
    artist: "Perunggu",
    src:
      "assets/music/Perunggu - 33x (Lyrics).mp3"
  },

  {
    title: "Fix You",
    artist: "Coldplay",
    src:
      "assets/music/Coldplay - Fix You (Lyrics).mp3"
  },
  // ==================================================
  // TAMBAHKAN LAGU BERIKUTNYA DI SINI
  // ==================================================

  /*
  {
    title: "Lagu Kedua",
    artist: "Nama Artis",
    src: "assets/music/lagu-kedua.mp3"
  },

  {
    title: "Lagu Ketiga",
    artist: "Nama Artis",
    src: "assets/music/lagu-ketiga.mp3"
  }
  */
];


const music =
  document.getElementById(
    "bg-music"
  );

const musicPanel =
  document.getElementById(
    "musicPanel"
  );

const musicDisc =
  document.getElementById(
    "musicDisc"
  );

const musicTitle =
  document.getElementById(
    "musicTitle"
  );

const musicArtist =
  document.getElementById(
    "musicArtist"
  );

const musicPlayButton =
  document.getElementById(
    "musicPlayButton"
  );

const musicProgress =
  document.getElementById(
    "musicProgress"
  );

const musicCurrentTime =
  document.getElementById(
    "musicCurrentTime"
  );

const musicDuration =
  document.getElementById(
    "musicDuration"
  );

const musicVolume =
  document.getElementById(
    "musicVolume"
  );

const musicPlaylist =
  document.getElementById(
    "musicPlaylist"
  );

const playlistCount =
  document.getElementById(
    "playlistCount"
  );

/* Mini player elements */
const miniPlayer =
  document.getElementById(
    "miniPlayer"
  );

const miniDisc =
  document.getElementById(
    "miniDisc"
  );

const miniTitle =
  document.getElementById(
    "miniTitle"
  );

const miniArtist =
  document.getElementById(
    "miniArtist"
  );

const miniPlayButton =
  document.getElementById(
    "miniPlayButton"
  );

const miniProgress =
  document.getElementById(
    "miniProgress"
  );


let currentSongIndex = 0;
let playing = false;


// ======================================================
// FORMAT WAKTU
// ======================================================

function formatMusicTime(seconds) {

  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {

    return "0:00";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  const remainingSeconds =
    Math.floor(
      seconds % 60
    );

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}


// ======================================================
// LOAD LAGU
// ======================================================

function loadSong(
  index,
  autoplay = false
) {

  if (
    !music ||
    playlist.length === 0
  ) {

    return;
  }

  if (index < 0) {

    index =
      playlist.length - 1;
  }

  if (
    index >=
    playlist.length
  ) {

    index = 0;
  }

  currentSongIndex =
    index;

  const song =
    playlist[
      currentSongIndex
    ];

  music.src =
    song.src;

  music.load();

  if (musicTitle) {

    musicTitle.innerText =
      song.title;
  }

  if (musicArtist) {

    musicArtist.innerText =
      song.artist;
  }

  /* Sync mini player */
  if (miniTitle) {
    miniTitle.innerText = song.title;
  }

  if (miniArtist) {
    miniArtist.innerText = song.artist;
  }

  if (miniPlayer) {
    miniPlayer.classList.add("active");
  }

  if (musicProgress) {

    musicProgress.value =
      0;
  }

  if (miniProgress) {
    miniProgress.value = 0;
  }

  if (musicCurrentTime) {

    musicCurrentTime.innerText =
      "0:00";
  }

  if (musicDuration) {

    musicDuration.innerText =
      "0:00";
  }

  renderPlaylist();

  if (autoplay) {

    playMusic();
  }
}


// ======================================================
// RENDER PLAYLIST
// ======================================================

function renderPlaylist() {

  if (!musicPlaylist) {
    return;
  }

  musicPlaylist.innerHTML =
    "";

  if (playlistCount) {

    playlistCount.innerText =
      `${playlist.length} SONG${
        playlist.length === 1
          ? ""
          : "S"
      }`;
  }

  playlist.forEach(
    (song, index) => {

      const item =
        document.createElement(
          "button"
        );

      item.className =
        "playlist-item";

      if (
        index ===
        currentSongIndex
      ) {

        item.classList.add(
          "active"
        );
      }

      item.innerHTML = `
        <span class="playlist-number">
          ${index + 1}
        </span>

        <div class="playlist-song">
          <strong>
            ${escapeMusicHTML(
              song.title
            )}
          </strong>

          <span>
            ${escapeMusicHTML(
              song.artist
            )}
          </span>
        </div>
      `;

      item.addEventListener(
        "click",
        () => {

          loadSong(
            index,
            true
          );
        }
      );

      musicPlaylist.appendChild(
        item
      );
    }
  );
}


// ======================================================
// AMANKAN TEXT PLAYLIST
// ======================================================

function escapeMusicHTML(text) {

  return String(text)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}


// ======================================================
// PLAY MUSIC
// ======================================================

function playMusic() {

  if (
    !music ||
    playlist.length === 0
  ) {

    return;
  }

  music.volume =
    parseFloat(
      musicVolume?.value ||
      0.4
    );

  music.play()

    .then(() => {

      playing = true;

      updateMusicUI();
    })

    .catch(error => {

      console.log(
        "Browser memblokir pemutaran musik:",
        error
      );

      playing = false;

      updateMusicUI();
    });
}


// ======================================================
// PAUSE MUSIC
// ======================================================

function pauseMusic() {

  if (!music) {
    return;
  }

  music.pause();

  playing = false;

  updateMusicUI();
}


// ======================================================
// TOGGLE PLAY / PAUSE
// ======================================================

function toggleMusic() {

  if (!music) {
    return;
  }

  if (music.paused) {

    playMusic();

  } else {

    pauseMusic();
  }
}


// ======================================================
// NEXT SONG
// ======================================================

function nextSong() {

  if (
    playlist.length === 0
  ) {

    return;
  }

  currentSongIndex++;

  if (
    currentSongIndex >=
    playlist.length
  ) {

    currentSongIndex = 0;
  }

  loadSong(
    currentSongIndex,
    true
  );
}


// ======================================================
// PREVIOUS SONG
// ======================================================

function previousSong() {

  if (
    playlist.length === 0
  ) {

    return;
  }

  currentSongIndex--;

  if (
    currentSongIndex < 0
  ) {

    currentSongIndex =
      playlist.length - 1;
  }

  loadSong(
    currentSongIndex,
    true
  );
}


// ======================================================
// UPDATE UI
// ======================================================

function updateMusicUI() {

  if (musicPlayButton) {

    musicPlayButton.innerText =
      playing
        ? "⏸"
        : "▶";
  }

  if (miniPlayButton) {

    miniPlayButton.innerText =
      playing
        ? "⏸"
        : "▶";
  }

  if (musicDisc) {

    if (playing) {

      musicDisc.classList.add(
        "playing"
      );

    } else {

      musicDisc.classList.remove(
        "playing"
      );
    }
  }

  if (miniDisc) {

    if (playing) {

      miniDisc.classList.add(
        "playing"
      );

    } else {

      miniDisc.classList.remove(
        "playing"
      );
    }
  }
}


// ======================================================
// MUSIC PLAYER PANEL
// ======================================================

function toggleMusicPlayer() {

  if (!musicPanel) {
    return;
  }

  musicPanel.classList.toggle(
    "active"
  );

  // Sembunyikan mini player saat panel utama terbuka
  syncMiniPlayerVisibility();
}


function closeMusicPlayer() {

  if (!musicPanel) {
    return;
  }

  musicPanel.classList.remove(
    "active"
  );

  syncMiniPlayerVisibility();
}


function syncMiniPlayerVisibility() {

  if (!miniPlayer) {
    return;
  }

  const panelOpen =
    musicPanel &&
    musicPanel.classList.contains(
      "active"
    );

  if (panelOpen) {

    miniPlayer.classList.add(
      "hidden-by-panel"
    );

  } else {

    miniPlayer.classList.remove(
      "hidden-by-panel"
    );
  }
}


// ======================================================
// UPDATE PROGRESS
// ======================================================

if (music) {

  music.addEventListener(
    "loadedmetadata",
    () => {

      if (musicDuration) {

        musicDuration.innerText =
          formatMusicTime(
            music.duration
          );
      }
    }
  );


  music.addEventListener(
    "timeupdate",
    () => {

      if (
        !music.duration ||
        !Number.isFinite(
          music.duration
        )
      ) {

        return;
      }

      const percentage =
        (
          music.currentTime /
          music.duration
        ) * 100;

      if (musicProgress) {

        musicProgress.value =
          percentage;
      }

      if (miniProgress) {
        miniProgress.value = percentage;
      }

      if (musicCurrentTime) {

        musicCurrentTime.innerText =
          formatMusicTime(
            music.currentTime
          );
      }
    }
  );


  music.addEventListener(
    "ended",
    () => {

      nextSong();
    }
  );


  music.addEventListener(
    "play",
    () => {

      playing = true;

      updateMusicUI();
    }
  );


  music.addEventListener(
    "pause",
    () => {

      playing = false;

      updateMusicUI();
    }
  );
}


// ======================================================
// SEEK / GESER PROGRESS BAR
// ======================================================

if (musicProgress) {

  musicProgress.addEventListener(
    "input",
    () => {

      if (
        !music ||
        !music.duration
      ) {

        return;
      }

      const percentage =
        parseFloat(
          musicProgress.value
        );

      music.currentTime =
        (
          percentage /
          100
        ) *
        music.duration;
    }
  );
}


/* Mini progress seek */
if (miniProgress) {

  miniProgress.addEventListener(
    "input",
    () => {

      if (
        !music ||
        !music.duration
      ) {
        return;
      }

      const percentage =
        parseFloat(
          miniProgress.value
        );

      music.currentTime =
        (percentage / 100) *
        music.duration;
    }
  );
}


// ======================================================
// VOLUME
// ======================================================

if (musicVolume) {

  musicVolume.addEventListener(
    "input",
    () => {

      if (!music) {
        return;
      }

      music.volume =
        parseFloat(
          musicVolume.value
        );

      localStorage.setItem(
        "musicVolume",
        musicVolume.value
      );
    }
  );
}


// ======================================================
// RESTORE VOLUME
// ======================================================

function restoreMusicVolume() {

  if (
    !music ||
    !musicVolume
  ) {

    return;
  }

  const savedVolume =
    localStorage.getItem(
      "musicVolume"
    );

  if (
    savedVolume !== null
  ) {

    musicVolume.value =
      savedVolume;
  }

  music.volume =
    parseFloat(
      musicVolume.value
    );
}


// ======================================================
// INITIALIZE MUSIC
// ======================================================

function initializeMusic() {

  if (
    !music ||
    playlist.length === 0
  ) {

    return;
  }

  restoreMusicVolume();

  loadSong(
    0,
    false
  );
}


// ======================================================
// CLOSE PLAYER KETIKA KLIK DI LUAR
// ======================================================

document.addEventListener(
  "click",
  event => {

    if (!musicPanel) {
      return;
    }

    const musicPlayer =
      document.getElementById(
        "musicPlayer"
      );

    if (
      musicPlayer &&
      !musicPlayer.contains(
        event.target
      )
    ) {

      closeMusicPlayer();
    }
  }
);


// ======================================================
// 11. COUNTDOWN
// ======================================================

const gradDate =
  new Date(
    "February 8, 2027 00:00:00"
  ).getTime();


function updateTimer() {

  const timerEl =
    document.getElementById(
      "timer"
    );

  if (!timerEl) {
    return;
  }

  const now =
    new Date().getTime();

  const diff =
    gradDate - now;

  if (diff <= 0) {

    timerEl.innerText =
      "8 Februari telah tiba 🚀";

    return;
  }

  const days =
    Math.floor(
      diff /
      (
        1000 *
        60 *
        60 *
        24
      )
    );

  const hours =
    Math.floor(
      (
        diff %
        (
          1000 *
          60 *
          60 *
          24
        )
      ) /
      (
        1000 *
        60 *
        60
      )
    );

  const minutes =
    Math.floor(
      (
        diff %
        (
          1000 *
          60 *
          60
        )
      ) /
      (
        1000 *
        60
      )
    );

  const seconds =
    Math.floor(
      (
        diff %
        (
          1000 *
          60
        )
      ) /
      1000
    );

  timerEl.innerText =
    `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik Lagi`;
}


// ======================================================
// 12. SEARCH ANGGOTA
// ======================================================

function filterMembers() {

  const searchInput =
    document.getElementById(
      "searchMember"
    );

  if (!searchInput) {
    return;
  }

  const input =
    searchInput.value
      .toLowerCase()
      .trim();

  document
    .querySelectorAll(
      ".anggota-card"
    )
    .forEach(card => {

      const nameElement =
        card.querySelector("h4");

      if (!nameElement) {
        return;
      }

      const name =
        nameElement.innerText
          .toLowerCase();

      if (
        name.includes(input)
      ) {

        card.style.display =
          "";

      } else {

        card.style.display =
          "none";
      }
    });
}


// ======================================================
// 13. SORT ANGGOTA
// ======================================================

function sortMembers(type) {

  const grid =
    document.getElementById(
      "memberGrid"
    );

  if (!grid) {
    return;
  }

  const members =
    Array.from(
      grid.querySelectorAll(
        ":scope > .anggota-card"
      )
    );

  if (type === "random") {

    shuffleArray(
      members
    );
  }

  if (type === "az") {

    members.sort(
      (a, b) => {

        const nameA =
          a.getAttribute(
            "data-name"
          ) || "";

        const nameB =
          b.getAttribute(
            "data-name"
          ) || "";

        return nameA.localeCompare(
          nameB,
          "id",
          {
            sensitivity: "base"
          }
        );
      }
    );
  }

  const fragment =
    document.createDocumentFragment();

  members.forEach(
    member => {

      fragment.appendChild(
        member
      );
    }
  );

  grid.appendChild(
    fragment
  );

  refreshObserver();
}


// ======================================================
// 14. FISHER-YATES
// ======================================================

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];
  }

  return array;
}


// ======================================================
// 15. RANDOM KENANGAN
// ======================================================

function shuffleMemories() {

  const gallery =
    document.getElementById(
      "memoryGallery"
    );

  const shuffleBtn =
    document.querySelector(".shuffle-memory-btn");

  if (shuffleBtn) {
    shuffleBtn.classList.add("shuffling");
    setTimeout(() => {
      shuffleBtn.classList.remove("shuffling");
    }, 900);
  }

  if (!gallery) {
    return;
  }

  const memories =
    Array.from(
      gallery.querySelectorAll(
        ":scope > .memory-card"
      )
    );

  if (
    memories.length === 0
  ) {

    return;
  }

  shuffleArray(
    memories
  );

  memories.forEach(
    memory => {

      memory.classList.remove(
        "featured"
      );
    }
  );

  const fragment =
    document.createDocumentFragment();

  memories.forEach(
    memory => {

      fragment.appendChild(
        memory
      );
    }
  );

  gallery.appendChild(
    fragment
  );

  memories[0].classList.add(
    "featured"
  );

  memories.forEach(
    memory => {

      memory.style.animation =
        "none";
    }
  );

  void gallery.offsetWidth;

  memories.forEach(
    (memory, index) => {

      memory.style.animation =
        `memoryReveal 0.7s ease ${
          index * 0.04
        }s forwards`;
    }
  );

  // Pagination: tampilkan batch awal setelah acak
  if (typeof resetMemoryPagination === "function") {
    resetMemoryPagination();
  }
}


// ======================================================
// 16. MEMORY COUNTER
// ======================================================

function updateMemoryCount() {

  const gallery =
    document.getElementById(
      "memoryGallery"
    );

  const counter =
    document.getElementById(
      "memoryCount"
    );

  if (
    !gallery ||
    !counter
  ) {

    return;
  }

  const total =
    gallery.querySelectorAll(
      ".memory-card"
    ).length;

  counter.innerText =
    total;
}


// ======================================================
// 17. ANIMASI ANGGOTA
// ======================================================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

          } else {

            entry.target.classList.remove(
              "visible"
            );
          }
        }
      );
    },
    {
      threshold: 0.1
    }
  );


function refreshObserver() {

  document
    .querySelectorAll(
      ".anggota-card"
    )
    .forEach(
      card => {

        observer.observe(
          card
        );
      }
    );
}


// ======================================================
// 18. MENU SCROLL LOCK
// ======================================================

const menuStyle =
  document.createElement(
    "style"
  );

menuStyle.innerHTML = `
  body.menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
  }

  body.member-modal-open {
    overflow: hidden;
  }
`;

document.head.appendChild(
  menuStyle
);


// ======================================================
// 19. LOADING SCREEN
// ======================================================

function finishLoading() {

  const loadingScreen =
    document.getElementById(
      "loading-screen"
    );

  if (!loadingScreen) {
    return;
  }

  loadingScreen.classList.add(
    "loaded"
  );

  setTimeout(
    () => {

      loadingScreen.style.display =
        "none";

    },
    900
  );
}


function runLoadingSequence() {

  const loadingScreen =
    document.getElementById("loading-screen");

  const bar =
    document.getElementById("loadingProgressBar");

  const percentEl =
    document.getElementById("loadingPercent");

  const statusEl =
    document.getElementById("loadingStatus");

  const messages = [
    "MEMULAI ORBIT...",
    "MENARIK PARTIKEL...",
    "MEMUAT KENANGAN...",
    "MENYATUKAN CERITA...",
    "HAMPIR SIAP..."
  ];

  const duration = 3500;
  const start = performance.now();
  let lastMsg = -1;
  let pullPhase = "";

  function tick(now) {

    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // ease-in-out: lambat di awal, cepat di akhir (sesuai tarikan)
    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2.2) / 2;

    if (bar) {
      bar.style.width = (eased * 100).toFixed(1) + "%";
    }

    if (percentEl) {
      percentEl.textContent =
        Math.round(eased * 100) + "%";
    }

    // Intensitas planet di fase akhir (partikel tidak di-loop)
    if (loadingScreen && progress >= 0.65 && pullPhase !== "end") {
      pullPhase = "end";
      loadingScreen.classList.add("pull-end");
    }

    const msgIndex = Math.min(
      Math.floor(progress * messages.length),
      messages.length - 1
    );

    if (statusEl && msgIndex !== lastMsg) {
      lastMsg = msgIndex;
      statusEl.textContent = messages[msgIndex];
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    if (percentEl) {
      percentEl.textContent = "100%";
    }

    if (bar) {
      bar.style.width = "100%";
    }

    setTimeout(finishLoading, 180);
  }

  requestAnimationFrame(tick);
}


// ======================================================
// 19b. ULANG TAHUN ANGGOTA
// ======================================================

const MONTH_MAP = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12
};

/** Data ulang tahun dari bio anggota (hari + bulan saja). */
const MEMBER_BIRTHDAYS = [
  { name: "Zafran Khairy Marwan Putra", nick: "Zafran", day: 22, month: 8 },
  { name: "Muhammad Khoirul Fahmi", nick: "Fahmi", day: 22, month: 10 },
  { name: "Gerindra Onata Osta Oswada Pracoyo", nick: "Geri", day: 3, month: 5 },
  { name: "Fazly Al-Fattah Ilin", nick: "Fazly", day: 8, month: 4 },
  { name: "Muhammad Aqsal Rezkyansyah", nick: "Aksal", day: 11, month: 1 },
  { name: "Nurul Islamiyah Istiqomah", nick: "Nurul", day: 28, month: 5 },
  { name: "Aulyana Putri", nick: "Aul", day: 30, month: 11 },
  { name: "Aini Akmalunisa Jupri", nick: "Aini", day: 20, month: 7 },
  { name: "Andini Nur Meisya Mastim", nick: "Andini", day: 25, month: 5 },
  { name: "Annisa Roidah Sukanto Thayeb", nick: "Nisa", day: 4, month: 3 },
  { name: "Dhini Andryani", nick: "Dhini", day: 24, month: 5 },
  { name: "Dinda Keisha Rohaendi", nick: "Dinda", day: 5, month: 11 },
  { name: "Dzakia Rafifah Artanti", nick: "Ifah", day: 31, month: 5 },
  { name: "Dzaqy Ardhani Arham", nick: "Dzaqy", day: 18, month: 1 },
  { name: "Fauziyyah Khansa Ramadhani", nick: "Fauziyyah", day: 18, month: 9 },
  { name: "Salsabillah Yulia Putri S", nick: "Salsa", day: 10, month: 7 },
  { name: "Aqifa Ghaziya Zalika", nick: "Aqifa", day: 17, month: 10 },
  { name: "Naizilah Rasyikah", nick: "Naizilah", day: 10, month: 8 },
  { name: "Ghina Najla Hulwatunnisa", nick: "Ghina", day: 11, month: 7 },
  { name: "Isma Apriyanti", nick: "Isma", day: 7, month: 9 },
  { name: "Janita Fajriyani", nick: "Janita", day: 4, month: 1 },
  { name: "Keyna Noverina Isamu", nick: "Keyna", day: 11, month: 11 },
  { name: "Keyla Noverila Isamu", nick: "Keyla", day: 11, month: 11 },
  { name: "Laode Muhammad Rezky Izzat Pratama", nick: "Izzat", day: 26, month: 12 },
  { name: "Mutia Dwi Mutmainah", nick: "Mutia", day: 27, month: 3 },
  { name: "Muh. Adnan Fabyan Setiawan", nick: "Adnan", day: 9, month: 5 },
  { name: "Izzatun Nafsy Nur Rahmi", nick: "Izzatun", day: 15, month: 4 },
  { name: "Khalisa Nuruljannah Yusuf", nick: "Khalisa", day: 5, month: 6 },
  { name: "Natasya Putri Ramadhani", nick: "Natasya", day: 3, month: 9 },
  { name: "Radisya Humairah A Labuku", nick: "Radisya", day: 6, month: 3 },
  { name: "Ratu Nur Khumairo", nick: "Ratu", day: 31, month: 3 },
  { name: "Andi Idham Pratama", nick: "Idham", day: 3, month: 12 },
  { name: "Iqro Saputri", nick: "Iqro", day: 10, month: 7 },
  { name: "Raudhatul Jannah", nick: "Raudha", day: 29, month: 11 }
];

const BIRTHDAY_NOTIF_KEY = "yvridioBirthdayNotifDate";

function getTodayBirthdays() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  return MEMBER_BIRTHDAYS.filter(
    (m) => m.day === day && m.month === month
  );
}

function renderHomeBirthday() {
  const wrap = document.getElementById("homeBirthday");
  const list = document.getElementById("birthdayList");

  if (!wrap || !list) return;

  const today = getTodayBirthdays();

  if (today.length === 0) {
    wrap.hidden = true;
    wrap.classList.remove("show");
    return;
  }

  list.innerHTML = "";

  today.forEach((person) => {
    const chip = document.createElement("div");
    chip.className = "birthday-chip";
    chip.innerHTML = `
      <span class="birthday-chip-icon">🎉</span>
      <div>
        <strong>${escapeMusicHTML(person.nick)}</strong>
        <small>${escapeMusicHTML(person.name)}</small>
      </div>
    `;
    list.appendChild(chip);
  });

  wrap.hidden = false;
  requestAnimationFrame(() => {
    wrap.classList.add("show");
  });
}

function getBirthdayNotifBody(people) {
  if (people.length === 1) {
    return `Hari ini ulang tahun ${people[0].nick}! 🎂\nYVRIDIO'09 — One class. One orbit. One story.`;
  }

  const names = people.map((p) => p.nick).join(", ");
  return `Hari ini ulang tahun: ${names}! 🎂\nYVRIDIO'09 — One class. One orbit. One story.`;
}

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function alreadyNotifiedToday() {
  return localStorage.getItem(BIRTHDAY_NOTIF_KEY) === todayDateKey();
}

function markNotifiedToday() {
  localStorage.setItem(BIRTHDAY_NOTIF_KEY, todayDateKey());
}

/**
 * VAPID PUBLIC KEY — harus sama dengan VAPID_PUBLIC_KEY di server (Vercel env).
 * Private key JANGAN pernah ditaruh di frontend.
 *
 * Generate ulang: npm run vapid
 * Lalu update key ini + env Vercel.
 */
const VAPID_PUBLIC_KEY =
  "BItqg9sfoto6HCyOM4jgmjDsgATkQ-MbqBSLG2rUOXBl819UttXJSecFw0g58_IUtkX_T_VdsRIDbHwsLIxrbFQ";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

/**
 * Minta izin notifikasi segera setelah site dibuka (bukan nunggu ultah).
 */
async function ensureNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";

  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    console.log("Gagal meminta izin notifikasi:", e);
    return "error";
  }
}

/**
 * Daftarkan Service Worker (wajib untuk Web Push di background).
 */
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.log("Service Worker gagal didaftarkan:", e);
    return null;
  }
}

/**
 * Subscribe Web Push + kirim subscription ke server.
 * Setelah ini, server bisa kirim notif meski tab tertutup.
 */
async function subscribeWebPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Simpan di server (Upstash via /api/subscribe)
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON())
      });
    } catch (e) {
      console.log("Gagal mengirim subscription ke server:", e);
    }

    return subscription;
  } catch (e) {
    console.log("Subscribe Web Push gagal:", e);
    return null;
  }
}

/**
 * Notifikasi lokal saat website sedang dibuka (cadangan).
 * Push server yang mengurus notif di background.
 */
async function sendBirthdayNotification() {
  const people = getTodayBirthdays();
  if (people.length === 0) return;

  if (!("Notification" in window)) return;
  if (alreadyNotifiedToday()) return;
  if (Notification.permission !== "granted") return;

  const title =
    people.length === 1
      ? `🎂 Selamat ulang tahun, ${people[0].nick}!`
      : `🎂 ${people.length} teman ulang tahun hari ini!`;

  try {
    // Preferensi: lewat Service Worker (lebih konsisten di mobile)
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body: getBirthdayNotifBody(people),
        icon: "assets/images/favicon.png",
        badge: "assets/images/favicon-32.png",
        tag: "yvridio-birthday-" + todayDateKey(),
        data: { url: "/" }
      });
    } else {
      const n = new Notification(title, {
        body: getBirthdayNotifBody(people),
        icon: "assets/images/favicon.png",
        badge: "assets/images/favicon-32.png",
        tag: "yvridio-birthday-" + todayDateKey()
      });
      n.onclick = () => {
        window.focus();
        if (typeof showPage === "function") showPage("home");
        n.close();
      };
    }

    markNotifiedToday();
  } catch (e) {
    console.log("Notifikasi ulang tahun gagal:", e);
  }
}

function initBirthdayFeature() {
  renderHomeBirthday();

  // Setelah loading:
  // 1) register SW
  // 2) minta izin notifikasi
  // 3) subscribe Web Push (supaya notif bisa di background)
  // 4) kalau ada ultah hari ini → notif lokal juga
  setTimeout(async () => {
    await registerServiceWorker();
    await ensureNotificationPermission();
    await subscribeWebPush();
    await sendBirthdayNotification();
  }, 4200);
}


// ======================================================
// 20. WEBSITE STARTUP
// ======================================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    // ==================================================
    // RESTORE TAB / HALAMAN TERAKHIR
    // ==================================================

    restoreActivePage();


    // ==================================================
    // INITIALIZE MUSIC PLAYER
    // ==================================================

    initializeMusic();


    // ==================================================
    // RANDOM QUOTE
    // ==================================================

    randomQuote();


    // ==================================================
    // ULANG TAHUN
    // ==================================================

    initBirthdayFeature();


    // ==================================================
    // COUNTDOWN
    // ==================================================

    updateTimer();

    setInterval(
      updateTimer,
      1000
    );


    // ==================================================
    // RANDOM ANGGOTA
    // ==================================================

    sortMembers(
      "random"
    );


    // ==================================================
    // RANDOM KENANGAN
    // ==================================================

    // Galeri: pagination awal (acak terjadi saat masuk tab Kenangan)
    if (typeof initMemoryPagination === "function") {
      initMemoryPagination();
    }


    // ==================================================
    // MEMORY COUNTER
    // ==================================================

    updateMemoryCount();

    if (typeof ensureFavoriteButtons === "function") {
      ensureFavoriteButtons();
    }
    if (typeof renderFavoritesPage === "function") {
      renderFavoritesPage();
    }


    // ==================================================
    // OBSERVER ANGGOTA
    // ==================================================

    refreshObserver();


    // ==================================================
    // LOADING SCREEN
    // ==================================================

    runLoadingSequence();
  }
);


// ======================================================
// 21. MEMBER DETAIL MODAL
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const memberGrid =
      document.getElementById(
        "memberGrid"
      );

    if (!memberGrid) {
      return;
    }

    // ==================================================
    // KARTU ANGGOTA SAJA
    // ==================================================

    memberGrid.addEventListener(
      "click",
      function(event) {

        /*
          PENTING:

          Hanya ambil .anggota-card yang
          merupakan anak langsung dari #memberGrid.

          Jadi memory-card atau elemen lain
          tidak akan pernah dianggap sebagai
          kartu anggota.
        */

        const card =
          event.target.closest(
            "#memberGrid > .anggota-card"
          );

        if (!card) {
          return;
        }

        openMemberDetail(
          card
        );
      }
    );
  }
);


// ======================================================
// OPEN MEMBER DETAIL
// ======================================================

function openMemberDetail(card) {

  // Jangan buka modal jika card bukan
  // anggota langsung dari memberGrid

  const memberGrid =
    document.getElementById(
      "memberGrid"
    );

  if (
    !memberGrid ||
    card.parentElement !==
      memberGrid
  ) {

    return;
  }


  const name =
    card.querySelector("h4")
      ?.textContent
      .trim() ||
    "Anggota YVRIDIO'09";


  const bio =
    card.querySelector(".bio")
      ?.textContent
      .trim() ||
    "";


  const image =
    card.querySelector("img")
      ?.src ||
    "assets/images/anggota/anonim.jpeg";


  // ==================================================
  // AMBIL NAMA PANGGILAN
  // DAN TEMPAT/TANGGAL LAHIR
  // ==================================================

  let nickname = "";
  let birth = "";


  if (
    bio.includes("|")
  ) {

    const parts =
      bio.split("|");

    nickname =
      parts[0].trim();

    birth =
      parts
        .slice(1)
        .join("|")
        .trim();

  } else {

    birth = bio;
  }


  // ==================================================
  // HAPUS MODAL LAMA
  // ==================================================

  const oldModal =
    document.getElementById(
      "memberDetailModal"
    );

  if (oldModal) {

    oldModal.remove();
  }


  // ==================================================
  // BUAT MODAL
  // ==================================================

  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "memberDetailModal";


  modal.innerHTML = `

    <div class="member-detail-overlay"></div>


    <div class="member-detail-card">

      <button
        class="member-detail-close"
        onclick="closeMemberDetail()"
        aria-label="Tutup detail"
      >
        ✕
      </button>


      <div class="member-detail-image-wrapper">

        <img
          src="${image}"
          alt="${name}"
          class="member-detail-image"
        >

      </div>


      <div class="member-detail-content">

        <span class="member-detail-label">
          ✦ YVRIDIO'09 CREW ✦
        </span>


        <h2>
          ${name}
        </h2>


        <div class="member-detail-line">

          <span>✦</span>

          <div></div>

          <span>✦</span>

        </div>


        <div class="member-detail-info">


          <div class="member-info-item">

            <span class="member-info-icon">
              👤
            </span>


            <div>

              <small>
                NAMA PANGGILAN
              </small>


              <strong>
                ${nickname || "-"}
              </strong>

            </div>

          </div>


          <div class="member-info-item">

            <span class="member-info-icon">
              📍
            </span>


            <div>

              <small>
                TEMPAT & TANGGAL LAHIR
              </small>


              <strong>
                ${birth || "-"}
              </strong>

            </div>

          </div>


          <div class="member-info-item">

            <span class="member-info-icon">
              🚀
            </span>


            <div>

              <small>
                ORBIT
              </small>


              <strong>
                YVRIDIO'09
              </strong>

            </div>

          </div>


        </div>


        <p class="member-detail-quote">
          "Satu dari banyak orang yang membuat
          YVRIDIO'09 menjadi sebuah cerita."
        </p>


        <div class="member-detail-footer">
          ONE CLASS. ONE ORBIT. ONE STORY.
        </div>


      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  // ==================================================
  // AKTIFKAN ANIMASI
  // ==================================================

  requestAnimationFrame(
    () => {

      modal.classList.add(
        "show"
      );
    }
  );


  // ==================================================
  // KUNCI SCROLL
  // ==================================================

  document.body.classList.add(
    "member-modal-open"
  );


  // ==================================================
  // KLIK AREA LUAR
  // ==================================================

  const overlay =
    modal.querySelector(
      ".member-detail-overlay"
    );

  if (overlay) {

    overlay.addEventListener(
      "click",
      closeMemberDetail
    );
  }


  // ==================================================
  // ESC
  // ==================================================

  document.addEventListener(
    "keydown",
    memberDetailEscHandler
  );
}


// ======================================================
// CLOSE MEMBER DETAIL
// ======================================================

function closeMemberDetail() {

  const modal =
    document.getElementById(
      "memberDetailModal"
    );

  if (!modal) {

    document.body.classList.remove(
      "member-modal-open"
    );

    document.removeEventListener(
      "keydown",
      memberDetailEscHandler
    );

    return;
  }


  modal.classList.remove(
    "show"
  );


  setTimeout(
    () => {

      if (modal.parentNode) {

        modal.remove();
      }

    },
    250
  );


  document.body.classList.remove(
    "member-modal-open"
  );


  document.removeEventListener(
    "keydown",
    memberDetailEscHandler
  );
}


// ======================================================
// ESC MEMBER MODAL
// ======================================================

function memberDetailEscHandler(
  event
) {

  if (
    event.key === "Escape"
  ) {

    closeMemberDetail();
  }
}



// ======================================================
// BACK TO TOP
// ======================================================

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function updateBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  if (window.scrollY > 420) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
window.addEventListener("DOMContentLoaded", updateBackToTop);


// ======================================================
// KENANGAN PAGINATION + ORBIT RANDOM
// ======================================================

const MEMORY_PAGE_SIZE = 36;
let memoryVisibleCount = 0;

function getAllMemoryCards() {
  const gallery = document.getElementById("memoryGallery");
  if (!gallery) return [];
  return Array.from(gallery.querySelectorAll(":scope > .memory-card"));
}

function applyMemoryPagination() {
  const cards = getAllMemoryCards();
  const total = cards.length;

  cards.forEach((card, index) => {
    if (index < memoryVisibleCount) {
      card.classList.remove("memory-hidden");
    } else {
      card.classList.add("memory-hidden");
    }
  });

  const wrap = document.getElementById("memoryLoadMoreWrap");
  const btn = document.getElementById("memoryLoadMoreBtn");
  const countEl = document.getElementById("memoryLoadMoreCount");
  const statusEl = document.getElementById("memoryLoadStatus");

  const remaining = Math.max(total - memoryVisibleCount, 0);

  if (wrap) {
    wrap.style.display = total === 0 ? "none" : "";
  }

  if (countEl) {
    countEl.textContent =
      remaining > 0
        ? `+${remaining}`
        : "✓";
  }

  if (statusEl) {
    statusEl.textContent =
      remaining > 0
        ? `Menampilkan ${Math.min(memoryVisibleCount, total)} dari ${total} kenangan`
        : `Semua ${total} kenangan telah dimuat`;
  }

  if (btn) {
    if (remaining <= 0) {
      btn.classList.add("is-done");
      const label = btn.querySelector(".load-more-label strong");
      if (label) label.textContent = "Orbit Penuh";
    } else {
      btn.classList.remove("is-done");
      const label = btn.querySelector(".load-more-label strong");
      if (label) label.textContent = "Muat Kenangan Lain";
    }
  }

  if (typeof ensureFavoriteButtons === "function") {
    ensureFavoriteButtons();
  }
}

function resetMemoryPagination() {
  memoryVisibleCount = MEMORY_PAGE_SIZE;
  applyMemoryPagination();
}

function loadMoreMemories() {
  const total = getAllMemoryCards().length;
  if (memoryVisibleCount >= total) return;

  memoryVisibleCount = Math.min(
    memoryVisibleCount + MEMORY_PAGE_SIZE,
    total
  );
  applyMemoryPagination();
}

function isOrbitRandomEnabled() {
  return localStorage.getItem("orbitRandom") === "1";
}

function syncOrbitRandomUI() {
  const btn = document.getElementById("orbitRandomBtn");
  if (!btn) return;

  const on = isOrbitRandomEnabled();
  btn.classList.toggle("active", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");

  const strong = btn.querySelector(".orbit-random-text strong");
  if (strong) {
    strong.textContent = on ? "Orbit ON" : "Orbit Random";
  }
}

function toggleOrbitRandom() {
  const next = !isOrbitRandomEnabled();
  localStorage.setItem("orbitRandom", next ? "1" : "0");
  syncOrbitRandomUI();

  if (next) {
    shuffleMemories();
  }
}

function initMemoryPagination() {
  const cards = getAllMemoryCards();
  memoryVisibleCount = Math.min(MEMORY_PAGE_SIZE, cards.length);
  applyMemoryPagination();
  syncOrbitRandomUI();
}


// ======================================================
// FOTO FAVORIT
// ======================================================

const FAV_STORAGE_KEY = "yvridioFavorites";

function getFavoriteSrcs() {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveFavoriteSrcs(list) {
  localStorage.setItem(
    FAV_STORAGE_KEY,
    JSON.stringify(list)
  );
}

function normalizeFavSrc(src) {
  try {
    const u = new URL(src, window.location.href);
    return u.pathname + u.search;
  } catch (e) {
    return String(src || "");
  }
}

function isFavoriteSrc(src) {
  const key = normalizeFavSrc(src);
  return getFavoriteSrcs().some(
    (s) => normalizeFavSrc(s) === key
  );
}

function toggleFavoriteSrc(src) {
  const key = normalizeFavSrc(src);
  let list = getFavoriteSrcs();
  const idx = list.findIndex(
    (s) => normalizeFavSrc(s) === key
  );

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(src);
  }

  saveFavoriteSrcs(list);
  return idx < 0;
}

function ensureFavoriteButtons() {
  const cards = document.querySelectorAll(
    "#memoryGallery > .memory-card"
  );

  cards.forEach((card) => {
    if (card.querySelector(".memory-fav-btn")) return;

    const img = card.querySelector("img");
    if (!img) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "memory-fav-btn";
    btn.title = "Tandai favorit";
    btn.setAttribute("aria-label", "Tandai favorit");
    btn.innerHTML = "✦";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const on = toggleFavoriteSrc(img.currentSrc || img.src);
      btn.classList.toggle("is-fav", on);
      btn.title = on ? "Hapus dari favorit" : "Tandai favorit";

      renderFavoritesPage();
    });

    card.appendChild(btn);
  });

  syncFavoriteButtons();
}

function syncFavoriteButtons() {
  document
    .querySelectorAll("#memoryGallery > .memory-card")
    .forEach((card) => {
      const img = card.querySelector("img");
      const btn = card.querySelector(".memory-fav-btn");
      if (!img || !btn) return;

      const on = isFavoriteSrc(img.currentSrc || img.src);
      btn.classList.toggle("is-fav", on);
      btn.title = on ? "Hapus dari favorit" : "Tandai favorit";
    });
}

function renderFavoritesPage() {
  const gallery = document.getElementById("favoritGallery");
  const empty = document.getElementById("favoritEmpty");
  const countEl = document.getElementById("favoritCount");
  if (!gallery) return;

  const favs = getFavoriteSrcs();
  if (countEl) countEl.textContent = String(favs.length);

  gallery.innerHTML = "";

  if (favs.length === 0) {
    if (empty) empty.classList.add("show");
    return;
  }

  if (empty) empty.classList.remove("show");

  // Map path -> original img in memory gallery for consistency
  const sourceImgs = Array.from(
    document.querySelectorAll("#memoryGallery .memory-card img")
  );

  favs.forEach((src) => {
    const key = normalizeFavSrc(src);
    const matched = sourceImgs.find(
      (img) => normalizeFavSrc(img.currentSrc || img.src) === key
    );
    const finalSrc = matched
      ? (matched.getAttribute("src") || matched.src)
      : src;

    const card = document.createElement("div");
    card.className = "memory-card";
    card.style.opacity = "1";
    card.style.transform = "none";
    card.style.animation = "none";

    const img = document.createElement("img");
    img.src = finalSrc;
    img.loading = "lazy";
    img.alt = "Kenangan favorit YVRIDIO'09";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "memory-fav-btn is-fav";
    btn.title = "Hapus dari favorit";
    btn.setAttribute("aria-label", "Hapus dari favorit");
    btn.innerHTML = "✦";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavoriteSrc(finalSrc);
      syncFavoriteButtons();
      renderFavoritesPage();
    });

    card.appendChild(img);
    card.appendChild(btn);
    gallery.appendChild(card);
  });
}

function clearAllFavorites() {
  if (!getFavoriteSrcs().length) return;
  const ok = window.confirm(
    "Hapus semua foto favorit?"
  );
  if (!ok) return;

  saveFavoriteSrcs([]);
  syncFavoriteButtons();
  renderFavoritesPage();
}

// Klik foto di halaman favorit → modal (sumber terpisah dari Kenangan)
document.addEventListener("click", function (event) {
  const image = event.target.closest(
    "#favoritGallery .memory-card img"
  );
  if (!image) return;
  openModal(image.src, "favorit");
});


function syncModalFavoriteButton() {
  const modalImg = document.getElementById("modal-img");
  const btn = document.getElementById("modalFavBtn");
  if (!modalImg || !btn || typeof isFavoriteSrc !== "function") return;

  const src = modalImg.currentSrc || modalImg.src;
  if (!src) return;

  const on = isFavoriteSrc(src);
  btn.classList.toggle("is-fav", on);
  btn.title = on ? "Hapus dari favorit" : "Tandai favorit";
  btn.setAttribute("aria-label", btn.title);
}

function toggleModalFavorite() {
  const modalImg = document.getElementById("modal-img");
  if (!modalImg || typeof toggleFavoriteSrc !== "function") return;

  const src = modalImg.currentSrc || modalImg.src;
  if (!src) return;

  const wasFavorite = isFavoriteSrc(src);
  toggleFavoriteSrc(src);

  if (typeof syncFavoriteButtons === "function") {
    syncFavoriteButtons();
  }
  if (typeof renderFavoritesPage === "function") {
    renderFavoritesPage();
  }
  syncModalFavoriteButton();

  // Jika modal sedang dari halaman Favorit dan foto di-unfavorite,
  // sinkronkan list modal agar counter/navigasi tetap hanya foto favorit.
  if (modalGallerySource === "favorit" && wasFavorite) {
    const images = getModalImages();

    if (images.length === 0) {
      closeModal();
      return;
    }

    if (currentPhotoIndex >= images.length) {
      currentPhotoIndex = images.length - 1;
    }

    updateModalPhoto();
  }
}


