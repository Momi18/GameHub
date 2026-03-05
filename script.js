// Searchbox Functionality
function searchBox() {
    const searchInput = document.querySelector(".searchbox");
    const gameTitle = document.querySelectorAll(".game-title");

    searchInput.addEventListener("input", function() {
        
        const searchTerm = searchInput.value.trim().toLowerCase();

        gameTitle.forEach(function(title) {
            const gameName = title.textContent.toLowerCase();
            const gameCard = title.closest(".Cards");

            if (gameName.includes(searchTerm)) {
                gameCard.style.display = "";
            } else {
                gameCard.style.display = "none";
            }
        });

        // console.log(searchInput.value);
    });
}

document.addEventListener("DOMContentLoaded", searchBox);
