// Getting references to DOM elements
const gameContainer = document.querySelector('.rock-paper-scissors-container');
let userResult = document.querySelector('.user-result img');
const computerResult = document.querySelector('.computer-result img');
const roundResult = document.querySelector('.round-result');
const moveChoices = document.querySelectorAll('.move-choice');

// Score elements for updating scores
const scoreElements = {
    win: document.querySelector('[data-score="win"]'),
    loss: document.querySelector('[data-score="loss"]'),
    draw: document.querySelector('[data-score="draw"]')
};

// Chosen move State tracker Loop  
let activeChoice = null;

moveChoices.forEach((choice) => {
    choice.addEventListener('click', (event) => { 
        // Setting up the waiting state
        userResult.src = computerResult.src = `./images/rock_paper_scissors/fist_shake.png`;
        roundResult.textContent = 'Waiting...'

        // Start animation
        gameContainer.classList.add('start');

        // Record move
        let userMove = event.currentTarget.dataset.choice;
        
        // Record image source of clicked move choice
        let imgElement = event.currentTarget.querySelector('img');

        // Delay the game logic to allow the animation to play
        let time = setTimeout(() => {
            gameContainer.classList.remove('start');

            // Set the user's result image to the chosen move's image source
            let choiceImageSrc = imgElement.src;
            userResult.src = choiceImageSrc; 

            // Handling Computer's move and result image
            const moves = ['rock', 'paper', 'scissors'];

            let randomNumber = Math.floor(Math.random() * 3);
            let computerMove = moves[randomNumber];
            computerResult.src = `./images/rock_paper_scissors/${computerMove}.png`;

            //console.log(computerResult.src);

            // Determine round result
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

            // Update the round result display
            roundResult.textContent = result;

            // Update the score elements based on result
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