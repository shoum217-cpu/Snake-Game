/*tip learned: ask yourself, "did I create this earlier and give it a name?"
If yes → no quotes, just use the name (board, snakeElement, direction, food)
If no, it's just plain text/data → use quotes ('div', 'head', 'ArrowUp', 'Music/food.mp3')
and.. if you define an id in html then we can directly do that_ide.innerHTML ="" or anything but with class you need to first define with document.querySelector(Class_name).innerHTML =""
*/

let inputDir = { x: 0, y: 0 }; //what the player pressed
let direction = { x: 0, y: 0 }; //what the snake is going to
const foodSound = new Audio('Music/food.mp3');
const gameOverSound = new Audio('Music/gameover.mp3');
const moveSound = new Audio('Music/move.mp3');
const musicSound = new Audio('Music/music.mp3');
musicSound.volume = 0.4
let a = 2; // the grid boxes basically pehle box infact
let b = 17;
let lastPaint = 0;
let speed = 18;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }]; //woh ek ek snake ka part is this, each index
let food = { x: 6, y: 7 }; //food is not an array

//Game fucntions
main = (ctime) => { //here ctime refers to current time
    window.requestAnimationFrame(main)
    // console.log(ctime), ye faltu me rendering karega
    if ((ctime - lastPaint) / 1000 < 1 / speed) {
        return;
    }
    else {
        lastPaint = ctime
        gameEngine();
    }
}

Collides = (snake) => {
    //If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    //If you bump into diwaar
    if ((snake[0].x > 18) || (snake[0].x < 1) || (snake[0].y > 18) || (snake[0].y < 1)) {
        return true;
    }
}

//Game Engine
gameEngine = () => {
    //Part 1: Movement of sanke and food realted matter
    if (Collides(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        musicSound.currentTime = 0; //rewind to the star after colliding
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Try Again");
        score = 0;
        snakeArr = [{ x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }];
        musicSound.play();
    }

    //If you have eaten food, [0] refers the head
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > HighScore) {
            HighScore = score;
            localStorage.setItem('highScore', HighScore);
            document.querySelector('.HighScore').innerHTML = "Highest Score: " + HighScore;
        }
        document.querySelector('.Score').innerHTML = "Score: " + score  //score and Score are diff score we defined a variable so use Score as class in html
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y }) //jis direction me khana tha uss direction me ab ek aur snake body segment at initial aa jayega
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    //Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) { // snake array as an array ke liye 
        snakeArr[i + 1] = { ...snakeArr[i] }
    }
    musicSound.play();
    snakeArr[0].x += inputDir.x; //x me badho and y me badho
    snakeArr[0].y += inputDir.y;
    direction = { x: inputDir.x, y: inputDir.y }

    //Part 2: Display of snake and its food wagera
    let board = document.querySelector('.board');
    board.innerHTML = ""

    //Displaying snake
    snakeArr.forEach((element, index) => {
        snakeElement = document.createElement('div');
        board.appendChild(snakeElement);

        snakeElement.style.gridRowStart = element.y; //upar se kaun sa row it goes in y direction, so here element.y to access y
        snakeElement.style.gridColumnStart = element.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake'); //x:13 y:15 wala index 0 hai rest index will be this
        }
    });

    //Displaying Food - isme koi array wagera not need its an individual thingy
    foodElement = document.createElement('div');
    board.appendChild(foodElement);
    foodElement.classList.add('food');
    foodElement.style.gridRowStart = food.y; //these we defined
    foodElement.style.gridColumnStart = food.x;
}


//Main game logic
let HighScore = localStorage.getItem('highScore') || 0;
document.querySelector('.HighScore').innerHTML = "Highest Score: " + HighScore;

window.requestAnimationFrame(main);
window.addEventListener('keydown', (pressedKey) => { //keypress is not used for printable characters.. so we use keydown

    switch (pressedKey.key) {
        case "ArrowUp":
            if (direction.y !== 1) { //only allow if not going down, 180 deg ulta na jaye 
                moveSound.play();
                inputDir = { x: 0, y: -1 }
                break;
            }

        case "ArrowDown":
            if (direction.y != -1) { //if direction is not up only then go down
                moveSound.play();
                inputDir = { x: 0, y: 1 }
                break;
            }

        case "ArrowLeft":
            if (direction.x != 1) {
                moveSound.play();
                inputDir = { x: -1, y: 0 }
                break;
            }

        case "ArrowRight":
            if (direction.x != -1) {
                moveSound.play();
                inputDir = { x: 1, y: 0 }
                break;
            }

        default:
            break;
    }
})