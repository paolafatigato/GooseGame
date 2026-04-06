// ============================================
// GAME STATE
// ============================================
let currentCategory = 'gettingToKnow';

// ============================================
// PLAYERS / TOKENS
// ============================================
const ALL_TOKENS = [
    { id: 1,  name: 'Player 1',  emoji: '🦆' },
    { id: 2,  name: 'Player 2',  emoji: '🤡' },
    { id: 3,  name: 'Player 3',  emoji: '👻' },
    { id: 4,  name: 'Player 4',  emoji: '🐞' },
    { id: 5,  name: 'Player 5',  emoji: '👽' },
    { id: 6,  name: 'Player 6',  emoji: '🤓' },
    { id: 7,  name: 'Player 7',  emoji: '🦑' },
    { id: 8,  name: 'Player 8',  emoji: '🦝' },
    { id: 9,  name: 'Player 9',  emoji: '💃' },
    { id: 10, name: 'Player 10', emoji: '🏃‍♀️‍➡️' },
    { id: 11, name: 'Player 11', emoji: '👨‍🦽‍➡️' },
    { id: 12, name: 'Player 12', emoji: '🧜‍♀️' },
    { id: 13, name: 'Player 13', emoji: '🧚' },
    { id: 14, name: 'Player 14', emoji: '🦋' },
    { id: 15, name: 'Player 15', emoji: '🐥' },
    { id: 16, name: 'Player 16', emoji: '💩' },
    { id: 17, name: 'Player 17', emoji: '🤖' },
    { id: 18, name: 'Player 18', emoji: '😸' },
    { id: 19, name: 'Player 19', emoji: '🐷' },
    { id: 20, name: 'Player 20', emoji: '🐸' },
];

let players = [];
let selectedPlayerId = null;

// ============================================
// DOM ELEMENTS
// ============================================
const gameBoard       = document.getElementById('gameBoard');
const categorySelect  = document.getElementById('categorySelect');
const modal           = document.getElementById('modal');
const modalText       = document.getElementById('modalText');
const modalClose      = document.getElementById('modalClose');
const body            = document.body;
const tokenSelect     = document.getElementById('tokenSelect');
const tokenGrid       = document.getElementById('tokenGrid');
const startGameBtn    = document.getElementById('startGameBtn');
const boardContainer  = document.getElementById('boardContainer');
const gameSelect      = document.getElementById('gameSelect');
const gameGrid        = document.getElementById('gameGrid');
const gameSearch      = document.getElementById('gameSearch');
const clearSearch     = document.getElementById('clearSearch');
const noResults       = document.getElementById('noResults');
const homeBtn         = document.getElementById('homeBtn');
const printBtn        = document.getElementById('printBtn');

const normalTileIndexByCategory = {};
const decksByCategory = {};

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenId) {
    // Hide all screens
    ['gameSelect', 'tokenSelect', 'boardContainer'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';

    // Manage header controls visibility
    const onBoard = screenId === 'boardContainer';
    const onHome  = screenId === 'gameSelect';

    homeBtn.style.display       = onHome  ? 'none'  : 'flex';
    printBtn.style.display      = onBoard ? 'flex'  : 'none';
    categorySelect.style.display = onBoard ? 'block' : 'none';
}

// ============================================
// GAME SELECTION SCREEN
// ============================================
function renderGameSelection() {
    gameGrid.innerHTML = '';
    const query = (gameSearch.value || '').toLowerCase().trim();

    const entries = Object.entries(CATEGORIES);
    let visibleCount = 0;

    entries.forEach(([key, cat]) => {
        const meta = cat.meta || {};
        const searchText = (cat.name + ' ' + (meta.subtitle || '') + ' ' + (meta.description || '')).toLowerCase();

        if (query && !searchText.includes(query)) return;
        visibleCount++;

        const card = document.createElement('div');
        card.className = 'game-card';
        card.style.background  = meta.gradient  || 'linear-gradient(135deg,#333,#666)';
        card.style.color       = meta.textColor || '#fff';

        card.innerHTML = `
            <div class="game-card__emoji">${meta.emoji || '🎲'}</div>
            <div class="game-card__body">
                <div class="game-card__name">${cat.name}</div>
                <div class="game-card__subtitle">${meta.subtitle || ''}</div>
                <div class="game-card__desc">${meta.description || ''}</div>
            </div>
            <div class="game-card__footer">
                <span class="game-card__count">
                    ${cat.questions.length} domande · ${cat.events.length} imprevisti
                </span>
                <span class="game-card__cta" style="background:${meta.accentColor || 'rgba(255,255,255,0.25)'}; color:${meta.textColor || '#fff'}">
                    Gioca →
                </span>
            </div>
        `;

        card.addEventListener('click', () => selectGame(key));
        gameGrid.appendChild(card);
    });

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

function selectGame(categoryKey) {
    currentCategory = categoryKey;
    if (categorySelect) categorySelect.value = categoryKey;
    applyCategoryTheme(categoryKey);
    updateBodyCategoryClass();
    renderTokenSelection();
    showScreen('tokenSelect');
}

// ============================================
// TOKEN SELECTION SCREEN
// ============================================
function renderTokenSelection() {
    tokenGrid.innerHTML = '';

    ALL_TOKENS.forEach(token => {
        const card = document.createElement('div');
        card.className = 'token-card';
        card.dataset.id = token.id;

        card.innerHTML = `
            <div class="token-card__emoji">${token.emoji}</div>
            <div class="token-card__name">${token.name}</div>
        `;

        card.addEventListener('click', () => card.classList.toggle('token-card--selected'));
        tokenGrid.appendChild(card);
    });
}

function setupPlayersFromSelectedTokens() {
    const selectedCards = tokenGrid.querySelectorAll('.token-card--selected');
    players = [];

    selectedCards.forEach(card => {
        const id = Number(card.dataset.id);
        const tokenDef = ALL_TOKENS.find(t => t.id === id);
        if (tokenDef) {
            players.push({ id: tokenDef.id, name: tokenDef.name, emoji: tokenDef.emoji, position: 1 });
        }
    });

    selectedPlayerId = null;
}

startGameBtn.addEventListener('click', () => {
    setupPlayersFromSelectedTokens();
    if (players.length === 0) {
        alert('Seleziona almeno una pedina per iniziare.');
        return;
    }
    applyCategoryTheme(currentCategory);
    updateBodyCategoryClass();
    renderBoard();
    showScreen('boardContainer');
});

// ============================================
// SEARCH
// ============================================
gameSearch.addEventListener('input', () => {
    const hasValue = gameSearch.value.length > 0;
    clearSearch.style.display = hasValue ? 'flex' : 'none';
    renderGameSelection();
});

clearSearch.addEventListener('click', () => {
    gameSearch.value = '';
    clearSearch.style.display = 'none';
    renderGameSelection();
    gameSearch.focus();
});

// ============================================
// HOME BUTTON
// ============================================
homeBtn.addEventListener('click', () => {
    showScreen('gameSelect');
    renderGameSelection();
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getTileType(tileNumber) {
    if (QUESTION_TILES.includes(tileNumber)) return 'question';
    if (EVENT_TILES.includes(tileNumber))   return 'event';
    return 'normal';
}

function showModal(text) {
    modalText.textContent = text;
    modal.classList.add('active');
}

function hideModal() {
    modal.classList.remove('active');
}

// ============================================
// BOARD RENDERING
// ============================================
function createTile(tileNumber) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    const tileType = getTileType(tileNumber);
    tile.classList.add(tileType);

    const numberSpan = document.createElement('span');
    numberSpan.className = 'tile-number';
    numberSpan.textContent = tileNumber;
    tile.appendChild(numberSpan);

    const category = CATEGORIES[currentCategory];

    if (tileType === 'question') {
        const button = document.createElement('button');
        button.classList.add('tile-button', 'question-btn');
        button.textContent = '?';
        button.onclick = () => handleTileClick(tileNumber, tileType);
        tile.appendChild(button);
    } else if (tileType === 'event') {
        const button = document.createElement('button');
        button.classList.add('tile-button', 'event-btn');
        button.textContent = '!';
        button.onclick = () => handleTileClick(tileNumber, tileType);
        tile.appendChild(button);
    } else {
        if (category.normalTiles && category.normalTiles[tileNumber]) {
            const textDiv = document.createElement('div');
            textDiv.className = 'tile-text';
            textDiv.textContent = category.normalTiles[tileNumber];
            tile.appendChild(textDiv);
        }
    }

    tile.addEventListener('click', () => {
        if (selectedPlayerId !== null) {
            movePlayerToTile(selectedPlayerId, tileNumber);
        }
        if (tileType === 'question' || tileType === 'event') {
            handleTileClick(tileNumber, tileType);
        }
    });

    // Render tokens on this tile
    const playersOnThisTile = players.filter(p => p.position === tileNumber);
    if (playersOnThisTile.length > 0) {
        const tokensContainer = document.createElement('div');
        // Use scrollable container for start tile or when crowded
        tokensContainer.className = 'tokens-container' + (tileNumber === 1 ? ' tokens-container--start' : '');

        playersOnThisTile.forEach(p => {
            const token = document.createElement('button');
            token.className = 'player-token';
            if (p.id === selectedPlayerId) token.classList.add('player-token--selected');
            token.textContent = p.emoji;
            token.title = p.name;

            token.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedPlayerId = (selectedPlayerId === p.id) ? null : p.id;
                highlightSelectedPlayer();
            });

            tokensContainer.appendChild(token);
        });

        tile.appendChild(tokensContainer);
    }

    return tile;
}

function handleTileClick(tileNumber, tileType) {
    // This is called when the tile button is clicked directly
    // (without a player being moved). Just show a card.
    if (selectedPlayerId === null) {
        const text = getNextFromDeck(currentCategory, tileType);
        if (text) showModal(text);
    }
}

function movePlayerToTile(playerId, tileNumber) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    player.position = tileNumber;
    selectedPlayerId = null;
    renderBoard();

    const category = CATEGORIES[currentCategory];
    if (tileNumber === 1 || tileNumber === 63) return;

    const tileType = getTileType(tileNumber);
    const text = getNextFromDeck(currentCategory, tileType === 'question' ? 'question' : tileType === 'event' ? 'event' : 'normal');
    if (text) showModal(text);
}

function highlightSelectedPlayer() {
    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = '';

    const tiles = [];
    for (let i = 1; i <= 63; i++) tiles.push(createTile(i));

    const COLS = 9;
    const rows = Math.ceil(63 / COLS);

    for (let row = 0; row < rows; row++) {
        const startIdx = row * COLS;
        const endIdx   = Math.min(startIdx + COLS, 63);
        const rowTiles = tiles.slice(startIdx, endIdx);
        if (row % 2 === 1) rowTiles.reverse();
        rowTiles.forEach(tile => gameBoard.appendChild(tile));
    }
}

// ============================================
// THEME & CATEGORY
// ============================================
function updateBodyCategoryClass() {
    body.classList.forEach(cls => {
        if (cls.startsWith('category-')) body.classList.remove(cls);
    });
    body.classList.add(`category-${currentCategory}`);
}

function changeCategory(newCategory) {
    currentCategory = newCategory;
    applyCategoryTheme(newCategory);
    updateBodyCategoryClass();
    renderBoard();
}

function applyCategoryTheme(categoryKey) {
    const root = document.documentElement;
    const prefixMap = { rivers: 'rivers', leopardi: 'leopardi', gettingToKnow: 'gtk' };
    const p = prefixMap[categoryKey];
    if (!p) return;

    const set = (generic, catName) => {
        const value = getComputedStyle(root).getPropertyValue(`--${p}-${catName}`).trim();
        if (value) root.style.setProperty(`--${generic}`, value);
    };

    set('body-bg',          'body-bg');
    set('body-text',        'body-text');
    set('header-bg',        'header-bg');
    set('header-text',      'header-text');
    set('tile-border',      'tile-border');
    set('tile-bg-normal',   'tile-bg-normal');
    set('tile-bg-default',  'tile-bg-default');
    set('btn-question-bg',  'btn-question-bg');
    set('btn-question-text','btn-question-text');
    set('btn-event-bg',     'btn-event-bg');
    set('btn-event-text',   'btn-event-text');
    set('modal-overlay',    'modal-overlay');
    set('modal-bg',         'modal-bg');
    set('modal-border',     'modal-border');
    set('modal-btn-bg',     'modal-btn-bg');
    set('modal-btn-text',   'modal-btn-text');
}

// ============================================
// DECK MANAGEMENT
// ============================================
function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getNextFromDeck(categoryKey, deckType) {
    if (!decksByCategory[categoryKey]) decksByCategory[categoryKey] = {};
    const catDecks = decksByCategory[categoryKey];

    if (!catDecks[deckType] || catDecks[deckType].length === 0) {
        const srcCategory = CATEGORIES[categoryKey];
        let sourceArray = [];
        if (deckType === 'normal')    sourceArray = srcCategory.normalContents || [];
        if (deckType === 'question')  sourceArray = srcCategory.questions || [];
        if (deckType === 'event')     sourceArray = srcCategory.events || [];
        catDecks[deckType] = shuffleArray(sourceArray);
    }

    if (!catDecks[deckType] || catDecks[deckType].length === 0) return null;
    return catDecks[deckType].shift();
}

// ============================================
// PRINT FUNCTION
// ============================================
function printBoard() {
    const category = CATEGORIES[currentCategory];
    const meta     = category.meta || {};

    // Build serpentine tile order
    const COLS = 9;
    const rows = Math.ceil(63 / COLS);
    const serpentineRows = [];
    for (let row = 0; row < rows; row++) {
        const start = row * COLS;
        const end   = Math.min(start + COLS, 63);
        let rowTiles = [];
        for (let i = start; i < end; i++) rowTiles.push(i + 1);
        if (row % 2 === 1) rowTiles.reverse();
        serpentineRows.push(rowTiles);
    }

    // Assign content to normal tiles sequentially
    const normalContentsAssigned = {};
    let normalIdx = 0;
    for (let i = 1; i <= 63; i++) {
        if (!QUESTION_TILES.includes(i) && !EVENT_TILES.includes(i) && i !== 1 && i !== 63) {
            normalContentsAssigned[i] = category.normalContents[normalIdx % category.normalContents.length];
            normalIdx++;
        }
    }

    // Build board tiles HTML
    let boardRowsHTML = '';
    serpentineRows.forEach(row => {
        let rowHTML = '';
        row.forEach(tileNum => {
            let cls = '';
            let icon = '';
            let content = '';

            if (tileNum === 1) {
                cls = 'p-start'; icon = '🏁'; content = 'START';
            } else if (tileNum === 63) {
                cls = 'p-end'; icon = '🏆'; content = 'FINISH';
            } else if (QUESTION_TILES.includes(tileNum)) {
                cls = 'p-question'; icon = '?'; content = '';
            } else if (EVENT_TILES.includes(tileNum)) {
                cls = 'p-event'; icon = '!'; content = '';
            } else {
                cls = 'p-normal'; content = normalContentsAssigned[tileNum] || '';
            }

            rowHTML += `<div class="p-tile ${cls}">
                <span class="p-num">${tileNum}</span>
                <span class="p-icon">${icon}</span>
                <span class="p-content">${content}</span>
            </div>`;
        });
        boardRowsHTML += `<div class="p-row">${rowHTML}</div>`;
    });

    // Build question cards
    const buildCards = (arr, type) => arr.map((text, i) => `
        <div class="p-card p-card--${type}">
            <div class="p-card-header">${type === 'question' ? '?' : '!'} Carta ${i + 1}</div>
            <div class="p-card-body">${text}</div>
        </div>
    `).join('');

    const questionCardsHTML = buildCards(category.questions, 'question');
    const eventCardsHTML    = buildCards(category.events, 'event');

    const accentQ = meta.accentColor || '#007bff';
    const accentE = '#FF4B4A';

    const printHTML = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>GooseGame – ${category.name} – Stampa</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 9px; background: #fff; color: #111; }

  /* ---- TITLE ---- */
  .p-header { text-align: center; margin-bottom: 6mm; }
  .p-header h1 { font-size: 18px; letter-spacing: 2px; }
  .p-header p  { font-size: 10px; color: #555; }

  /* ---- BOARD ---- */
  .p-board { display: flex; flex-direction: column; gap: 2px; }
  .p-row   { display: flex; gap: 2px; }
  .p-tile  {
    flex: 1; min-width: 0;
    border: 1px solid #bbb;
    border-radius: 4px;
    padding: 2px 2px 3px;
    display: flex; flex-direction: column;
    min-height: 22mm;
    overflow: hidden;
  }
  .p-num     { font-size: 7px; font-weight: bold; color: #666; line-height: 1; }
  .p-icon    { font-size: 14px; text-align: center; line-height: 1.2; }
  .p-content { font-size: 6.5px; line-height: 1.3; text-align: center; margin-top: 2px; }

  .p-start    { background: #ffe082; border-color: #f9a825; }
  .p-end      { background: #a5d6a7; border-color: #2e7d32; }
  .p-question { background: #bbdefb; border-color: #1565c0; }
  .p-event    { background: #ffcdd2; border-color: #b71c1c; }
  .p-normal   { background: #f5f5f5; }

  /* ---- PAGE BREAK ---- */
  .pagebreak { page-break-before: always; break-before: page; }

  /* ---- CARDS SECTION ---- */
  .p-section-title {
    font-size: 14px; font-weight: bold;
    text-align: center; margin: 4mm 0 3mm;
    letter-spacing: 1px;
  }
  .p-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4mm;
  }
  .p-card {
    border: 2px dashed #aaa;
    border-radius: 6px;
    padding: 4mm;
    min-height: 35mm;
    display: flex; flex-direction: column;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-card--question { border-color: #1565c0; background: #e3f2fd; }
  .p-card--event    { border-color: #b71c1c; background: #ffebee; }
  .p-card-header {
    font-size: 8px; font-weight: bold;
    letter-spacing: 1px; margin-bottom: 3mm;
    text-transform: uppercase; opacity: 0.7;
  }
  .p-card--question .p-card-header { color: #1565c0; }
  .p-card--event    .p-card-header { color: #b71c1c; }
  .p-card-body { font-size: 9px; line-height: 1.5; flex: 1; }

  /* ---- LEGEND ---- */
  .p-legend {
    display: flex; gap: 4mm;
    justify-content: center;
    margin-bottom: 3mm; flex-wrap: wrap;
  }
  .p-legend-item { display: flex; align-items: center; gap: 2mm; font-size: 8px; }
  .p-legend-dot  { width: 8px; height: 8px; border-radius: 2px; }
</style>
</head>
<body>

<div class="p-header">
  <h1>🪿 GOOSEGAME — ${category.name.toUpperCase()}</h1>
  <p>Tabellone stampabile · Ms Fatigato</p>
</div>

<div class="p-legend">
  <div class="p-legend-item"><div class="p-legend-dot" style="background:#bbdefb;border:1px solid #1565c0"></div> Casella Domanda (?)</div>
  <div class="p-legend-item"><div class="p-legend-dot" style="background:#ffcdd2;border:1px solid #b71c1c"></div> Imprevisto (!)</div>
  <div class="p-legend-item"><div class="p-legend-dot" style="background:#f5f5f5;border:1px solid #bbb"></div> Casella Normale</div>
</div>

<div class="p-board">${boardRowsHTML}</div>

<div class="pagebreak"></div>
<p class="p-section-title">🃏 Carte Domanda — ${category.name}</p>
<p style="text-align:center; font-size:8px; color:#555; margin-bottom:4mm">Taglia lungo la linea tratteggiata · ${category.questions.length} carte</p>
<div class="p-cards">${questionCardsHTML}</div>

<div class="pagebreak"></div>
<p class="p-section-title">⚡ Carte Imprevisto — ${category.name}</p>
<p style="text-align:center; font-size:8px; color:#555; margin-bottom:4mm">Taglia lungo la linea tratteggiata · ${category.events.length} carte</p>
<div class="p-cards">${eventCardsHTML}</div>

<script>
  window.onload = function() { window.print(); };
<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    win.document.write(printHTML);
    win.document.close();
}

// ============================================
// EVENT LISTENERS
// ============================================
categorySelect.addEventListener('change', (e) => changeCategory(e.target.value));
modalClose.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
printBtn.addEventListener('click', printBoard);

// ============================================
// INITIALIZATION
// ============================================
applyCategoryTheme(currentCategory);
renderGameSelection();
showScreen('gameSelect');