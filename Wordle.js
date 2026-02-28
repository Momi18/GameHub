import { realDictionary } from './wordle-dictionary.js';

const dictionary = realDictionary;
const wordleMsg = document.getElementById('wordle-msg');
const statusText = document.getElementById('status-text');
const subText = document.getElementById('sub-text');
const resetConfirm = document.getElementById('reset-confirm');
const conYes = document.getElementById('con-yes');
const conNo = document.getElementById('con-no');

const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6).fill(null).map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

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

function submitWord() {
    const guess = state.grid[state.currentRow].join('');

    if (!dictionary.includes(guess)) {
        showMessage('Invalid Word');
        return;
    }

    revealWord(guess);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animationDuration = 500;
    const secretLetters = state.secret.split('');
    const letterCounts = {};
    secretLetters.forEach(letter => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });

    const results = Array(5).fill('grey'); 

    for (let i = 0; i < 5; i++) {
        if (guess[i] === state.secret[i]) {
            results[i] = 'right';
            letterCounts[guess[i]]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (results[i] !== 'right') {
            if (state.secret.includes(guess[i]) && letterCounts[guess[i]] > 0) {
                results[i] = 'wrong';
                letterCounts[guess[i]]--;
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        
        setTimeout(() => {
            box.classList.remove('empty');
            box.classList.add(results[i]);
            box.classList.add('animate-flip');
        }, i * (animationDuration / 2));
    }

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