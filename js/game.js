let gameContainer = document.getElementById("game_container");
let resetButton = document.querySelector('.c-reset__button');
resetButton.addEventListener("click", function () {
    resetGame();
})

window.onblur = function () {
    if (interval) {
        clearInterval(interval)
    }
};

window.onfocus = function () {
    if (interval && !gameOver) {
        clearInterval(interval);
        setGameInterval();
    }
};

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -1;
        this.vy = 0;
        this.iniWidth = 40;
        this.iniHeight = 40;
        this.htmlId = "enemy" + Date.now();
        this.enemyType = {};
        this.swing = new Swing();
        this.swingDeg = this.swing.swingDeg();
    }
};

class Swing {
    constructor() {
        this.swingTime = Date.now();
        this.swingTimer = 0;
        this.swingFrames = 7;
        this.swingSeqNumber = Math.floor(Math.random() * (this.swingFrames + 1));
        this.animationTime = 700;
        this.frameDuration = this.animationTime / this.swingFrames;
        this.swingDegs = [-10, -5, 0, 5, 10, 5, 0, -5];

        this.setSwingTimer = () => {
            const oldTimer = this.swingTime;
            this.swingTime = Date.now();
            this.swingTimer += (this.swingTime - oldTimer);
        }

        this.resetSwingTimer = () => {
            this.swingTimer = 0;
        }

        this.swingDeg = () => {
            if (this.swingTimer <= this.frameDuration) {
                this.setSwingTimer();
            } else {
                this.resetSwingTimer();
                this.swingSeqNumber = this.swingSeqNumber < this.swingFrames ? this.swingSeqNumber + 1 : 0;
            }
            return this.swingDegs[this.swingSeqNumber];
        }
    }
};

class Animation {
    constructor(frames, filePrefix, fileSuffix) {
        this.directory = "img/game";
        this.filePrefix = filePrefix;
        this.fileSuffix = fileSuffix;
        this.file = `${this.directory}/${this.filePrefix}000.${this.fileSuffix}`;
        this.frames = frames;
        this.currentFrame = 0;

        this.getFrameString = () => {
            const countString = `00${this.currentFrame}`;
            return countString.substr(countString.length - 3);
        }

        this.updateFrame = () => {
            this.currentFrame = (this.currentFrame + 1) % (this.frames + 1);
            this.file = `${this.directory}/${this.filePrefix}${this.getFrameString()}.${this.fileSuffix}`;
        }
    }
}


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
const fps = 60;
let interval;
let timeInterval = 0;
let time = Date.now();
let noSwimLines = 2;
let level = 3;
let upPressed = false;
let downPressed = false;
let gameOver = false;
let backgroundPosition = 0;


const hero = {
    x: 0,
    swLine: 1,
    height: 175,
    width: 100,
    moved: false,
    score: initialScore,
    state: "run",
    animRun: new Animation(42, "run/r_", "png"),
    animJump: new Animation(24, "jump/j_", "png"),
    currentAnim: null
}



function setCurrentAnimHero() {
    if (hero.state === "run") {
        hero.currentAnim = hero.animRun;
    } else {
        hero.currentAnim = hero.animJump;
    }
}

function animateHero() {
    setCurrentAnimHero();
    hero.currentAnim.updateFrame();
    const elHero = document.getElementById("game__hero");
    elHero.style.background = `url(${hero.currentAnim.file}) no-repeat`;
}

function preloadAnimations() {
    let frames = hero.animRun.frames;
    const elHero = document.getElementById("game__hero");
    for (i = 0; i < frames; i++) {
        hero.animRun.updateFrame();
        elHero.style.background = `url(${hero.animRun.file}) no-repeat`;
    }

    frames = hero.animJump.frames;
    for (i = 0; i < frames; i++) {
        hero.animRun.updateFrame();
        elHero.style.background = `url(${hero.animJump.file}) no-repeat`;
    }
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
        enemy.swingDeg = enemy.swing.swingDeg();
    }
}

function randomizeEnemyType() {
    const enemyType = Math.floor(Math.random() * enemyTypes.length);
    return enemyType;
}

function randomizeSwimLine() {
    const sw = Math.floor(Math.random() * noSwimLines) + 1;
    return sw;
}

function chooseEnemySwimLine() {
    const swNumber = randomizeSwimLine() / noSwimLines;
    return swNumber;
}

function createNewEnemy() {
    if (timeInterval >= 5000 * (60 / fps) / level) {
        const dimensions = gameSettings.dimensions;
        const x = dimensions.width;
        const adjustPosition = -3 / 4 * dimensions.height / noSwimLines;
        const y = Math.floor(dimensions.height * chooseEnemySwimLine()) + adjustPosition;
        const newEnemy = new Enemy(x, y);
        newEnemy.enemyType = enemyTypes[randomizeEnemyType()];
        newEnemy.x -= newEnemy.iniWidth;
        enemies.push(newEnemy);
        appendEnemy(newEnemy);
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
    setStyleEnemy(enemy);
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

function heroY() {
    const dimensions = gameSettings.dimensions;
    const adjustPosition = -dimensions.height / noSwimLines;
    const heroy = Math.floor(dimensions.height / noSwimLines * hero.swLine + adjustPosition);
    return heroy;
}


function jump() {
    hero.state = 'jump';
    

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
}

function checkCollisions() {
    const heroy = heroY();
    for (let enemy of enemies) {
        if (enemy.x > hero.x + hero.width / 4 && enemy.x < hero.x + hero.width * 3 / 4 &&
            enemy.y < heroy + hero.height && enemy.y > heroy) {
            changeScore(enemy);
            removeEnemy(enemy);
            enemies.splice(enemies.indexOf(enemy), 1);
            return true;
        }
    }
    return false;
}

function changeScore(enemy) {
    //hero.score += enemy.enemyType.score;
    //console.log(hero.score);

    if (hero.score <= 0) {
        //alert("Game Over!!!!");
        //clearInterval(interval);
        //gameOver = true;
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
    animateHero();
    const element = document.getElementById("game__hero");
    element.style.left = hero.x + 'px';
    element.style.top = heroY() + 'px';
}

function setStyleEnemy(enemy) {
    let element = document.getElementById(enemy.htmlId);
    element.style.transform = `translate(${enemy.x}px, ${enemy.y}px) rotate(${enemy.swingDeg}deg)`;
    element.style.transformOrigin = 'center top 0';
}

function drawEnemies() {
    for (let enemy of enemies) {
        appendEnemy(enemy);
    }
}

function clearBoard() {
    removeEnemies();
    removeHero();

}

function resetGame() {
    if (gameSettings.gameStatus === 'start') {
        removeEnemies();
        enemies = [];
        hero.swLine = 1;
        clearInterval(interval);
        setGameInterval();
        gameOver = false;
    }
}

function animateBackground() {
    backgroundPosition = backgroundPosition > 0 ? backgroundPosition - 1 : 1757;
    const gameBackground = document.getElementById("game_container");
    gameBackground.style.backgroundPosition = `${backgroundPosition}px 0`;
}

function frame() {
    calculateIntervals();
    animateBackground();
    createNewEnemy();
    moveEnemies();
    moveHero();
    checkBoundries();
    if (checkCollisions()) {
        gulp("snd/gulp.mp3");
    }
    clearBoard();
    drawEnemies();
    drawHero();
}


function gulp(filename) {
    let audio = new Audio(filename);
    audio.play();
}

function keyPressHandler(e) {
    if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    }
}

function startGameChangeBoard() {
    const game_container = document.getElementById("game_container");
    game_container.classList.add("game_container");
    game_container.classList.remove("c-game-container__start");
    game_container.style.display = "block";
    const buttonStart = document.querySelector(".c-button__start");
    buttonStart.style.display = "none";
}


function setGameInterval() {
    interval = setInterval(frame, 1000 / fps);
}

function game() {
    startGameChangeBoard();
    gameSettings.setDimensions();
    if (gameSettings.gameStatus === 'stoped') {
        gameSettings.gameStatus = 'start';
        clearInterval(interval);
        appendHero();
        preloadAnimations();
        document.addEventListener("keydown", keyPressHandler, false);
        setGameInterval();
    }

}