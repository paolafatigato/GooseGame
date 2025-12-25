// ============================================
// GAME STATE
// ============================================
let currentCategory = 'base';


// ============================================
// PLAYERS / TOKENS
// ============================================
// TUTTE LE PEDINE DISPONIBILI
const ALL_TOKENS = [
    { id: 1, name: 'Player 1', emoji: '🦆', position: 1 },
    { id: 2, name: 'Player 2', emoji: '🤡', position: 1 },
    { id: 3, name: 'Player 3', emoji: '👻', position: 1 },
    { id: 4, name: 'Player 4', emoji: '🐞', position: 1 },
    { id: 5, name: 'Player 5', emoji: '👽', position: 1 },
    { id: 6, name: 'Player 6', emoji: '🤓', position: 1 },
    { id: 7, name: 'Player 7', emoji: '🦑', position: 1 },
    { id: 8, name: 'Player 8', emoji: '🥸', position: 1 },
    { id: 9, name: 'Player 9', emoji: '💃', position: 1 },
    { id: 10, name: 'Player 10', emoji: '🏃‍♀️‍➡️', position: 1 },
    { id: 11, name: 'Player 11', emoji: '👨‍🦽‍➡️', position: 1 },
    { id: 12, name: 'Player 12', emoji: '🧜‍♀️', position: 1 },
    { id: 13, name: 'Player 13', emoji: '🧚', position: 1 },
    { id: 14, name: 'Player 14', emoji: '🦋', position: 1 },  
    { id: 15, name: 'Player 15', emoji: '🐥', position: 1 },
    { id: 16, name: 'Player 16', emoji: '💩', position: 1 },
    { id: 17, name: 'Player 17', emoji: '🤖', position: 1 },
    { id: 18, name: 'Player 18', emoji: '😸', position: 1 },
    { id: 19, name: 'Player 19', emoji: '🐷', position: 1 },
    { id: 20, name: 'Player 20', emoji: '🐸', position: 1 },
];
// GIOCATORI ATTIVI NELLA PARTITA (riempito dopo la scelta)
let players = [];
let selectedPlayerId = null; // pedina attualmente selezionata

// ============================================
// DOM ELEMENTS
// ============================================
const gameBoard = document.getElementById('gameBoard');
const categorySelect = document.getElementById('categorySelect');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');
const body = document.body; 
const normalTileIndexByCategory = {};// tiene traccia di quale indice dell'array normalTiles abbiamo usato
const tokenSelect = document.getElementById('tokenSelect');
const tokenGrid = document.getElementById('tokenGrid');
const startGameBtn = document.getElementById('startGameBtn');
const boardContainer = document.getElementById('boardContainer');
const decksByCategory = {};// per ogni categoria teniamo tre mazzi


// ============================================
// FUNCTIONS
// ============================================

function renderTokenSelection() {
    tokenGrid.innerHTML = '';

    ALL_TOKENS.forEach(token => {
        const card = document.createElement('div');
        card.className = 'token-card';
        card.dataset.id = token.id;

        const emojiSpan = document.createElement('div');
        emojiSpan.className = 'token-card__emoji';
        emojiSpan.textContent = token.emoji;

        const nameSpan = document.createElement('div');
        nameSpan.className = 'token-card__name';
        nameSpan.textContent = token.name;

        card.appendChild(emojiSpan);
        card.appendChild(nameSpan);

        card.addEventListener('click', () => {
            card.classList.toggle('token-card--selected');
        });

        tokenGrid.appendChild(card);
    });
}

function setupPlayersFromSelectedTokens() {
    const selectedCards = tokenGrid.querySelectorAll('.token-card--selected');
    const chosen = [];

    selectedCards.forEach(card => {
        const id = Number(card.dataset.id);
        const tokenDef = ALL_TOKENS.find(t => t.id === id);
        if (tokenDef) {
            chosen.push({
                id: tokenDef.id,
                name: tokenDef.name,
                emoji: tokenDef.emoji,
                position: 1
            });
        }
    });

    players = chosen;
    selectedPlayerId = null;
}

startGameBtn.addEventListener('click', () => {
    setupPlayersFromSelectedTokens();

    if (players.length === 0) {
        alert('Seleziona almeno una pedina per iniziare.');
        return;
    }

    // Nascondi la selezione e mostra il board
    tokenSelect.style.display = 'none';
    boardContainer.style.display = 'block';

    applyCategoryTheme(currentCategory); // se usi il sistema di palette
    renderBoard();
});

/**
 * Get a random item from an array
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Determine tile type based on tile number
 */
function getTileType(tileNumber) {
    if (QUESTION_TILES.includes(tileNumber)) {
        return 'question';
    }
    if (EVENT_TILES.includes(tileNumber)) {
        return 'event';
    }
    return 'normal';
}

/**
 * Show modal with text
 */
function showModal(text) {
    modalText.textContent = text;
    modal.classList.add('active');
}

/**
 * Hide modal
 */
function hideModal() {
    modal.classList.remove('active');
}




/**
 * Create a single tile element
 */
function createTile(tileNumber) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    const tileType = getTileType(tileNumber);
    tile.classList.add(tileType);

    // Numero casella
    const numberSpan = document.createElement('span');
    numberSpan.className = 'tile-number';
    numberSpan.textContent = tileNumber;
    tile.appendChild(numberSpan);

    const category = CATEGORIES[currentCategory];

    // BOTTONI domanda / imprevisto
    if (tileType === 'question') {
        const button = document.createElement('button');
        button.classList.add('tile-button', 'question-btn');
        button.textContent = '?';
        button.onclick = (e) => {
            //e.stopPropagation(); // non selezionare la pedina per sbaglio
            handleTileClick(tileNumber, tileType);
        };
        tile.appendChild(button);
    } else if (tileType === 'event') {
        const button = document.createElement('button');
        button.classList.add('tile-button', 'event-btn');
        button.textContent = '!';
        button.onclick = (e) => {
           // e.stopPropagation();
            handleTileClick(tileNumber, tileType);
        };
        tile.appendChild(button);
    } else {
        // TESTO caselle normali (come già avevamo impostato)
        if (category.normalTiles && category.normalTiles[tileNumber]) {
            const textDiv = document.createElement('div');
            textDiv.className = 'tile-text';
            textDiv.textContent = category.normalTiles[tileNumber];
            tile.appendChild(textDiv);
        }
    }

    // CLICK SULLA CASELLA: se c'è una pedina selezionata, la muovi qui
        tile.addEventListener('click', () => {
            // 1) se ho una pedina selezionata, la sposto
            if (selectedPlayerId !== null) {
                movePlayerToTile(selectedPlayerId, tileNumber);
                // dopo lo spostamento, puoi decidere se deselezionare:
                // selectedPlayerId = null;
            }

            // 2) poi gestisco l’effetto della casella (question/event)
            if (tileType === 'question' || tileType === 'event') {
                handleTileClick(tileNumber, tileType);
            }
        });


    // RENDER DELLE PEDINE CHE SI TROVANO SU QUESTA CASELLA
    const playersOnThisTile = players.filter(p => p.position === tileNumber);
    if (playersOnThisTile.length > 0) {
        const tokensContainer = document.createElement('div');
        tokensContainer.className = 'tokens-container';

        playersOnThisTile.forEach(p => {
            const token = document.createElement('button');
            token.className = 'player-token';
            token.textContent = p.emoji;
            token.title = p.name;

            // click sulla pedina = seleziona questa pedina per il prossimo movimento
            token.addEventListener('click', (e) => {
                e.stopPropagation(); // non far scattare il click della casella
                selectedPlayerId = p.id;
                highlightSelectedPlayer();
            });

            tokensContainer.appendChild(token);
        });

        tile.appendChild(tokensContainer);
    }

    return tile;
}

function movePlayerToTile(playerId, tileNumber) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    player.position = tileNumber;
    selectedPlayerId = null;
    renderBoard();

    const category = CATEGORIES[currentCategory];

    // se vuoi escludere start/arrivo:
    if (tileNumber === category.startTile || tileNumber === category.endTile) {
        return;
    }

    const tileType = getTileType(tileNumber);
    let text = null;

    if (tileType === 'question') {
        text = getNextFromDeck(currentCategory, 'question');
    } else if (tileType === 'event') {
        text = getNextFromDeck(currentCategory, 'event');
    } else {
        text = getNextFromDeck(currentCategory, 'normal');
    }

    if (text) {
        showModal(text);
    }
}


function highlightSelectedPlayer() {
    // semplice: per ora non facciamo highlight CSS, solo rerender se ti serve
    renderBoard();
}


/**
 * Render the game board with serpentine layout
 */
function renderBoard() {
    gameBoard.innerHTML = '';
    
    // Create 63 tiles in serpentine order
    const tiles = [];
    for (let i = 1; i <= 63; i++) {
        tiles.push(createTile(i));
    }

    // Arrange tiles in serpentine pattern (9 columns)
    const COLS = 9;
    const rows = Math.ceil(63 / COLS);
    
    for (let row = 0; row < rows; row++) {
        const startIdx = row * COLS;
        const endIdx = Math.min(startIdx + COLS, 63);
        const rowTiles = tiles.slice(startIdx, endIdx);
        
        // Reverse every other row for serpentine effect
        if (row % 2 === 1) {
            rowTiles.reverse();
        }
        
        rowTiles.forEach(tile => gameBoard.appendChild(tile));
    }
}

/**
 * Aggiorna la classe del body in base alla categoria corrente
 * (es: category-base, category-rivers, ...)
 */
function updateBodyCategoryClass() {
    // Rimuovi eventuali vecchie classi categoria
    body.classList.forEach(cls => {
        if (cls.startsWith('category-')) {
            body.classList.remove(cls);
        }
    });

    // Aggiungi la nuova
    body.classList.add(`category-${currentCategory}`);
}

/**
 * Handle category change
 */
function changeCategory(newCategory) {
    currentCategory = newCategory;
    applyCategoryTheme(newCategory);  // aggiorna i colori
    updateBodyCategoryClass();        // se vuoi ancora la classe sul body
    renderBoard();
}


function applyCategoryTheme(categoryKey) {
    const root = document.documentElement;
    const prefixMap = {
        base: 'base',
        rivers: 'rivers',
        leopardi: 'leopardi',
        gettingToKnow: 'gtk'
    };
    const p = prefixMap[categoryKey];

    if (!p) return;

    const set = (generic, catName) => {
        const value = getComputedStyle(root).getPropertyValue(`--${p}-${catName}`).trim();
        if (value) {
            root.style.setProperty(`--${generic}`, value);
        }
    };

    set('body-bg', 'body-bg');
    set('body-text', 'body-text');
    set('header-bg', 'header-bg');
    set('header-text', 'header-text');
    set('tile-border', 'tile-border');
    set('tile-bg-normal', 'tile-bg-normal');
    set('tile-bg-default', 'tile-bg-default');
    set('btn-question-bg', 'btn-question-bg');
    set('btn-question-text', 'btn-question-text');
    set('btn-event-bg', 'btn-event-bg');
    set('btn-event-text', 'btn-event-text');
    set('modal-overlay', 'modal-overlay');
    set('modal-bg', 'modal-bg');
    set('modal-border', 'modal-border');
    set('modal-btn-bg', 'modal-btn-bg');
    set('modal-btn-text', 'modal-btn-text');
}

// ============================================
// EVENT LISTENERS
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
    // deckType: 'normal', 'question', 'event'
    if (!decksByCategory[categoryKey]) {
        decksByCategory[categoryKey] = {};
    }

    const catDecks = decksByCategory[categoryKey];

    if (!catDecks[deckType] || catDecks[deckType].length === 0) {
        // ricrea il mazzo mescolato a partire dal contenuto originale
        const srcCategory = CATEGORIES[categoryKey];
        let sourceArray = [];

        if (deckType === 'normal') sourceArray = srcCategory.normalContents || [];
        if (deckType === 'question') sourceArray = srcCategory.questions || [];
        if (deckType === 'event') sourceArray = srcCategory.events || [];

        catDecks[deckType] = shuffleArray(sourceArray);
    }

    if (!catDecks[deckType] || catDecks[deckType].length === 0) {
        return null; // nessun contenuto definito
    }

    // prendi il primo elemento del mazzo e toglilo
    return catDecks[deckType].shift();
}

// Category selector change
categorySelect.addEventListener('change', (e) => {
    changeCategory(e.target.value);
});

// Modal close button
modalClose.addEventListener('click', hideModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

// ============================================
// INITIALIZATION
// ============================================
applyCategoryTheme(currentCategory); // per avere già i colori
renderTokenSelection();             // mostra la scelta pedine
// NON chiamare renderBoard() qui, verrà chiamato dopo "Inizia partita"
