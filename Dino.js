const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const dinoMsg = document.getElementById("dino-msg");
const retryBtn = document.getElementById("retry-btn");

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
    let dinoBot = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    // Collision Check
    if (cactusLeft > 50 && cactusLeft < 120 && dinoBot < 40) {
        // 1. Stop the animations
        dino.style.animationPlayState = "paused";
        cactus.style.animationPlayState = "paused";

        // 2. Show the on-screen message
        dinoMsg.classList.remove("hide");

        // 3. Optional: Stop the interval from running
        clearInterval(checkAlive);
    }
}, 10);

// Restart functionality when the button is clicked
retryBtn.addEventListener("click", function() {
    window.location.reload(); 
});

document.addEventListener("keydown", function (event) {
    jump();
});