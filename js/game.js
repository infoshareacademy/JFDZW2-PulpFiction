document.addEventListener("DOMContentLoaded", game);

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

const enemies = [];
const initialScore = 200;
let timeInterval = 0;
let time = Date.now();
let noSwimLines = 3;
let level = 5;
const dimensions = getGameWidthHeight();
let upPressed = false;
let downPressed = false;
let interval;


const hero = {
    x: dimensions.width / 6,
    swLine: 1,
    height: 40,
    moved: false,
    score: initialScore
}

function appendHero() {
    const gameContainer = document.getElementById("game_container");
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
    const gameContainer = document.getElementById("game_container");
    const element = document.createElement("div");
    const img = document.createElement("img");
    element.classList.add("animate");
    img.classList.add("animate");
    img.setAttribute("src", `img/game/${enemy.enemyType.sprite}`);
    element.appendChild(img);
    element.setAttribute("id", enemy.htmlId);
    gameContainer.appendChild(element);
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
    const adjustPosition = -dimensions.height / (2 * noSwimLines);
    for (let enemy of enemies) {

        let heroy = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition);

        if (enemy.x > hero.x && enemy.x < hero.x + 13 &&
            enemy.y < heroy + hero.height / 2 &&
            enemy.y > heroy - hero.height / 2) {
            changeScore(enemy);
        }

    }
}

function changeScore(enemy) {
    hero.score += enemy.enemyType.score;
    console.log(hero.score);

    if (hero.score < 0) {
        alert("Game Over!!!!");
        clearInterval(interval);
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
    const element = document.getElementById("game__hero");
    const adjustPosition = -dimensions.height / (2 * noSwimLines);
    element.style.left = hero.x + 'px';
    element.style.top = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition) + 'px';
}

function drawEnemies() {
    for (let enemy of enemies) {
        const element = document.getElementById(enemy.htmlId);
        element.style.top = enemy.y + 'px';
        element.style.left = enemy.x + 'px';
    }
}

function frame() {
    calculateIntervals();
    moveEnemies();
    moveHero();
    checkBoundries();
    checkCollisions();
    createNewEnemy();
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

function game() {
    appendHero();
    document.addEventListener("keydown", keyPressHandler, false);
    interval = setInterval(frame, 1000 / 60);
}