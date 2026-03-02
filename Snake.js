//map's variables
var MapSize = "s";
var BlockS = 83;
var Row = 6;
var Col = 6;
var map;
var c;//This is context and I will be using it a lot so I decided to create a easier variable name for it.

//Snakes variables
var SnakeX = BlockS * 2;
var SnakeY = BlockS * 4;
var VelX = 0
var VelY = 0

//The images of each body part of the snake
var Body = [];

var Head = new Image();
Head.src = "images/head_right.png";

var Tail = new Image();
Tail.src = "images/tail_right.png";

var VertBody = new Image();
VertBody.src = "images/body_vertical.png";

var HoriBody = new Image();
HoriBody.src = "images/body_horizontal.png";

var TopRightBody = new Image();
TopRightBody.src = "images/body_topright.png";

var TopLeftBody = new Image();
TopLeftBody.src = "images/body_topleft.png";

var BotRightBody = new Image();
BotRightBody.src = "images/body_bottomright.png";

var BotLeftBody = new Image();
BotLeftBody.src = "images/body_bottomleft.png";

//Food vairables
var FoodX;
var FoodY;

var Food = new Image();
Food.src = "images/apple.png";

//Game Variables
var Start = false;
var GameOver = false;
var Win = false;
var Setting = false;
var Speed = 4;
window.Score = 0;

//Function to allow the snake to move by looping the game many times a second
function GameLoop(){
    update();
    //I was trying to make the Snake's speed overtime but I didnt get to finish
    setTimeout(GameLoop, 1000/Speed);
}

//Function to assign the size of the map depending on the users choice
function MapSizes(){
    if (MapSize == "s"){
        BlockS = 83;
        Row = 6;
        Col = 6;
    }
    else if (MapSize == "m"){
        BlockS = 50;
        Row = 10;
        Col = 10;
    }
    else if (MapSize == "l"){
        BlockS = 36;
        Row = 14;
        Col = 14;
    }

    //Creates the maps dimensions
    map.height = Row * BlockS;
    map.width = Col * BlockS;

    //Realign Snake and its Body
    SnakeX = Math.floor(SnakeX / BlockS) * BlockS;
    SnakeY = Math.floor(SnakeY / BlockS) * BlockS;
    Body = Body.map(([x, y]) => [Math.floor(x / BlockS) * BlockS, Math.floor(y / BlockS) * BlockS]);

    //Reposition Food
    FoodPos();
}

//First function that is run when the code is run
window.onload = function() {
    map = document.getElementById("map");
    c = map.getContext("2d");

    //Assign map size according to users choice
    MapSizes();
    map.height = Row * BlockS;
    map.width = Col * BlockS;

    //Reposition Food
    FoodPos();

    //Allow for inputs from user
    document.addEventListener("keyup", Inputs);

    //Loops the game
    GameLoop();
}

//Restarts the map and snakes variables when the user chooses to
function Restart(){
    SnakeX = BlockS * 2;
    SnakeY = BlockS * 4;
    VelX = 0;
    VelY = 0;
    Body = [];
    GameOver = false;
    Win = false;
    window.Score = 0;
    document.getElementById("sc").innerText = window.Score;

    //Reposition Food
    FoodPos();
}

//Main function to draw the map, variables, snake and food onto the website
function update(){
    //Runs the function if the game isnt over, user hasnt won and if the user isnt in the settings.
    if (GameOver || Win || Setting){
        return;
    }
    
    //Map's output
    c.fillStyle = "green";
    c.fillRect(0, 0, map.width, map.height);

    //Food is outputted
    c.drawImage(Food, FoodX, FoodY, BlockS, BlockS);

    //Score and snake increase by 1 when the food is eaten
    if (SnakeX == FoodX && SnakeY == FoodY){
        Body.push([FoodX, FoodY])
        window.Score += 1
        //Reposition Food
        FoodPos()
    }

    //Makes all the body segments follow the one infront
    for (let i = Body.length-1;i > 0; i--){
        Body[i] = Body[i-1];
    }
    //Check if snake has body then makes sure that the body trails behind the head
    if (Body.length){
        Body[0] = [SnakeX, SnakeY];
    }

    //The Snake's position
    SnakeX += VelX * BlockS;
    SnakeY += VelY * BlockS;

    //Draw the Snake's head
    c.drawImage(Head, SnakeX, SnakeY, BlockS, BlockS);

    //If the game hasnt started, it shows the start screen
    if (!Start) {
        StartScrn();
        return;
    }

    //GameOver if the Snake touches the border
    if (SnakeX < 0 || SnakeX >= Col*BlockS || SnakeY < 0 || SnakeY >= Row*BlockS){
        GameOver = true;
        GameOverScrn();
    }

    //Draw body of snake as it increase in size and moves around the map
    for (let i = 0; i < Body.length; i++) {
        let Segment = Body[i];
        let PrevSegment = i > 0 ? Body[i - 1] : [SnakeX, SnakeY];
        let NextSegment = i < Body.length - 1 ? Body[i + 1] : null;

        let BodyPart;

        if (NextSegment) {
            let PrevDirX = PrevSegment[0] - Segment[0];
            let PrevDirY = PrevSegment[1] - Segment[1];
            let NextDirX = NextSegment[0] - Segment[0];
            let NextDirY = NextSegment[1] - Segment[1];

            //Straight body segment
            //Vertical
            if ((PrevDirX == 0 && NextDirX == 0) || (PrevDirY != 0 && NextDirY != 0)) {
                BodyPart = VertBody;
            }
            //Horizontal 
            else if ((PrevDirY == 0 && NextDirY == 0) || (PrevDirX != 0 && NextDirX != 0)) {
                BodyPart = HoriBody;
            }
            //Turn body segments
            //Top Left
            else if ((PrevDirX == -BlockS && NextDirY == -BlockS) || (NextDirX == -BlockS && PrevDirY == -BlockS)) {
                BodyPart = TopLeftBody;
            }
            //Top Right
            else if ((PrevDirX == BlockS && NextDirY == -BlockS) || (NextDirX == BlockS && PrevDirY == -BlockS)) {
                BodyPart = TopRightBody;
            }
            //Bottom Left
            else if ((PrevDirX == -BlockS && NextDirY == BlockS) || (NextDirX == -BlockS && PrevDirY == BlockS)) {
                BodyPart = BotLeftBody;
            }
            //Bottom Right
            else if ((PrevDirX == BlockS && NextDirY == BlockS) || (NextDirX == BlockS && PrevDirY == BlockS)) {
                BodyPart = BotRightBody;
            }
        }
        // Tail segment
        else {
            let tail = Body[Body.length - 1];
            let BeforeTail = Body.length > 1 ? Body[Body.length - 2] : [SnakeX, SnakeY];
            let DirX = tail[0] - BeforeTail[0];
            let DirY = tail[1] - BeforeTail[1];

            //Tail facing left
            if (DirX == -BlockS){
                Tail.src = "images/tail_left.png";
            }
            //Tail facing right
            else if (DirX == BlockS){
                Tail.src = "images/tail_right.png";
            }
            //Tail facing up
            else if (DirY == -BlockS){
                Tail.src = "images/tail_up.png";
            }
            //Tail facing down
            else if (DirY == BlockS){
                Tail.src = "images/tail_down.png";
            }

            BodyPart = Tail;
        }

        //Draws the body parts
        c.drawImage(BodyPart, Segment[0], Segment[1], BlockS, BlockS);

        //Game Over if the Snake touches itself
        for (let i = 0;i < Body.length; i++){
            if (SnakeX == Body[i][0] && SnakeY == Body[i][1]){
                GameOver = true;
                GameOverScrn();
            }
        }

        //Checks if the user has won
        if (Body.length == (Row*Col)-1){//The -1 is due to the fact that the snake already takes up 1 block when the score is 0.
            Win = true;
            c.fillStyle = "rgba(0, 0, 0, 0.8)";
            c.fillRect(0, 0, map.width, map.height);
            
            c.fillStyle = "white";
            c.font = "30px Arial";
            c.textAlign = "center";
            c.fillText("You Win!", map.width / 2, map.height / 2);
            c.fillText("Press Enter to Restart", map.width / 2, map.height / 2 + 50);
            c.fillText("Press Escape to go to Settings", map.width / 2, map.height / 2 + 100);
        }

        //Outputs the score onto the page by sending it to the html file
        document.getElementById("sc").innerText = window.Score;
    }
}

//Start screen
function StartScrn() {
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, map.width, map.height);

    c.fillStyle = "white";
    c.font = "30px Arial";
    c.textAlign = "center";
    c.fillText("Press Enter to Start", map.width / 2, map.height / 2);
    c.fillText("Press Escape to go to Settings", map.width / 2, map.height / 2 + 50);

    c.fillStyle = "white";
    c.font = "10px Arial";
    c.textAlign = "center";
    c.fillText("Use the arrow keys to move the Snake in each direction", map.width / 2 , map.height / 2 + 200);
}

//Game Over Screen
function GameOverScrn(){
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, map.width, map.height);

    c.fillStyle = "white";
    c.font = "30px Arial";
    c.textAlign = "center";
    c.fillText("Game Over!", map.width / 2, map.height / 2);
    c.fillText("Press Enter to Restart", map.width / 2, map.height / 2 + 50);
    c.fillText("Press Escape to go to Settings", map.width / 2, map.height / 2 + 100);
}

//Settings Screen
function Settings() {
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, map.width, map.height);

    c.fillStyle = "white";
    c.font = "30px Arial";
    c.textAlign = "center";
    c.fillText("Settings", map.width / 2, map.height / 2 - 150);

    c.fillStyle = "white";
    c.font = "10px Arial";
    c.textAlign = "center";
    c.fillText("Click Escape to go back to Start Screen", map.width / 2 , map.height / 2 + 200);
    c.fillText("Or Enter to carry on the game", map.width / 2 , map.height / 2 + 215);
    c.fillText("(If you clicked escape during the game)", map.width / 2 , map.height / 2 + 230);

    //Sound Button
    const SoundBtn = document.createElement("button");
    SoundBtn.innerText = "Change Speed";
    SoundBtn.style.position = "absolute";
    SoundBtn.style.left = `${map.offsetLeft + map.width / 2 - 80}px`;
    SoundBtn.style.top = `${map.offsetTop + map.height / 2 - 50}px`;
    SoundBtn.style.padding = "10px 20px";
    SoundBtn.style.fontSize = "16px";
    SoundBtn.style.cursor = "pointer";
    SoundBtn.style.zIndex = 10;

    document.body.appendChild(SoundBtn);
    
    //Map Size Button
    const MapSizeBtn = document.createElement("button");
    MapSizeBtn.innerText = "Map Size";
    MapSizeBtn.style.position = "absolute";
    MapSizeBtn.style.left = `${map.offsetLeft + map.width / 2 - 60}px`;
    MapSizeBtn.style.top = `${map.offsetTop + map.height / 2 + 50}px`;
    MapSizeBtn.style.padding = "10px 20px";
    MapSizeBtn.style.fontSize = "16px";
    MapSizeBtn.style.cursor = "pointer";
    MapSizeBtn.style.zIndex = 10;

    document.body.appendChild(MapSizeBtn);


    //Prompt for when the Sound Button is clicked
    SoundBtn.addEventListener("click", () => {
        Speed = prompt("Enter new speed (e.g., 2, 4, 6):", Speed) || Speed;
    });

    //Prompt for when the Map Size Button is clicked
    MapSizeBtn.addEventListener("click", () => {
        MapSize = prompt("Enter desired Map size by its first intial(e.g. [s]mall, [m]edium, [l]arge):", MapSize) || MapSize;
        MapSizes();
    });

    //Gets the keyboard inputs when in the Settings Screen
    document.addEventListener("keyup", function returnToGame(i) {
        //Goes back to the Start Screen
        if (i.code == "Escape") {
            Start = false;
            Setting = false;
            GameOver = false;
            Win = false;
            SoundBtn.remove();
            MapSizeBtn.remove();
            document.removeEventListener("keyup", returnToGame);
            Restart();
            StartScrn();
        }
        //Resumes the game
        else if (i.code == "Enter"){ 
            Setting = false;
            GameOver = false;
            Win = false;
            SoundBtn.remove();
            MapSizeBtn.remove();
            document.removeEventListener("keyup", returnToGame);
            update();
        }
    });
}

//Function for checking inputs
function Inputs(i) {
    //Start game
    if (!Start && i.code == "Enter") {
        Start = true;
        return;
    }

    //Settings
    else if(!Start && !Setting && i.code == "Escape"){
        Start = true;
        Setting = true;
        Settings();
        return;
    }

    //Restart
    if ((Win || GameOver) && i.code == "Enter") {
        Restart();
        return;
    }

    //Movements
    if (Start && !Setting){
        if (i.code == "ArrowUp" && VelY == 0){
            VelX = 0;
            VelY = -1;
            Head.src = "images/head_up.png";
        }
        else if (i.code == "ArrowDown" && VelY == 0){
            VelX = 0;
            VelY = 1;
            Head.src = "images/head_down.png";
        }
        else if (i.code == "ArrowLeft" && VelX == 0){
            VelX = -1;
            VelY = 0;
            Head.src = "images/head_left.png";
        }
        else if (i.code == "ArrowRight" && VelX == 0){
            VelX = 1;
            VelY = 0;
            Head.src = "images/head_right.png";
        }
        //Settings whilst the game is running
        else if(i.code == "Escape"){
            Setting = true;
            Settings();
            return;
        }
    }
}

//Reposition the food randomly on the map
function FoodPos(){
    while (true) {
        FoodX = Math.floor(Math.random() * Col) * BlockS;
        FoodY = Math.floor(Math.random() * Row) * BlockS;

        //Ensure food does not overlap with the snake
        let overlap = Body.some(([x, y]) => x == FoodX && y == FoodY);
        if (FoodX != SnakeX || FoodY != SnakeY && !overlap) {
            break;
        }
    }
}