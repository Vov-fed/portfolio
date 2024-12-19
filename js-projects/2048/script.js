
const boardElement = document.querySelector('.board');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const messageContainer = document.createElement('div'); // Container for the winning message

let boardValues = [];
let score = 0;
let gameWon = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize the game
function initializeGame() {
    boardValues = Array(4)
        .fill(0)
        .map(() => Array(4).fill(0));
    score = 0;
    gameWon = false;
    updateScore();
    createBoard();
    addRandomTile();
    addRandomTile();
    renderBoard();
    hideWinningMessage();
}

// Create the board in DOM
function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-pos', `${i}-${j}`);
            boardElement.appendChild(cell);
        }
    }
}

// Add a random tile to the board
function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (boardValues[i][j] === 0) emptyCells.push({ x: i, y: j });
        }
    }
    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.9 ? 2 : 4;
    boardValues[randomCell.x][randomCell.y] = randomValue;
}

// Render the board with animations
function renderBoard(previousBoard = null) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.querySelector(`[data-pos="${i}-${j}"]`);
            const value = boardValues[i][j];
            cell.textContent = value === 0 ? '' : value;
            cell.style.backgroundColor = getTileColor(value);
            cell.classList.remove('new', 'merge');

            // Add animations
            if (previousBoard) {
                if (previousBoard[i][j] === 0 && value !== 0) {
                    cell.classList.add('new');
                } else if (previousBoard[i][j] !== value && value !== 0) {
                    cell.classList.add('merge');
                }
            }

            // Check for winning tile
            if (value === 2048 && !gameWon) {
                gameWon = true;
                displayWinningMessage();
            }
        }
    }
}

// Tile color mapping
function getTileColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };
    return colors[value] || '#cdc1b4';
}

// Handle movement
function move(direction) {
    const previousBoard = JSON.parse(JSON.stringify(boardValues));
    if (direction === 'ArrowUp') moveUp();
    if (direction === 'ArrowDown') moveDown();
    if (direction === 'ArrowLeft') moveLeft();
    if (direction === 'ArrowRight') moveRight();

    if (didBoardChange(previousBoard, boardValues)) {
        addRandomTile();
        renderBoard(previousBoard);
        if (isGameOver()) {
            setTimeout(() => alert('Game Over!'), 200);
        }
    }
}

// Movement logic
function moveUp() {
    for (let j = 0; j < 4; j++) {
        let values = [];
        for (let i = 0; i < 4; i++) {
            if (boardValues[i][j] !== 0) values.push(boardValues[i][j]);
        }
        values = mergeValues(values);
        for (let i = 0; i < 4; i++) {
            boardValues[i][j] = values[i] || 0;
        }
    }
}

function moveDown() {
    for (let j = 0; j < 4; j++) {
        let values = [];
        for (let i = 3; i >= 0; i--) {
            if (boardValues[i][j] !== 0) values.push(boardValues[i][j]);
        }
        values = mergeValues(values);
        for (let i = 3; i >= 0; i--) {
            boardValues[i][j] = values[3 - i] || 0;
        }
    }
}

function moveLeft() {
    for (let i = 0; i < 4; i++) {
        let values = [];
        for (let j = 0; j < 4; j++) {
            if (boardValues[i][j] !== 0) values.push(boardValues[i][j]);
        }
        values = mergeValues(values);
        for (let j = 0; j < 4; j++) {
            boardValues[i][j] = values[j] || 0;
        }
    }
}

function moveRight() {
    for (let i = 0; i < 4; i++) {
        let values = [];
        for (let j = 3; j >= 0; j--) {
            if (boardValues[i][j] !== 0) values.push(boardValues[i][j]);
        }
        values = mergeValues(values);
        for (let j = 3; j >= 0; j--) {
            boardValues[i][j] = values[3 - j] || 0;
        }
    }
}

// Merge tiles
function mergeValues(values) {
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
            values[i] *= 2;
            score += values[i];
            document.getElementById('score').textContent = score;
            values[i + 1] = 0;
        }
    }
    return values.filter(v => v).concat(Array(4).fill(0).slice(values.length));
}

// Check if the board changed after a move
function didBoardChange(prev, curr) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (prev[i][j] !== curr[i][j]) return true;
        }
    }
    return false;
}

// Check if the game is over
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (boardValues[i][j] === 0) return false;
            if (j < 3 && boardValues[i][j] === boardValues[i][j + 1]) return false;
            if (i < 3 && boardValues[i][j] === boardValues[i + 1][j]) return false;
        }
    }
    return true;
}

// Update the score
function updateScore() {
    scoreElement.textContent = score;
}

// Winning Message
function displayWinningMessage() {
    messageContainer.classList.add('win-message');
    messageContainer.innerHTML = `<div class="message-content">🎉 Congratulations! You Win! 🎉</div><div id="continue" class="continue">Continue</div>`;
    document.body.appendChild(messageContainer);
    setTimeout(() => messageContainer.classList.add('visible'), 100);
    document.getElementById('continue').addEventListener('click', () => {
        hideWinningMessage();
        fireworks.stopAnimation();
    }
    );
    const fireworks = new FireworksOverlay({
        colors: ['#FF0000', '#00FF00', '#0000FF'],
        particleCount: 150,
        gravity: 0.05,
        speed: { min: 3, max: 8 },
        radius: { min: 2, max: 5 },
        interval: 500,
        zIndex: 10000
    });
    fireworks.startAnimation();
}

// Hide Winning Message
function hideWinningMessage() {
        messageContainer.classList.remove('visible');
        if (document.body.contains(messageContainer)) {
            document.body.removeChild(messageContainer);
        }
}

// Touch Event Handlers
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30) move('ArrowRight');
        if (deltaX < -30) move('ArrowLeft');
    } else {
        if (deltaY > 30) move('ArrowDown');
        if (deltaY < -30) move('ArrowUp');
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => move(e.key));
restartButton.addEventListener('click', initializeGame);
boardElement.addEventListener('touchstart', handleTouchStart);
boardElement.addEventListener('touchend', handleTouchEnd);

// Start the game
initializeGame();