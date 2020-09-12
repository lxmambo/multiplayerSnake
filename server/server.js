//creating the server
//we did > yarn add socket.io
const io = require('socket.io')(); //socket io object
const { createGameState, gameLoop } = require('./game');
const {FRAME_RATE } = require('./constants');

io.on('connection',client =>{
    const state = createGameState();
    //client.emit('init', {data: 'hello world'});
    startGameInterval(client, state);
});

function startGameInterval(client, state){
    const intervalID = setInterval(() => {
        const winner = gameLoop(state);
        //if it returns 0 the game continues
        //if returns 1, the player has lost
        if(!winner){
            client.emit('gameState', JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalID);
        }
    }, 1000/ FRAME_RATE);
}

//the client object allows us to comunicate with the
//client

//listening in port 3000
io.listen(3000);

//configure the front end to connect to the back end
//and as soon we connect get an init message
//with the message hello world

//we create a game state as soon as they connect