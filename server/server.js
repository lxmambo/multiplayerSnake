//creating the server
//we did > yarn add socket.io
const io = require('socket.io')(); //socket io object
const { createGameState, gameLoop, getUpdatedVelocity } = require('./game');
const {FRAME_RATE } = require('./constants');

const state = {};
const clientRooms = {}; //lookup table it's gonna map an id 
//to a room name


io.on('connection',client =>{

    //client.emit('init', {data: 'hello world'});

    //here we can listen to incoming events from the client
    //this next function it needs to be defined here
    //so we can have access to the client. If the function
    //Was defined in another part it would not be possible
    client.on('keydown',handleKeyDown);

    client.on('keydown',handleNewGame);

    client.on('joinGame', handleJoinGame);

    function handleJoinGame(){
        //to join the game, the game must exist and have 
        //another player waiting for you
        const room = io.sockets.adapter.rooms[gameCode];
        let allUsers;
        if(room){
            allUsers = room.sockets;
        }
        let numClients = 0;
        if(allUsers){
            //grab an array of allusers and get the length
            numClients = Object.keys(allUsers).length;
        }
        if(numClients=== 0){
            client.emit('unknowGame');
        } else if(numClients>1){
            client.emit('tooManyPlayers');
            return;
        }
        clientRooms[client.id] = gameCode;
        client.join(gameCode);
        client.number = 2;
        client.emit('init',2);

        startGameInterval(gameCode){

        }
    }

    function handleNewGame(){
        //when we joing a new game, what we want to do in
        //the server is to create a new socket.io room
        //when another player enters the game, clicking joing game
        //they are answering the game code and thats the name of the
        //socket.io room they need to connect to
        //to player connect to the same room -> start a new game
        //send information back to players
        let roomName = makeid(5); //5 charathers id
        clientsRooms[client.id] = roomName;
        client.emit('gameCode',roomName); //send roomName as the data

        state[roomName] = initGame(); //<-creates a state as soon
        //as the player connects

        client.join(roomName);
        client.number = 1; //next player will be player 2
        client.emit('init',1);
    }

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

        //function that translates keycodes in
        //velocity
        const vel = getUpdatedVelocity(keyCode);
        if(vel){
            state.player.vel = vel;
        }

    }
});

function startGameInterval(roomName){
    const intervalID = setInterval(() => {
        //gameLoop accepts the 'state' of that moment
        //and move us forward one step in game world
        //and it gives us the state of the next frame
        //returns a value that indicates if the game is over or not
        const winner = gameLoop(state[roomName]);
        //if it returns 0 the game continues
        //if returns 1, the player has lost
        console.log('interval');
        if(!winner){
            emitGameState(roomName,state[roomName]);
        } else {
            emitGameOver(roomName, winner);
            state[roomName] = null; //->because the game is now over;
            clearInterval(intervalID);
        }
    }, 1000/ FRAME_RATE); //<-number of miliseconds to wait
                          //in between each frame.
                          //1000 miliseconds -> 1s
}


function emitGameState(roomName, state){
    io.sockets.in(roomName)
        .emit('gameState', JSON.stringify(state));
        //with this line we are sending a message to an 
        //arbitrary number of clients

}

function emitGameOver(roomName, winner){
    io.sockets.in(roomName)
        .emit('gameOver',JSON.stringify({winner}));
}

//the client object allows us to comunicate with the
//client

//listening in port 3000
io.listen(3000);

//configure the front end to connect to the back end
//and as soon we connect get an init message
//with the message hello world

//we create a game state as soon as they connect