var canvas, ctx, gameControl, gameActive;
// render X times per second
var x = 20;
let hiscore= 0;
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
pause = document.getElementById("pause");
left  = document.getElementById("left");
right  = document.getElementById("right");
up  = document.getElementById("up");
down  = document.getElementById("down");
window.onload = function() {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownEvent);

gameControl = startGame(x);
};
// --------------------
var mode = document.getElementsByName('mode');
var mode_value = 'classic';
function checkmode(){
    for(var i = 0; i < mode.length; i++){
        if(mode[i].checked){
            mode_value = mode[i].value;
        }
    }
    console.log(mode_value);
}

/* function to start the game */
function startGame(x) {
    // setting gameActive flag to true
    gameActive = true;
    document.getElementById("game-status").innerHTML = "<small>Game Started</small>";
    document.getElementById("game-score").innerHTML = "";
    // snakeX = (snakeY = 10);
    return setInterval(draw, 1000 / x);
    
}

function pauseGame() {
    // setting gameActive flag to false

    clearInterval(gameControl);
    gameActive = false;
    document.getElementById("game-status").innerHTML = "<small>Game Paused</small>";
    
}
function play(){
    if(gameActive == true) {
        pauseGame();
        pause.innerHTML = "Play";
    }
    else {
        gameControl = startGame(x);
        pause.innerHTML = "Pause";
    }
}
function endGame(x) {
    // setting gameActive flag to false
    clearInterval(gameControl);
    gameActive = false;
    alert("Game Over")
    // document.getElementById("game-status").innerHTML = "<small>Game Over</small>";
    document.getElementById("game-score").innerHTML = "<h3>Score: " + x + "</h3>";
    pause.innerHTML = " Play Again ";

    if(x>=hiscore){
        hiscore = x;
    }
    document.getElementById("hiscore").innerHTML = "<h3>HiScore: " + hiscore + "</h3>";
    // snakeTrail[0] = {x: 10, y: 10};
    // tailSize = defaultTailSize;
    return hiscore;
    
}

// game world
var gridSize = (tileSize = 24); // 20 x 20 = 400
var nextX = (nextY = 0);

// snake
var defaultTailSize = 2;
var tailSize = defaultTailSize;
var snakeTrail = [];
var snakeX = (snakeY = 10);

// apple
var appleX = (appleY = 15);

// draw
function draw() {
// move snake in next pos
snakeX += nextX;
snakeY += nextY;

// snake over game world?
if(mode_value === 'classic'){
    if (snakeX < 0) {
        snakeX = gridSize - 1;
        // endGame(tailSize-2);
    }
    if (snakeX > gridSize - 1) {
        snakeX = 0;
    }

    if (snakeY < 0) {
        snakeY = gridSize - 1;
    }
    if (snakeY > gridSize - 1) {
        snakeY = 0;
    }
    canvas.style.border= "1px solid black";
}
if(mode_value === "box"){
    canvas.style.border="5px solid black"
}
//snake bite apple?
if (snakeX == appleX && snakeY == appleY) {
    tailSize++;

    appleX = Math.floor(Math.random() * gridSize);
    appleY = Math.floor(Math.random() * gridSize);
    foodSound.play();
}

//  Select the colour to fill the canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//  Select the colour for the border of the canvas
ctx.strokestyle = CANVAS_BORDER_COLOUR;
// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, canvas.width, canvas.height);
// Draw a "border" around the entire canvas
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// paint snake
ctx.fillStyle = SNAKE_COLOUR;
ctx.strokestyle = SNAKE_BORDER_COLOUR;
for (var i = 0; i < snakeTrail.length; i++) {
    
    ctx.fillRect(
    snakeTrail[i].x * tileSize,
    snakeTrail[i].y * tileSize,
    tileSize,
    tileSize
    );
    
    ctx.strokeRect(snakeTrail[i].x * tileSize , snakeTrail[i].y* tileSize, tileSize, tileSize);

    //snake bites it's tail?
    if (snakeTrail[i].x == snakeX && snakeTrail[i].y == snakeY) {
    if(tailSize > 3) {
        gameOverSound.play();
        endGame(tailSize-2);
        
    }
    // console.log(snakeTrail[i].x);
    // console.log(snakeX)
    // console.log(snakeTrail[i].y);
    // console.log(snakeY)
    tailSize = defaultTailSize;  
    }
    // if Snake bites wall:
    if(snakeTrail[i].x == -1 || snakeTrail[i].y == -1 || snakeTrail[i].x == 24 || snakeTrail[i].y == 24 && mode_value === 'box'){
        // snakeTrail[i] = {x: 10 , y: 10};
        
        gameOverSound.play();
        endGame(tailSize-2);
        
        tailSize = defaultTailSize;
        snakeX = snakeY = 10;
        
    }
    if(gameActive === true){
    document.getElementById("game-score").innerHTML = "<h3>Score: " + (tailSize-2) + "</h3>";
    }
    
}

// paint apple
ctx.fillStyle = "red";
ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);

//set snake trail
snakeTrail.push({ x: snakeX, y: snakeY });
while (snakeTrail.length > tailSize) {
    snakeTrail.shift();
}
}

// input with keyboard
function keyDownEvent(e) {
switch (e.keyCode) {
    case 37:   // ArrowLeft
    if(nextX !== 1){
        nextX = -1;
        nextY = 0;
    }
    break;
    case 38:  // ArrowUp
    if(nextY !== 1){
        nextX = 0;
        nextY = -1;
    }
    break;
    case 39:  // ArrowRight
    if(nextX !== -1){
        nextX = 1;
        nextY = 0;
    }
    
    break;
    case 40:  // ArrowDown
    if(nextY !== -1){
        nextX = 0;
        nextY = 1;
    }
    
    break;
    case 32: // Space Bar
    play();    // Call the play function
    break;
}
}
// input with buttons
function move(y){
    switch(y){
        case 37:   // ArrowLeft
        if(nextX !== 1){
            nextX = -1;
            nextY = 0;
        }
        break;
        case 38:  // ArrowUp
        if(nextY !== 1){
            nextX = 0;
            nextY = -1;
        }
        break;
        case 39:  // ArrowRight
        if(nextX !== -1){
            nextX = 1;
            nextY = 0;
        }
        break;
        case 40:  // ArrowDown
        if(nextY !== -1){
            nextX = 0;
            nextY = 1;
        }
    }
}