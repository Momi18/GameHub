import { realDictionary } from './wordle-dictionary.js';

const dictionary = realDictionary;

// Track Game State 
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6).fill(null).map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

// Setup Grid Rendering
function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'wordle-grid';

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            const box = document.createElement('div');
            box.className = 'wordle-box empty';
            box.id = `box${row}${col}`;
            grid.appendChild(box);
        }
    }

    container.appendChild(grid);
}

function updateGrid() {
    state.grid.forEach((row, r) => {
        row.forEach((letter, c) => {
            const box = document.getElementById(`box${r}${c}`);
            box.textContent = letter.toUpperCase();
        });
    });
}

// Keyboard Handling
function registerKeyboardEvents() {
    document.body.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (key === 'enter') {
            if (state.currentCol === 5) submitWord();
        } else if (key === 'backspace') {
            removeLetter();
        } else if (/^[a-z]$/.test(key)) {
            addLetter(key);
        }

        updateGrid();
    });
}

// Letter Functions
function addLetter(letter) {
    if (state.currentCol < 5) {
        state.grid[state.currentRow][state.currentCol] = letter;
        state.currentCol++;
    }
}

function removeLetter() {
    if (state.currentCol > 0) {
        state.currentCol--;
        state.grid[state.currentRow][state.currentCol] = '';
    }
}

// Handle Word Submission
function submitWord() {
    const guess = state.grid[state.currentRow].join('');

    if (!dictionary.includes(guess)) {
        alert('Not a valid word!');
        return;
    }

    revealWord(guess);
}

// Reveal Letters with Animation
function revealWord(guess) {
    const row = state.currentRow;
    const animationDuration = 500;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = guess[i];

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.replace('empty', 'right');
            } else if (state.secret.includes(letter)) {
                box.classList.replace('empty', 'wrong');
            }

            box.classList.add('animate-flip');
        }, i * (animationDuration / 2));
    }

    setTimeout(() => {
        if (guess === state.secret) {
            alert('Congratulations! 🎉');
        } else if (state.currentRow === 5) {
            alert(`Game Over! The word was ${state.secret.toUpperCase()}.`);
        }
        state.currentRow++;
        state.currentCol = 0;
    }, 3 * animationDuration);
}

// Game Startup 
function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
}

startup();

// Handle Reset Button
document.getElementById('reset').addEventListener('click', () => {
    if (confirm("Are you sure you want to start a new game?")) {
        location.reload();
    }
});