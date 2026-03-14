const cards = document.getElementsByClassName('card');
let allImages = document.getElementsByClassName('card-image');
let movesDisplay = document.querySelector('.move-counter');
let toggledCardsArray = [];
let move = 0;
let winCount = 0;
const restart = document.getElementById('restart');
const memoryMsg = document.getElementById('memory-msg');
const moveResult = document.getElementById('move-result');
const playAgainBtn = document.getElementById('play-again');

const imagesLinkArray = [
    {
        id: 1,
        image: 
'images/gorilla.jpg',
        newAlt: 'Gorilla Image'
    },
    {
        id: 2,
        image: 
'images/lion.jpg',
        newAlt: 'Lion Image'
    },
    {
        id: 3,
        image: 
'images/rhino.jpg',
        newAlt: 'Rhino Image'
    },
    {
        id: 4,
        image: 
'images/elephant.jpg',
        newAlt: 'Elephant Image'
    },
    {
        id: 5,
        image: 
'images/bear.jpg',
        newAlt: 'Bear Image'
    },
    {
        id: 6,
        image: 
'images/rhino.jpg',
        newAlt: 'Rhino Image'
    },
    {
        id: 7,
        image: 
'images/bear.jpg',
        newAlt: 'Bear Image'
    },
    {
        id: 8,
        image: 
'images/lion.jpg',
        newAlt: 'Lion Image'
    },
    {
        id: 9,
        image: 
'images/giraffe.jpg',
        newAlt: 'Giraffe Image'
    },
    {
        id: 10,
        image: 
'images/gorilla.jpg',
        newAlt: 'Gorilla Image'
    },
    {
        id: 11,
        image: 
'images/giraffe.jpg',
        newAlt: 'Giraffe Image'
    },
    {
        id: 12,
        image: 
'images/elephant.jpg',
        newAlt: 'Elephant Image'
    }
]

const restartGame = () => {
    let toggledCard = 
        document.getElementsByClassName('card toggled');
    imagesLinkArray.sort(() => Math.random() - 0.5);
    Object.values(toggledCard).forEach(function (el) {
        setTimeout(() => {
            el.classList.remove("toggled");
        }, 0);
    })
    toggledCardsArray.length = 0;
    move = 0;
    winCount=0;
    movesDisplay.innerText = `Moves: ${move}`;
    let allImagesSrc = document.getElementsByClassName('card-image');
    Object.values(allImagesSrc).forEach((el, index)=>{
        el.src = imagesLinkArray[index].image;
        el.alt = imagesLinkArray[index].newAlt;
        el.id = imagesLinkArray[index].id
    }) 
}
restart.addEventListener('click', restartGame);

for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function () {
        this.classList.add("toggled");
        toggledCardsArray.push(this);
        let thisImgSrc = this.querySelector('.card-image').src;
        let previousImgSrc = 
        toggledCardsArray[toggledCardsArray.length - 2].querySelector('.card-image').src;
        if(thisImgSrc !== previousImgSrc) {
            toggledCardsArray.forEach(function (el) {
                setTimeout(() => {
                    el.classList.remove("toggled");
                }, 500);
            })
            toggledCardsArray.length = 0;
            move++;
        }
        else{
            toggledCardsArray.length = 0;
            move++;
            winCount++;
        }
        movesDisplay.innerText = `Moves: ${move}`;
        if (winCount === 6) {
            setTimeout(() => {
                moveResult.innerText = `You won the game in ${move} moves.`;
                memoryMsg.classList.remove("hide");
            }, 500);
        }
    })
}
playAgainBtn.addEventListener('click', () => {
    memoryMsg.classList.add("hide");
    restartGame();
});