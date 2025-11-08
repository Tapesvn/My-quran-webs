// ---------- Core elements (your original ids) ----------
const home = document.getElementById('home-button'),
      chaptersBtn = document.getElementById('hoofdstukken-button'),
      sidebar = document.getElementById('chapter-sidebar'),
      overlay = document.getElementById('overlay'),
      content = document.getElementById('content-area');

// ---------- Create / normalize mobile elements (safe if already present) ----------
let hamburger = document.getElementById('hamburger');
if (!hamburger) {
  hamburger = document.createElement('button');
  hamburger.id = 'hamburger';
  hamburger.textContent = '☰';
  hamburger.style.position = 'fixed';
  hamburger.style.top = '16px';
  hamburger.style.right = '16px';
  hamburger.style.fontSize = '24px';
  hamburger.style.background = 'none';
  hamburger.style.border = 'none';
  hamburger.style.color = 'white';
  hamburger.style.zIndex = '120';
  document.body.appendChild(hamburger);
}

let mobilePanel = document.getElementById('mobile-panel');
if (!mobilePanel) {
  mobilePanel = document.createElement('div');
  mobilePanel.id = 'mobile-panel';
  // base styles (will be toggled by JS)
  mobilePanel.style.position = 'fixed';
  mobilePanel.style.top = '50px';
  mobilePanel.style.left = '0';
  mobilePanel.style.width = '100%';
  mobilePanel.style.background = '#2b2b2b';
  mobilePanel.style.overflow = 'hidden';
  mobilePanel.style.transition = 'height 0.28s ease';
  mobilePanel.style.zIndex = '115';
  mobilePanel.style.display = 'none';
  document.body.appendChild(mobilePanel);
  // add mobile buttons inside panel (so they are ONLY in mobilePanel)
  const mHome = document.createElement('button');
  mHome.id = 'mobile-home-btn';
  mHome.textContent = 'Home';
  mHome.style.background = 'none';
  mHome.style.border = 'none';
  mHome.style.color = 'white';
  mHome.style.fontSize = '18px';
  mHome.style.padding = '12px 16px';
  mHome.style.textAlign = 'left';
  mobilePanel.appendChild(mHome);

  const mCh = document.createElement('button');
  mCh.id = 'mobile-chapters-btn';
  mCh.textContent = 'Hoofdstukken';
  mCh.style.background = 'none';
  mCh.style.border = 'none';
  mCh.style.color = 'white';
  mCh.style.fontSize = '18px';
  mCh.style.padding = '12px 16px';
  mCh.style.textAlign = 'left';
  mobilePanel.appendChild(mCh);

  // attach mobile button behavior
  mHome.addEventListener('click', ()=>{
    mobilePanel.style.display = 'none';
    mobilePanel.style.height = '0';
    showHome();
  });
  mCh.addEventListener('click', ()=>{
    mobilePanel.style.display = 'none';
    mobilePanel.style.height = '0';
    openChaptersMobile();
  });
}

// ---------- Utility functions ----------
function showHome(){
  // Keep behavior same as original
  if(!sidebar.classList.contains('open')){
    content.innerHTML = "<h2>Home</h2><p>Dit is de startpagina van de site.</p>";
  }
}

function openChaptersMobile(){
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  content.style.background = '#121212';
  content.style.color = '#aaa';
  createChBtns();
}

// ---------- Mobile visibility & duplicate-cleanup ----------
function setupMobileVisibility(){
  // If mobile (<=768) show hamburger and hide top buttons.
  if(window.innerWidth <= 768){
    // hide original desktop top buttons
    if (home) home.style.display = 'none';
    if (chaptersBtn) chaptersBtn.style.display = 'none';
    // show hamburger
    hamburger.style.display = 'block';
    // ensure mobilePanel starts collapsed and not visible until toggled
    mobilePanel.style.display = 'none';
    mobilePanel.style.height = '0';
  } else {
    // desktop: hide mobile UI entirely and ensure top buttons visible
    hamburger.style.display = 'none';
    mobilePanel.style.display = 'none';
    mobilePanel.style.height = '0';
    if (home) home.style.display = 'inline-block';
    if (chaptersBtn) chaptersBtn.style.display = 'inline-block';
  }

  // **Cleanup**: remove or hide any accidental cloned buttons that may exist elsewhere
  // (some earlier versions cloned nodes into DOM; hide anything with ids used for clones)
  const clones = [
    'home-button-mobile','hoofdstukken-button-mobile',
    'home-button-mobile-clone','chapters-button-clone'
  ];
  clones.forEach(id => {
    const n = document.getElementById(id);
    if(n) n.style.display = 'none';
  });
}

// run once and on resize
setupMobileVisibility();
window.addEventListener('resize', setupMobileVisibility);

// ---------- Mobile hamburger toggle ----------
let mobileOpen = false;
hamburger.addEventListener('click', ()=>{
  mobileOpen = !mobileOpen;
  if(mobileOpen){
    mobilePanel.style.display = 'block';
    // set height to fit two buttons (approx) — use scrollHeight to be robust
    mobilePanel.style.height = mobilePanel.scrollHeight + 'px';
  } else {
    mobilePanel.style.height = '0';
    // wait transition then hide to avoid flicker
    setTimeout(()=>{ if(!mobileOpen) mobilePanel.style.display = 'none'; }, 300);
  }
});

// clicking overlay closes sidepanel
overlay.addEventListener('click', ()=>{
  sidebar.classList.remove('open');
  sidebar.classList.remove('hide');
  overlay.style.display = 'none';
  content.style.background = '#2b2b2b';
  content.style.color = 'white';
});

// ---------- Chapter logic (your original starting-point code) ----------
function resetBG(){
  sidebar.classList.remove('open');
  sidebar.classList.remove('hide');
  overlay.style.display='none';
  content.style.background='#2b2b2b';
  content.style.color='white';
}

function clearCh(){ sidebar.innerHTML=''; }

const chapters=[
  {n:1,d:"De Opener",t:"(EL' FAATIHA')",a:"سُورَةُ ٱلْفَاتِحَةِ",jsonFile:"chapters/001-al-fatihah.json"},
  {n:2,d:"De Koe",t:"(EL' BAQARA')",a:"سُورَةُ البَقَرَةِ",c:"<h2>De Koe</h2><p>Inhoud van Surah Al-Baqara komt hier...</p>"},
  {n:3,d:"Familie Van Amram",t:"(AALI EM'RAAN)",a:"سُورَةُ آلِ عِمۡرَانَ",c:"<h2>Familie Van Amram</h2><p>Inhoud van Surah Aal-Imran komt hier...</p>"}
];

function createChBtns(){
  clearCh();
  const hdr = document.createElement('div');
  hdr.id = 'chapter-header';
  hdr.textContent = "Het Boek Van God";
  const close = document.createElement('span');
  close.id = 'close-chapters';
  close.textContent='×';
  close.onclick=()=>{sidebar.classList.add('hide'); setTimeout(resetBG,300)};
  hdr.appendChild(close);
  sidebar.appendChild(hdr);

  chapters.forEach((ch,i)=>{
    const btn = document.createElement('button');
    btn.className='chapter-button';
    if(i==0) btn.classList.add('first-chapter');

    btn.onclick = () => {
      resetBG();
      content.innerHTML = "";

      // Wrap everything inside chapter-content-container
      const chapterContainer = document.createElement('div');
      chapterContainer.className = 'chapter-content-container';

      // Chapter titles
      const titles = document.createElement('div');
      titles.className = 'chapter-titles-container';
      titles.innerHTML = `
        <div class="chapter-title-dutch">${ch.d}</div>
        <div class="chapter-title-arabic">${ch.a}</div>
      `;
      chapterContainer.appendChild(titles);

      if(ch.jsonFile){
        fetch(ch.jsonFile)
          .then(res => res.json())
          .then(data => {
            for(let verseNum in data["1"].ayahs){
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
            window.scrollTo(0,0);
          })
          .catch(()=>{ content.innerHTML='<p>Kon hoofdstuk niet laden.</p>'; });
      } else {
        chapterContainer.innerHTML += ch.c;
        content.appendChild(chapterContainer);
      }
    };

    // Sidebar button layout
    const row = document.createElement('div'); row.className='row';
    const num = document.createElement('span'); num.className='number'; num.textContent = ch.n; row.appendChild(num);
    const txtCol = document.createElement('div'); txtCol.className='text-column';
    const arab = document.createElement('span'); arab.className='arabic'; arab.textContent = ch.a; txtCol.appendChild(arab);
    const dt = document.createElement('div'); dt.className='dutch-translit';
    const dutch = document.createElement('span'); dutch.textContent = ch.d;
    const tr = document.createElement('span'); tr.className='transliteration'; tr.textContent = ch.t;
    dt.appendChild(dutch); dt.appendChild(tr); txtCol.appendChild(dt); row.appendChild(txtCol); btn.appendChild(row);
    sidebar.appendChild(btn);
  });
}

// top buttons (desktop) behavior
home.addEventListener('click', ()=>{ if(!sidebar.classList.contains('open')) content.innerHTML="<h2>Home</h2><p>Dit is de startpagina van de site.</p>"; });
chaptersBtn.addEventListener('click', ()=>{
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  content.style.background = '#121212';
  content.style.color = '#aaa';
  createChBtns();
});
