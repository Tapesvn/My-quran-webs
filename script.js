// ---------- Core elements ----------
const home = document.getElementById('home-button'),
      chaptersBtn = document.getElementById('hoofdstukken-button'),
      sidebar = document.getElementById('chapter-sidebar'),
      overlay = document.getElementById('overlay'),
      content = document.getElementById('content-area');

// ---------- Utility functions ----------
function showHome() {
  if (!sidebar.classList.contains('open')) {
    content.innerHTML = "<h2>Home</h2><p>Dit is de startpagina van de site.</p>";
  }
}

function openChaptersMobile() {
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  content.style.background = '#121212';
  content.style.color = '#aaa';
  createChBtns();
}

// ---------- Mobile hamburger functionality ----------
const hamburgerBtn = document.getElementById('hamburger-button');
const mobilePanel = document.getElementById('mobile-panel');
let mobileMenuOpen = false;

// Set initial panel styles
mobilePanel.style.display = 'none';
mobilePanel.style.height = '0';
mobilePanel.style.overflow = 'hidden';
mobilePanel.style.position = 'fixed';
mobilePanel.style.top = '50px'; // just below top buttons
mobilePanel.style.left = '0';
mobilePanel.style.width = '100%'; // FULL WIDTH
mobilePanel.style.background = '#2b2b2b';
mobilePanel.style.transition = 'height 0.28s ease';
mobilePanel.style.zIndex = '115';

// Toggle panel when hamburger clicked
hamburgerBtn.addEventListener('click', () => {
  mobileMenuOpen = !mobileMenuOpen;
  if (mobileMenuOpen) {
    mobilePanel.style.display = 'block';
    mobilePanel.style.height = mobilePanel.scrollHeight + 'px';
  } else {
    mobilePanel.style.height = '0';
    setTimeout(() => { if (!mobileMenuOpen) mobilePanel.style.display = 'none'; }, 300);
  }
});

// Clicking outside panel closes it
document.addEventListener('click', (e) => {
  const target = e.target;
  if (mobileMenuOpen && target !== hamburgerBtn && !mobilePanel.contains(target)) {
    mobileMenuOpen = false;
    mobilePanel.style.height = '0';
    setTimeout(() => { if (!mobileMenuOpen) mobilePanel.style.display = 'none'; }, 300);
  }
});

// Mobile buttons inside panel
const mobileHomeBtn = document.getElementById('home-button-mobile');
const mobileChaptersBtn = document.getElementById('hoofdstukken-button-mobile');

mobileHomeBtn.addEventListener('click', () => {
  showHome();
  mobileMenuOpen = false;
  mobilePanel.style.height = '0';
  setTimeout(() => { mobilePanel.style.display = 'none'; }, 300);
});

mobileChaptersBtn.addEventListener('click', () => {
  openChaptersMobile();
  mobileMenuOpen = false;
  mobilePanel.style.height = '0';
  setTimeout(() => { mobilePanel.style.display = 'none'; }, 300);
});

// Ensure hamburger and mobile panel only appear on mobile
function handleMobileView() {
  if (window.innerWidth <= 768) {
    hamburgerBtn.style.display = 'block';
  } else {
    hamburgerBtn.style.display = 'none';
    mobilePanel.style.display = 'none';
    mobilePanel.style.height = '0';
    mobileMenuOpen = false;
  }
}
window.addEventListener('resize', handleMobileView);
handleMobileView();

// ---------- Chapter logic (existing code) ----------
function resetBG() {
  sidebar.classList.remove('open');
  sidebar.classList.remove('hide');
  overlay.style.display = 'none';
  content.style.background = '#2b2b2b';
  content.style.color = 'white';
}

function clearCh() { sidebar.innerHTML = ''; }

const chapters = [
  { n: 1, d: "De Opener", t: "(EL' FAATIHA')", a: "سُورَةُ ٱلْفَاتِحَةِ", jsonFile: "chapters/001-al-fatihah.json" },
  { n: 2, d: "De Koe", t: "(EL' BAQARA')", a: "سُورَةُ البَقَرَةِ", c: "<h2>De Koe</h2><p>Inhoud van Surah Al-Baqara komt hier...</p>" },
  { n: 3, d: "Familie Van Amram", t: "(AALI EM'RAAN)", a: "سُورَةُ آلِ عِمۡرَانَ", c: "<h2>Familie Van Amram</h2><p>Inhoud van Surah Aal-Imran komt hier...</p>" }
];

function createChBtns() {
  clearCh();
  const hdr = document.createElement('div');
  hdr.id = 'chapter-header';
  hdr.textContent = "Het Boek Van God";
  const close = document.createElement('span');
  close.id = 'close-chapters';
  close.textContent = '×';
  close.onclick = () => { sidebar.classList.add('hide'); setTimeout(resetBG, 300); };
  hdr.appendChild(close);
  sidebar.appendChild(hdr);

  chapters.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'chapter-button';
    if (i == 0) btn.classList.add('first-chapter');

    btn.onclick = () => {
      resetBG();
      content.innerHTML = "";

      const chapterContainer = document.createElement('div');
      chapterContainer.className = 'chapter-content-container';

      const titles = document.createElement('div');
      titles.className = 'chapter-titles-container';
      titles.innerHTML = `
        <div class="chapter-title-dutch">${ch.d}</div>
        <div class="chapter-title-arabic">${ch.a}</div>
      `;
      chapterContainer.appendChild(titles);

      if (ch.jsonFile) {
        fetch(ch.jsonFile)
          .then(res => res.json())
          .then(data => {
            for (let verseNum in data["1"].ayahs) {
              const verse = data["1"].ayahs[verseNum];
              const verseDiv = document.createElement('div');
              verseDiv.className = 'verse';
              verseDiv.innerHTML = `
                <p>${verse.arabic}</p>
                <p>${verse.transliteration}</p>
                <p>${verse.dutch}</p>
              `;
              chapterContainer.appendChild(verseDiv);
            }
            content.appendChild(chapterContainer);
            window.scrollTo(0, 0);
          })
          .catch(() => { content.innerHTML = '<p>Kon hoofdstuk niet laden.</p>'; });
      } else {
        chapterContainer.innerHTML += ch.c;
        content.appendChild(chapterContainer);
      }
    };

    // Sidebar button layout
    const row = document.createElement('div'); row.className = 'row';
    const num = document.createElement('span'); num.className = 'number'; num.textContent = ch.n; row.appendChild(num);
    const txtCol = document.createElement('div'); txtCol.className = 'text-column';
    const arab = document.createElement('span'); arab.className = 'arabic'; arab.textContent = ch.a; txtCol.appendChild(arab);
    const dt = document.createElement('div'); dt.className = 'dutch-translit';
    const dutch = document.createElement('span'); dutch.textContent = ch.d;
    const tr = document.createElement('span'); tr.className = 'transliteration'; tr.textContent = ch.t;
    dt.appendChild(dutch); dt.appendChild(tr); txtCol.appendChild(dt); row.appendChild(txtCol); btn.appendChild(row);
    sidebar.appendChild(btn);
  });
}

// ---------- Desktop top buttons ----------
home.addEventListener('click', () => {
  if (!sidebar.classList.contains('open')) content.innerHTML = "<h2>Home</h2><p>Dit is de startpagina van de site.</p>";
});

chaptersBtn.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  content.style.background = '#121212';
  content.style.color = '#aaa';
  createChBtns();
});

// Overlay closes sidebar
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  sidebar.classList.remove('hide');
  overlay.style.display = 'none';
  content.style.background = '#2b2b2b';
  content.style.color = 'white';
});
