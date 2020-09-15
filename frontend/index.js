const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#C2C2C2'
const FOOD_COLOUR = '#e66916'

//connecting to the server. Here we tell where to connect to, what url
const socket = io('http://localhost:3000');
//we wanto to listen to the init event, because it was what
//we defined in our server and we want to call the funciont
//handleInit
socket.on('init', handleInit); //we want to listen to the init event
//and call a function called handleInit
//next we want to listn to a new event, called 'gameState'
//and call a function called handleGameState
socket.on('gameState',handleGameState);

socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameBtn');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click',joinGame);

function newGame(){
    socket.emit('newGame');
    init();
}

function joinGame(){
    const code = gameCodeInput.nodeValue;
    socket.emit('joinGame', code); //we don't need to stringify
                                   //code because it's already
                                   //a string coming out of the
                                   //input
    init();
}

let canvas, ctx;
let playerNumber;

//initialization function
function init(){
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;
    ctx.fillStyle= BG_COLOUR;
    ctx.fillRect(0,0,canvas.width,canvas.height)

    //listening to a keydown event and 
    document.addEventListener('keydown', keydown);
}

//takes an event as argument
function keydown(e){
    //console.log(e.keyCode);
    socket.emit('keydown',e.keyCode); //send to the server a 
    //keydown event in this case, the event e.keyCode
}

function paintGame(state){
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;

    //size is how many pixels represent a square in game space
    //this is where we reconcile the coordinate system between
    //pixels space and gamespace
    const size = canvas.width / gridsize;

    //paint the food
    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size)

    paintPlayer(state.player, size, SNAKE_COLOUR);
}

function paintPlayer(playerState, size, colour){
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for(let cell of snake){
        ctx.fillRect(cell.x * size, cell.y *size, size, size);
    }
}


//we have to take the state out of the frontend put it on the backend and then
//update the state for every frame of the game

function handleInit(number){
    playerNumber = number;
}

function handleGameState(gameState){
    //gameState comes as a string, server sends Json as a string, and 
    //we want it as a JS object
    gameState = JSON.parse(gameState);
    //now that gameState is a JS object...
    //requesteAnimationFrame expects a function, we
    //give an inline arrow function
    requestAnimationFrame(() => paintGame(gameState));
    //everytime the server sends a gameState message with a new
    //gameState object the browser will receive it and will paint the game.
    //frame by frame update sent to the frond end
}

//the paintgame function must be called anytime the server sends a new
//updated gamestate

function handleGameOver(){
    alert("You lose!");
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerText = gameCode;
}