const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const dinoMsg = document.getElementById("dino-msg");
const retryBtn = document.getElementById("retry-btn");

function jump() {
    if (!dino.classList.contains("jump")) { 
        dino.classList.add("jump");
        
        setTimeout(function () {
            dino.classList.remove("jump");
        }, 300);
    }
}
let checkAlive = setInterval(function () {
    let dinoBot = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    if (cactusLeft > 50 && cactusLeft < 120 && dinoBot < 40) {
        dino.style.animationPlayState = "paused";
        cactus.style.animationPlayState = "paused";

        dinoMsg.classList.remove("hide");

        clearInterval(checkAlive);
    }
}, 10);

retryBtn.addEventListener("click", function() {
    window.location.reload(); 
});

document.addEventListener("keydown", function (event) {
    jump();
});