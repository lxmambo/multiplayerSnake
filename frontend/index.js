const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#C2C2C2'
const FOOD_COLOUR = '#e66916'

//connecting to the server
const socket = io('http://localhost:3000');
socket.on('init', handleInit); //we want to listen to the init event
//and call a function called handleInit
socket.on('gamestate',handleGameState);

const gameScreen = document.getElementById('gameScreen');
let canvas, ctx;

function init(){
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')

    canvas.width = canvas.height = 600;
    ctx.fillStyle= BG_COLOUR;
    ctx.fillRect(0,0,canvas.width,canvas.height)

    document.addEventListener('keydown', keydown);
}

//takes an event as argument
function keydown(e){
    console.log(e.keyCode);
}

init();

function paintGame(state){
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;

    //size is how many pixels represent a square in game space
    const size = canvas.width / gridsize;

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

function handleInit(msg){
    console.log(msg);
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