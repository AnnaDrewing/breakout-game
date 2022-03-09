const grid = document.querySelector('.grid'); //get the class grid
const scoreDisplay = document.querySelector('#score');
//buttons
const startButton = document.getElementById('start-game');
const pauseButton = document.getElementById('pause-game');
const renewButton = document.getElementById('renew-game');
let gameIsOn = false;
//block measurements
const blockWidth = 100; 
const blockHeight = 20;
//board measurements
const boardWidth = 560;
const boardHeight = 300;
//user position data
const userStart = [230, 10];
let userTemp; 
let currentPosition = userStart;
//ball data
const ballDiameter = 20; 
const ballStart = [270, 40];
let ballTemp; 
let ballCurrentPosition = ballStart;
//ball movement data
let xDirection = -2;
let yDirection = 2;

let timerId; 
let score = 0;

//block template
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
        this.topLeft = [xAxis, yAxis + blockHeight]
    }
}

//all the blocks 
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),

    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),

    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

//draw the blocks
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div'); //create a div 
        block.classList.add('block'); //give this div a class of block 
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block); //add the block div as a child  
}
}
addBlocks();

//draw the user 
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

//draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

//add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);


//FUNCTIONALITY STARTS HERE//
startButton.addEventListener('click', startTheGame); 

//start the game
function startTheGame() {
    gameIsOn = true;
    document.addEventListener('keydown', moveUser);
    timerId = setInterval(moveBall, 30);
    chageButtonActivation();
}
//pause the game
function pauseTheGame() {
    gameIsOn = false;
    clearInterval(timerId);
    document.removeEventListener('keydown', moveUser);
    chageButtonActivation();
}
//renew the game
function renewTheGame() {
    gameIsOn = true;
    document.addEventListener('keydown', moveUser);
    timerId = setInterval(moveBall, 30);
    chageButtonActivation();
}
//manipulate the button activation 
function chageButtonActivation() {
if (gameIsOn) {
    //deactivate the start button
    startButton.classList.add('inactive-button');
    startButton.removeEventListener('click', startTheGame);
    //deactivate the renew button
    renewButton.classList.add('inactive-button');
    renewButton.removeEventListener('click', renewTheGame);
    //reactivate the pause button
    pauseButton.addEventListener('click', pauseTheGame);
    pauseButton.classList.remove('inactive-button');
}
if (!gameIsOn) {
    //deactivate the pause button
    pauseButton.classList.add('inactive-button');
    pauseButton.removeEventListener('click', pauseTheGame);
    //reactivate the renew button
    renewButton.classList.remove('inactive-button');
    renewButton.addEventListener('click', renewTheGame);
}
}
//move user
function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 10;
                drawUser();
            }
    }
}
//add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

//move the ball
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}
//check for collisions
function  checkForCollisions() {
    //check for block collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0])
            && ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
        )
        {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block'); //remove the class block in css
            blocks.splice(i, 1); //remove the block from the array of blocks
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;

            //check for win 
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }
    //check for user collisions 
    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) && 
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
        ) {
            changeDirection();
    }
    //check for wall collisions
    if ((ballCurrentPosition[0] >= boardWidth - ballDiameter) 
    || (ballCurrentPosition[1] >= boardHeight - ballDiameter)) {
        changeDirection();
    }
    if (ballCurrentPosition[0] <= 0) {
        changeDirection();
    }
    //check for game over 
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'Game Over';
        document.removeEventListener('keydown', moveUser);
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}