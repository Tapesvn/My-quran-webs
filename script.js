const home = document.getElementById('home-button'),
      chaptersBtn = document.getElementById('hoofdstukken-button'),
      sidebar = document.getElementById('chapter-sidebar'),
      overlay = document.getElementById('overlay'),
      content = document.getElementById('content-area'),
      mobileMenuPanel = document.getElementById('mobile-menu-panel');

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
  {n:2,d:"De Koe",t:"(EL' BAQARA')",a:"سُورَةُ البَقَرَةِ",c:"<h2>De Koe</h2><p>Inhoud...</p>"},
  {n:3,d:"Familie Van Amram",t:"(AALI EM'RAAN)",a:"سُورَةُ آلِ عِمۡرَانَ",c:"<h2>Familie Van Amram</h2><p>Inhoud...</p>"}
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

    btn.onclick=()=>{
      resetBG();
      content.innerHTML=""; // clear content
      const container = document.createElement('div');
      container.className='chapter-content-container';
      content.appendChild(container);

      if(ch.jsonFile){
        fetch(ch.jsonFile)
          .then(res=>res.json())
          .then(data=>{
            const titles = document.createElement('div');
            titles.className='chapter-titles-container';
            titles.innerHTML = `<div class="chapter-title-dutch">${ch.d}</div>
                                <div class="chapter-title-arabic">${ch.a}</div>`;
            container.appendChild(titles);

            for(let verseNum in data["1"].ayahs){
              const verse = data["1"].ayahs[verseNum];
              const v = document.createElement('div');
              v.className='verse';
              v.innerHTML = `<p>${verse.arabic}</p>
                             <p>${verse.transliteration}</p>
                             <p>${verse.dutch}</p>`;
              container.appendChild(v);
            }
            window.scrollTo(0,0);
          })
          .catch(()=>{container.innerHTML='<p>Kon hoofdstuk niet laden.</p>';});
      } else {
        container.innerHTML = ch.c;
      }
    };

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

overlay.addEventListener('click',()=>{sidebar.classList.add('hide'); setTimeout(resetBG,300)});

home.addEventListener('click',()=>{
  if(!sidebar.classList.contains('open')){
    content.innerHTML="<h2>Home</h2><p>Dit is de startpagina van de site.</p>";
  }
});

// Desktop hoofdstukken
chaptersBtn.addEventListener('click',()=>{
  sidebar.classList.add('open');
  overlay.style.display='block';
  createChBtns();
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger-button');
hamburger.addEventListener('click',()=>{
  mobileMenuPanel.style.display='flex';
  mobileMenuPanel.innerHTML = `<button id="home-mobile">Home</button>
                               <button id="chapters-mobile">Hoofdstukken</button>`;
  document.getElementById('home-mobile').onclick = ()=> { content.innerHTML="<h2>Home</h2><p>Startpagina</p>"; mobileMenuPanel.style.display='none'; };
  document.getElementById('chapters-mobile').onclick = ()=> { createChBtns(); mobileMenuPanel.style.display='none'; sidebar.classList.add('open'); overlay.style.display='block'; };
});
