document.addEventListener("DOMContentLoaded", game);

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -1;
        this.vy = 0;
        this.iniWidth = 15;
        this.iniHeight = 15;
        this.htmlId = "enemy" + Date.now();
        this.scale = 1;
        this.sprites = [];
        this.currentSprite = 1;
        this.phase = 1;
    }
};

const enemies = []
let timeInterval = 0;
let time = Date.now();
let noSwimLines = 4;
let level = 1;
const dimensions = getGameWidthHeight();
let upPressed = false;
let downPressed = false;
let interval;

const hero = {
    x: dimensions.width / 6,
    swLine: 1,
    height: 40,
    moved: false
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
        const newEnemy = new Enemy(x, y)
        newEnemy.x -= newEnemy.iniWidth;
        enemies.push(newEnemy);
        appendEnemy(newEnemy)
        resetIntervals();
    }
}

function appendEnemy(enemy) {
    const gameContainer = document.getElementById("game_container");
    const element = document.createElement("div");
    element.classList.add("animate");
    element.setAttribute("id", enemy.htmlId);
    gameContainer.appendChild(element);
}

function moveHero() {
    if (!hero.moved) {
        if (downPressed) {
            downPressed = false;
            hero.swLine++;
            hero.moved = true;
        }
        if (hero.swLine > noSwimLines) {
            hero.swLine = noSwimLines;
        }
        if (upPressed) {
            upPressed = false;
            hero.swLine--;
            hero.moved = true;
        }
        if (hero.swLine < 1) {
            hero.swLine = 1;
        }
    }
    if (!upPressed && !downPressed) {
        hero.moved = false;
    }
    console.log(hero.swLine);
}

function checkCollisions() {
    const adjustPosition = -dimensions.height / (2 * noSwimLines);
    for (let enemy of enemies) {
        
        let heroy = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition);

        if (enemy.x > hero.x && enemy.x < hero.x + 13 &&
            enemy.y < heroy + 40
            && enemy.y > heroy - 40) {
            clearInterval(interval);
            alert("GameOver");
        }

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