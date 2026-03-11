const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
function jump() {
    // FIX: Check dino.classList, not dispatchEvent.classList
    if (!dino.classList.contains("jump")) { 
        dino.classList.add("jump");
        
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}
let checkAlive = setInterval(function () {
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
    
    if (cactusLeft > 50 && cactusLeft < 120 && dinoBottom < 40) {
        dino.style.animationPlayState = "paused";
        cactus.style.animationPlayState = "paused";
        alert("Whoops! Game Over :(");
        window.location.reload();
    }
}, 10);
document.addEventListener("keydown", function (event) {
    jump();
});