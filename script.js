const home = document.getElementById('home-button'),
      chaptersBtn = document.getElementById('hoofdstukken-button'),
      sidebar = document.getElementById('chapter-sidebar'),
      overlay = document.getElementById('overlay'),
      content = document.getElementById('content-area');

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

overlay.addEventListener('click',()=>{sidebar.classList.add('hide'); setTimeout(resetBG,300)});
home.addEventListener('click',()=>{if(!sidebar.classList.contains('open')) content.innerHTML="<h2>Home</h2><p>Dit is de startpagina van de site.</p>"});
chaptersBtn.addEventListener('click',()=>{
  sidebar.classList.add('open');
  overlay.style.display='block';
  content.style.background='#121212';
  content.style.color='#aaa';
  createChBtns();
});
