const homeButton = document.getElementById('home-button');
const hoofdstukkenButton = document.getElementById('hoofdstukken-button');
const sidebar = document.getElementById('chapter-sidebar');
const overlay = document.getElementById('overlay');
const contentArea = document.getElementById('content-area');

function clearChapters() {
  sidebar.innerHTML = '';
}

function createChapterButton(number, dutchName, transliteration, arabicName, onClick, isFirst=false) {
  const button = document.createElement('button');
  button.className = 'chapter-button';
  if (isFirst) button.classList.add('first-chapter');
  button.onclick = onClick;

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';

  const numberSpan = document.createElement('span');
  numberSpan.className = 'number';
  numberSpan.textContent = number;
  rowDiv.appendChild(numberSpan);

  const textColumn = document.createElement('div');
  textColumn.className = 'text-column';

  const arabicSpan = document.createElement('span');
  arabicSpan.className = 'arabic';
  arabicSpan.textContent = arabicName;
  textColumn.appendChild(arabicSpan);

  const dutchTranslitDiv = document.createElement('div');
  dutchTranslitDiv.className = 'dutch-translit';

  const dutchSpan = document.createElement('span');
  dutchSpan.textContent = dutchName;
  dutchTranslitDiv.appendChild(dutchSpan);

  const translitSpan = document.createElement('span');
  translitSpan.className = 'transliteration';
  translitSpan.textContent = transliteration;
  dutchTranslitDiv.appendChild(translitSpan);

  textColumn.appendChild(dutchTranslitDiv);
  rowDiv.appendChild(textColumn);
  button.appendChild(rowDiv);
  sidebar.appendChild(button);
}

function openSidebar() {
  sidebar.style.display = 'block';
  overlay.style.display = 'block';
  contentArea.style.backgroundColor = '#121212';
  contentArea.style.color = '#aaaaaa';
}

function closeSidebar() {
  sidebar.style.display = 'none';
  overlay.style.display = 'none';
  contentArea.style.backgroundColor = '#2b2b2b';
  contentArea.style.color = 'white';
}

homeButton.addEventListener('click', closeSidebar);

hoofdstukkenButton.addEventListener('click', () => {
  openSidebar();
  clearChapters();

  const headerDiv = document.createElement('div');
  headerDiv.id = 'chapter-header';
  headerDiv.textContent = "Het Boek Van God";

  const closeBtn = document.createElement('span');
  closeBtn.id = 'close-chapters';
  closeBtn.textContent = '×';
  closeBtn.onclick = closeSidebar;

  headerDiv.appendChild(closeBtn);
  sidebar.appendChild(headerDiv);

  createChapterButton(1, "De Opener", "(EL' FAATIHA')", "سُورَةُ ٱلْفَاتِحَةِ", () => {
    contentArea.innerHTML = `<h2>De Opener</h2><p>Bismillah ir-Rahman ir-Rahim...</p>`;
  }, true);

  createChapterButton(2, "De Koe", "(EL' BAQARA')", "سُورَةُ البَقَرَةِ", () => {
    contentArea.innerHTML = `<h2>De Koe</h2><p>Inhoud van Surah Al-Baqara komt hier...</p>`;
  });

  createChapterButton(3, "Familie Van Amram", "(AALI EM'RAAN)", "سُورَةُ آلِ عِمۡرَانَ", () => {
    contentArea.innerHTML = `<h2>Familie Van Amram</h2><p>Inhoud van Surah Aal-Imran komt hier...</p>`;
  });
});
