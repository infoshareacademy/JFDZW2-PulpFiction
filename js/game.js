let gameContainer = document.getElementById("game_container");
let resetButton = document.querySelector('.c-reset__button');
resetButton.addEventListener("click", function () {
    resetGame();
})

window.onblur = function() { if(interval){
    clearInterval(interval)} };
window.onfocus = function() { if(interval && !gameOver){
    clearInterval(interval);
setGameInterval();} };

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -1;
        this.vy = 0;
        this.iniWidth = 30;
        this.iniHeight = 30;
        this.htmlId = "enemy" + Date.now();
        this.enemyType = {};
    }
};
const gameSettings = {
    setDimensions: function () {
        this.dimensions = getGameWidthHeight();
    },
    dimensions: {
        width: 0,
        height: 0

    },
    gameStatus: "stoped"
};

const enemyTypes = [{
    id: "beer",
    sprite: "beer1.png",
    score: -10
},
{
    id: "cupcake",
    sprite: "cupcake1.png",
    score: -5
},
{
    id: "dogfood",
    sprite: "dogfood1.png",
    score: 5
},
{
    id: "energydrink",
    sprite: "energydrink.png",
    score: 5
},
{
    id: "hamb",
    sprite: "hamb1.png",
    score: -10
},
{
    id: "soda",
    sprite: "soda1.png",
    score: -2
},
{
    id: "taco",
    sprite: "taco1.png",
    score: -5
}
];

let enemies = [];
const initialScore = 30;
let timeInterval = 0;
let time = Date.now();
let noSwimLines = 3;
let level = 1;


let upPressed = false;
let downPressed = false;
let interval;
let gameOver=false;


const hero = {
    x: 0,
    swLine: 1,
    height: 40,
    moved: false,
    score: initialScore
}

function appendHero() {
    hero.x = gameSettings.dimensions.width / 6;
    const element = document.createElement("div");
    element.classList.add("animate__hero");
    element.setAttribute("id", "game__hero");
    gameContainer.appendChild(element);
}

function calculateIntervals() {
    const oldTime = time;
    time = Date.now();
    timeInterval += (time - oldTime);
}

function resetIntervals() {
    timeInterval = 0;
}



function moveEnemies() {
    for (let enemy of enemies) {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
    }
}

function randomizeEnemmyType() {
    const enemyType = Math.floor(Math.random() * enemyTypes.length);
    return enemyType;
}

function randomizeSwimLine(noSwimLines) {
    const sw = Math.floor(Math.random() * noSwimLines) + 1;
    return sw;
}

function chooseEnemySwimLine() {
    const swNumber = randomizeSwimLine(noSwimLines) / noSwimLines;
    return swNumber;
}

function createNewEnemy() {
    if (timeInterval >= 5000 / level) {
        const dimensions = gameSettings.dimensions;
        const x = dimensions.width;
        const adjustPosition = -dimensions.height / (2 * noSwimLines);
        const y = Math.floor(dimensions.height * chooseEnemySwimLine()) + adjustPosition;
        const newEnemy = new Enemy(x, y);
        newEnemy.enemyType = enemyTypes[randomizeEnemmyType()];
        newEnemy.x -= newEnemy.iniWidth;
        enemies.push(newEnemy);
        appendEnemy(newEnemy)
        resetIntervals();
    }
}

function appendEnemy(enemy) {
    const element = document.createElement("div");
    const img = document.createElement("img");
    element.classList.add("animate");
    img.classList.add("animate");
    img.setAttribute("src", `img/game/${enemy.enemyType.sprite}`);
    element.appendChild(img);
    element.setAttribute("id", enemy.htmlId);
    gameContainer.appendChild(element);
}

function removeEnemies() {
    for (let object of enemies) {
        removeEnemy(object);
    }
}

function removeHero() {
    let hero = document.getElementById("game__hero");
    if (hero) {
        gameContainer.removeChild(hero);
    }
}

function moveHero() {
    if (!hero.moved) {
        if (downPressed) {
            downPressed = false;
            if (hero.swLine < noSwimLines) hero.swLine++;
            hero.moved = true;
        }
        if (upPressed) {
            upPressed = false;
            if (hero.swLine > 1) hero.swLine--;
            hero.moved = true;
        }
    }
    if (!upPressed && !downPressed) {
        hero.moved = false;
    }
    //console.log(hero.swLine);
}

function checkCollisions() {
    const dimensions = gameSettings.dimensions;
    const adjustPosition = -dimensions.height / (2 * noSwimLines);
    for (let enemy of enemies) {

        let heroy = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition);

        if (enemy.x > hero.x + 6 && enemy.x < hero.x + 9 &&
            enemy.y < heroy + hero.height / 2 &&
            enemy.y > heroy - hero.height / 2) {
            changeScore(enemy);
            break;
        }

    }
}

function changeScore(enemy) {
    hero.score += enemy.enemyType.score;
    console.log(hero.score);

    if (hero.score <= 0) {
        alert("Game Over!!!!");
        clearInterval(interval);
        gameOver=true;
    }
}

function checkBoundries() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].x < 0) {
            removeEnemy(enemies[i]);
            enemies.splice(i, 1);
        }
    }
}

function removeEnemy(enemy) {
    const element = document.getElementById(enemy.htmlId);
    if (element !== null) {
        element.parentNode.removeChild(element);
    }
}

function getGameWidthHeight() {
    const gameContainer = document.getElementById("game_container");
    const rect = gameContainer.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    }
}

function drawHero() {
    appendHero();
    const element = document.getElementById("game__hero");
    const dimensions = gameSettings.dimensions;
    const adjustPosition = -dimensions.height / (2 * noSwimLines);
    element.style.left = hero.x + 'px';
    element.style.top = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition) + 'px';

}

function drawEnemies() {
    for (let enemy of enemies) {
        appendEnemy(enemy);
        let element = document.getElementById(enemy.htmlId);
        element.style.top = enemy.y + 'px';
        element.style.left = enemy.x + 'px';

    }
}

function clearBoard() {
    removeEnemies();
    removeHero();

}

function resetGame() {
    removeEnemies();
    enemies = [];
    hero.swLine = 1;
    clearInterval(interval);
    interval = setInterval(frame, 1000 / 60);
    gameOver=false;
}

function frame() {
    calculateIntervals();
    moveEnemies();
    moveHero();
    checkBoundries();
    checkCollisions();
    createNewEnemy();
    clearBoard();
    drawEnemies();
    drawHero();
}

function keyPressHandler(e) {
    if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    }
}

function startGameChangeBoard(){
    const game_container = document.getElementById("game_container");
    game_container.classList.add("game_container");
    game_container.classList.remove("c-game-container__start");
    game_container.style.display = "block";
    const buttonStart = document.querySelector(".c-button__start");
    buttonStart.style.display="none";
}

function setGameInterval(){
    interval = setInterval(frame, 1000 / 60);
}

function game() {
    startGameChangeBoard();
    gameSettings.setDimensions();
    if (gameSettings.gameStatus === 'stoped') {
        gameSettings.gameStatus = 'start';
        clearInterval(interval);
        appendHero();
        document.addEventListener("keydown", keyPressHandler, false);
        setGameInterval();
    }

}

