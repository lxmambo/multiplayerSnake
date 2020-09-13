const { GRID_SIZE } = require('./constants');

module.exports = {
    createGameState,
    gameLoop,
}

function createGameState() {
    return {
        //returning the gamestate object
        player: {
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
        },
        food: {
            x: 7,
            y: 7,
        },
        gridsize: GRID_SIZE,
        active: true,
    };
}

function gameLoop(state) {
    if(!state){
        return;
    }

    const playerOne = state.player;
    //first thing is update position based in the velocity
    playerOne.pos.x +=playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    //we need to make sure that position is not outside the end of the canvas
    if(playerOne.pos.x <0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE){
        //if any one of this is true, player one lose
        return 2;
    }
    //the player ate food? head on same position of head
    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        player.One.snake.push({...playerOne.pos}); //snake array gets a new object, gets bigger
        playerOne.pos.x +=playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        //place new food in the grid
        randomFood();
    }
    //we need to make sure the snake didn't bump on itself
    //and move all the squares of the object forward
    if(playerOne.vel.x || playerOne.vel.y){
        //<-we need to make sure the snake it's moving
        //let's make sure the snake is not bumping on itself
        for(let cell of playerOne.snake){
            if(cell.x === playerOne.pos.x && cell.y === playerOne.pox.y){
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
    return false; //if we reached so far, player is still in the game
                  //because there is no winner
}

function randomFood(state){
    food = {
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE),
    }
    //we don't want to place the food on the top of the snake
    for(let cell of state.player.snake){
        if(cell.x === food.x && cell.y === food.y){
             return randomFood(state);
             //recursely call randomFood until we get
        }
    }
    state.food = food;
    
}