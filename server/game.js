const { GRID_SIZE } = require('./constants');

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity,
}

function initGame(){
    const state = createGameState();
    randomFood(state);
    return state;
}

function createGameState() {
    return {
        //returning the gamestate object
        players: [{//begining of array of players
            pos: {
                x:3,
                y:10,
            },
            vel: {
                x:1,
                y:0,
            },
            snake: [
                {x: 1, y: 10},
                {x: 2, y: 10},
                {x: 3, y: 10},
            ],
        },{
            pos: {
                x:18,
                y:10,
            },
            vel: {
                x:0,
                y:0,
            },
            snake: [
                {x: 20, y: 10},
                {x: 19, y: 10},
                {x: 18, y: 10},
            ],
    
        }],//end of array of players
        food: {},
        gridsize: GRID_SIZE,
        active: true,
    };
}

function gameLoop(state) {
    if(!state){
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    
    //first thing is update position based in the velocity
    playerOne.pos.x +=playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    playerTwo.pos.x +=playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    //we need to make sure that position is not outside the end of the canvas
    if(playerOne.pos.x <0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE){
        //if any one of this is true, player one lose
        return 2;
    }
    if(playerTwo.pos.x <0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE){
        //if any one of this is true, player one lose
        return 1;
    }
    //the player ate food? head on same position of head
    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos}); //snake array gets a new object, gets bigger
        playerOne.pos.x +=playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        //place new food in the grid
        randomFood(state);
    }
    if(state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y){
        playerTwo.snake.push({...playerTwo.pos}); //snake array gets a new object, gets bigger
        playerTwo.pos.x +=playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
        //place new food in the grid
        randomFood(state);
    }
    //we need to make sure the snake didn't bump on itself
    //and move all the squares of the object forward
    if(playerOne.vel.x || playerOne.vel.y){
        //<-we need to make sure the snake it's moving
        //let's make sure the snake is not bumping on itself
        for(let cell of playerOne.snake){
            if(cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
                //this condition means that a cell of the snake body
                //is bumping/overlapping on to it's head   
                return 2;
                //player 1 has lost, 2 has won
            }
        }
        //if we are still in the game, we want to move the snake forward
        //push a new value onto the array and shift off the other one of the end
        //we end up with an array of same length but its all moved forward
        playerOne.snake.push({...playerOne.pos});
        //snake now it's one longer, we need to remove 1st item of the list
        playerOne.snake.shift();
    }
    if(playerTwo.vel.x || playerTwo.vel.y){
        //<-we need to make sure the snake it's moving
        //let's make sure the snake is not bumping on itself
        for(let cell of playerTwo.snake){
            if(cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y){
                //this condition means that a cell of the snake body
                //is bumping/overlapping on to it's head   
                return 1;
                //player 2 has lost, 1 has won
            }
        }
        //if we are still in the game, we want to move the snake forward
        //push a new value onto the array and shift off the other one of the end
        //we end up with an array of same length but its all moved forward
        playerTwo.snake.push({...playerTwo.pos});
        //snake now it's one longer, we need to remove 1st item of the list
        playerTwo.snake.shift();
    }
    return false; //if we reached so far, player is still in the game
                  //because there is no winner
}

function randomFood(state){
    food = {
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE),
    }
    //we don't want to place the food on the top of the snake
    for(let cell of state.players[0].snake){
        if(cell.x === food.x && cell.y === food.y){
             return randomFood(state);
             //recursely call randomFood until we get
        }
    }
    for(let cell of state.players[1].snake){
        if(cell.x === food.x && cell.y === food.y){
             return randomFood(state);
             //recursely call randomFood until we get
        }
    }
    state.food = food;
    
}

function getUpdatedVelocity(keyCode){
    switch(keyCode){
        case 37: { //represents the left key
            return {x:-1,y:0};
        }
        case 38: { //represents the down key
            return {x:0,y:-1};
        }
        case 39: { //represents the right key
            return {x:1,y:0};
        }
        case 40: { //represents the up key
            return {x:0,y:1};
        }
    }
}
