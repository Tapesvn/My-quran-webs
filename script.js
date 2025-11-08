const home = document.getElementById('home-button'),
      chaptersBtn = document.getElementById('hoofdstukken-button'),
      sidebar = document.getElementById('chapter-sidebar'),
      overlay = document.getElementById('overlay'),
      content = document.getElementById('content-area');

// Mobile menu elements
let hamburger, mobilePanel, mobileHome, mobileChapters;

function setupMobileMenu() {
  if (window.innerWidth <= 768) {
    // Only create hamburger once
    if (!document.getElementById('hamburger')) {
      hamburger = document.createElement('button');
      hamburger.id = 'hamburger';
      hamburger.textContent = '☰';
      hamburger.style.position = 'fixed';
      hamburger.style.top = '16px';
      hamburger.style.right = '16px';
      hamburger.style.zIndex = '101';
      hamburger.style.fontSize = '24px';
      hamburger.style.background = 'none';
      hamburger.style.color = 'white';
      hamburger.style.border = 'none';
      hamburger.style.cursor = 'pointer';
      document.body.appendChild(hamburger);

      mobilePanel = document.createElement('div');
      mobilePanel.id = 'mobile-panel';
      mobilePanel.style.position = 'fixed';
      mobilePanel.style.top = '50px';
      mobilePanel.style.right = '16px';
      mobilePanel.style.background = '#2b2b2b';
      mobilePanel.style.border = '1px solid white';
      mobilePanel.style.borderRadius = '8px';
      mobilePanel.style.padding = '8px';
      mobilePanel.style.display = 'none';
      mobilePanel.style.flexDirection = 'column';
      mobilePanel.style.zIndex = '100';
      document.body.appendChild(mobilePanel);

      mobileHome = document.createElement('button');
      mobileHome.textContent = 'Home';
      mobileHome.style.marginBottom = '6px';
      mobileHome.style.fontSize = '16px';
      mobileHome.style.background = 'none';
      mobileHome.style.color = 'white';
      mobileHome.style.border = 'none';
      mobileHome.style.cursor = 'pointer';
      mobilePanel.appendChild(mobileHome);

      mobileChapters = document.createElement('button');
      mobileChapters.textContent = 'Hoofdstukken';
      mobileChapters.style.fontSize = '16px';
      mobileChapters.style.background = 'none';
      mobileChapters.style.color = 'white';
      mobileChapters.style.border = 'none';
      mobileChapters.style.cursor = 'pointer';
      mobilePanel.appendChild(mobileChapters);

      // Hamburger click toggle
      hamburger.onclick = () => {
        mobilePanel.style.display = mobilePanel.style.display === 'flex' ? 'none' : 'flex';
      };

      // Mobile Home click
      mobileHome.onclick = () => {
        content.innerHTML = "<h2>Home</h2><p>Dit is de startpagina van de site.</p>";
        mobilePanel.style.display = 'none';
      };

      // Mobile Chapters click
      mobileChapters.onclick = () => {
        createChBtns();
        mobilePanel.style.display = 'none';
      };
    }

    // Hide desktop top buttons
    home.style.display = 'none';
    chaptersBtn.style.display = 'none';
  } else {
    // Desktop view: show top buttons
    if (hamburger) hamburger.style.display = 'none';
    if (mobilePanel) mobilePanel.style.display = 'none';
    home.style.display = 'inline-block';
    chaptersBtn.style.display = 'inline-block';
  }
}

// Call on load
setupMobileMenu();

// Update on window resize
window.addEventListener('resize', setupMobileMenu);

// Reset background and sidebar
function resetBG() {
  sidebar.classList.remove('open');
  sidebar.classList.remove('hide');
  overlay.style.display = 'none';
  content.style.background = '#2b2b2b';
  content.style.color = 'white';
}

// Clear chapters panel
function clearCh() { sidebar.innerHTML = ''; }

const chapters = [
  {n:1,d:"De Opener",t:"(EL' FAATIHA')",a:"سُورَةُ ٱلْفَاتِحَةِ",jsonFile:"chapters/001-al-fatihah.json"},
  {n:2,d:"De Koe",t:"(EL' BAQARA')",a:"سُورَةُ البَقَرَةِ",c:"<h2>De Koe</h2><p>Inhoud van Surah Al-Baqara komt hier...</p>"},
  {n:3,d:"Familie Van Amram",t:"(AALI EM'RAAN)",a:"سُورَةُ آلِ عِمۡرَانَ",c:"<h2>Familie Van Amram</h2><p>Inhoud van Surah Aal-Imran komt hier...</p>"}
];

function createChBtns() {
  clearCh();
  const hdr = document.createElement('div');
  hdr.id = 'chapter-header';
  hdr.textContent = "Het Boek Van God";
  const close = document.createElement('span');
  close.id = 'close-chapters';
  close.textContent='×';
  close.onclick = () => { sidebar.classList.add('hide'); setTimeout(resetBG,300); };
  hdr.appendChild(close);
  sidebar.appendChild(hdr);

  chapters.forEach((ch,i)=>{
    const btn = document.createElement('button');
    btn.className='chapter-button';
    if(i==0) btn.classList.add('first-chapter');

    btn.onclick = () => {
      resetBG();
      content.innerHTML=""; // clear content
      if(ch.jsonFile){
        fetch(ch.jsonFile)
          .then(res=>res.json())
          .then(data=>{
            const container = document.createElement('div');
            container.className = 'chapter-content-container';
            container.innerHTML += `
              <div class="chapter-titles-container">
                <div class="chapter-title-dutch">${ch.d}</div>
                <div class="chapter-title-arabic">${ch.a}</div>
              </div>
            `;
            for(let verseNum in data["1"].ayahs){
              const verse = data["1"].ayahs[verseNum];
              container.innerHTML += `
                <div class="verse">
                  <p>${verse.arabic}</p>
                  <p>${verse.transliteration}</p>
                  <p>${verse.dutch}</p>
                </div>
              `;
            }
            content.appendChild(container);
            window.scrollTo(0,0);
          })
          .catch(()=>{content.innerHTML='<p>Kon hoofdstuk niet laden.</p>';});
      } else {
        content.innerHTML = ch.c;
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

// Overlay click hides sidebar
overlay.addEventListener('click',()=>{sidebar.classList.add('hide'); setTimeout(resetBG,300);});

// Desktop top buttons
home.addEventListener('click',()=>{ if(!sidebar.classList.contains('open')) content.innerHTML="<h2>Home</h2><p>Dit is de startpagina van de site.</p>"; });
chaptersBtn.addEventListener('click',()=>{
  sidebar.classList.add('open');
  overlay.style.display='block';
  content.style.background='#121212';
  content.style.color='#aaa';
  createChBtns();
});
