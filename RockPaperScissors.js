const gameContainer = document.querySelector('.rock-paper-scissors-container');
let userResult = document.querySelector('.user-result img');
const computerResult = document.querySelector('.computer-result img');
const roundResult = document.querySelector('.round-result');
const moveChoices = document.querySelectorAll('.move-choice');

const scoreElements = {
    win: document.querySelector('[data-score="win"]'),
    loss: document.querySelector('[data-score="loss"]'),
    draw: document.querySelector('[data-score="draw"]')
};

let activeChoice = null;

moveChoices.forEach((choice) => {
    choice.addEventListener('click', (event) => { 
        userResult.src = computerResult.src = `./images/rock_paper_scissors/fist_shake.png`;
        roundResult.textContent = 'Waiting...'

        gameContainer.classList.add('start');

        let userMove = event.currentTarget.dataset.choice;
        
        let imgElement = event.currentTarget.querySelector('img');

        let time = setTimeout(() => {
            gameContainer.classList.remove('start');

            let choiceImageSrc = imgElement.src;
            userResult.src = choiceImageSrc; 

            const moves = ['rock', 'paper', 'scissors'];

            let randomNumber = Math.floor(Math.random() * 3);
            let computerMove = moves[randomNumber];
            computerResult.src = `./images/rock_paper_scissors/${computerMove}.png`;

            let result;

            if (userMove === computerMove) {
                result = 'DRAW!';
            } 
            else if (
                (userMove === 'rock' && computerMove === 'scissors') ||
                (userMove === 'paper' && computerMove === 'rock') ||
                (userMove === 'scissors' && computerMove === 'paper')
            ) {
                result = 'YOU WIN!';
            } else {
                result = 'YOU LOSE!';
            }

            roundResult.textContent = result;

            if (result === 'YOU WIN!') {
                scoreElements.win.textContent = parseInt(scoreElements.win.textContent) + 1;
            } else if (result === 'YOU LOSE!') {
                scoreElements.loss.textContent = parseInt(scoreElements.loss.textContent) + 1;
            } else if (result === 'DRAW!') {
                scoreElements.draw.textContent = parseInt(scoreElements.draw.textContent) + 1;
            }
        }, 2500);
    });
});