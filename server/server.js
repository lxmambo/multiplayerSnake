//creating the server
//we did > yarn add socket.io
const io = require('socket.io')(); //socket io object
const { createGameState, gameLoop } = require('./game');
const {FRAME_RATE } = require('./constants');

io.on('connection',client =>{
    const state = createGameState();
    //client.emit('init', {data: 'hello world'});

    //here we can listen to incoming events from the client
    //this next function it needs to be defined here
    //so we can have access to the client. If the function
    //Was defined in another part it would not be possible
    client.on('keydown',handleKeyDown);

    //keyCode comes has a string, like any other
    //socket.io information and we json parse the objects
    //because we are going to receive ints as string->
    function handleKeyDown(keyCode){
        try {
            keyCode = parseInt(keyCode);
        } catch(e) {
            console.error(e);
            return;
        }

    }

    startGameInterval(client, state);
});

function startGameInterval(client, state){
    const intervalID = setInterval(() => {
        //gameLoop accepts the 'state' of that moment
        //and move us forward one step in game world
        //and it gives us the state of the next frame
        //returns a value that indicates if the game is over or not
        const winner = gameLoop(state);
        //if it returns 0 the game continues
        //if returns 1, the player has lost
        console.log('interval');
        if(!winner){
            client.emit('gameState', JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalID);
        }
    }, 1000/ FRAME_RATE); //<-number of miliseconds to wait
                          //in between each frame.
                          //1000 miliseconds -> 1s
}

//the client object allows us to comunicate with the
//client

//listening in port 3000
io.listen(3000);

//configure the front end to connect to the back end
//and as soon we connect get an init message
//with the message hello world

//we create a game state as soon as they connect