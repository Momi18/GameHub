import { realDictionary } from './wordle-dictionary.js';

const dictionary = realDictionary;
const wordleMsg = document.getElementById('wordle-msg');
const statusText = document.getElementById('status-text');
const subText = document.getElementById('sub-text');
const resetConfirm = document.getElementById('reset-confirm');
const conYes = document.getElementById('con-yes');
const conNo = document.getElementById('con-no');

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

function showMessage(title, message, persistent = false) {
    statusText.textContent = title;
    subText.textContent = message;
    wordleMsg.classList.remove('hide');

    if (!persistent) {
        setTimeout(() => {
            wordleMsg.classList.add('hide');
        }, 1000);
    }
}

// Handle Word Submission
function submitWord() {
    const guess = state.grid[state.currentRow].join('');

    if (!dictionary.includes(guess)) {
        showMessage('Invalid Word');
        return;
    }

    revealWord(guess);
}

// Reveal Letters with Animation
function revealWord(guess) {
    const row = state.currentRow;
    const animationDuration = 500;
    
    // 1. Create a map of how many of each letter are in the secret word
    const secretLetters = state.secret.split('');
    const letterCounts = {};
    
    // Fill the map: { 's': 1, 't': 1, 'e': 1, 'a': 1, 'm': 1 }
    secretLetters.forEach(letter => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });

    // Create an array to store the result for each of the 5 boxes
    const results = Array(5).fill('grey'); 

    // 2. First Pass: Find all GREEN (Right) letters first
    // This prevents a green letter from being "stolen" by an orange logic check
    for (let i = 0; i < 5; i++) {
        if (guess[i] === state.secret[i]) {
            results[i] = 'right';
            letterCounts[guess[i]]--; // Remove this letter from the available pool
        }
    }

    // 3. Second Pass: Find ORANGE (Wrong spot) letters
    // Only mark as orange if the letter exists in the secret word AND we haven't run out of them
    for (let i = 0; i < 5; i++) {
        if (results[i] !== 'right') { // Skip if already marked green
            if (state.secret.includes(guess[i]) && letterCounts[guess[i]] > 0) {
                results[i] = 'wrong';
                letterCounts[guess[i]]--; // Use up one instance of this letter
            }
        }
    }

    // 4. Apply the visual changes with the flip animation
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        
        setTimeout(() => {
            box.classList.remove('empty');
            // Add the specific class (right, wrong, or grey)
            box.classList.add(results[i]);
            box.classList.add('animate-flip');
        }, i * (animationDuration / 2));
    }

    // 5. Check for Win/Loss after the animation finishes
    setTimeout(() => {
        if (guess === state.secret) {
            state.gameFinished = true;
            showMessage('Congratulations! 🎉', `You guessed it!`, true);
            document.getElementById('reset').classList.remove('hide');
        } else if (state.currentRow === 5) {
            state.gameFinished = true;
            showMessage('Game Over', `The word was ${state.secret.toUpperCase()}.`, true);
            document.getElementById('reset').classList.remove('hide');
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

document.getElementById('reset').addEventListener('click', () => {
    resetConfirm.classList.remove('hide');
});

conNo.addEventListener('click', () => {
    resetConfirm.classList.add('hide');
});

conYes.addEventListener('click', () => {
    location.reload();
});