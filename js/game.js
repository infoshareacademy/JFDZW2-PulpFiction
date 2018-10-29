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
    constructor(frames, animationClass, framesPerRow, frameWidth, frameHeight) {
        this.animationClass = animationClass;
        this.frames = frames;
        this.framesPerRow = framesPerRow;
        this.currentFrame = 0;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.posX = 0;
        this.posY = 0;

        this.setFramePosition = () => {
            const currentRow = Math.floor(this.currentFrame / this.framesPerRow);
            const currentFrame = this.currentFrame % this.framesPerRow;
            this.posX = currentFrame / (this.framesPerRow - 1) * 100;
            this.posY = 100 * currentRow / Math.floor((this.frames) / (this.framesPerRow));
        }

        this.updateFrame = () => {
            this.currentFrame = (this.currentFrame + 1) % (this.frames + 1);
            this.setFramePosition();
        }
    }
}

const gameSettings = {
    setDimensions: function () {
        this.dimensions = getGameWidthHeight();
        this.dimensions.noSwimLines = 2;
    },
    dimensions: {
        width: 0,
        height: 0,
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

const jump = {
    gravityAsc: 0.5,
    gravityDesc: 0.6,
    gravityClimax: 0.2,
    initialVelocity: -16,
}

let enemies = [];
const initialHealth = 30;
const fps = 60;
let interval;
let timeInterval = 0;
let time = Date.now();
let level = 3;
let gameOver = false;
let backgroundPosition = 0;

const hero = {
    x: 0,
    y: 320,
    swLine: 2,
    height: 170,
    width: 100,
    moved: false,
    health: initialHealth,
    state: "run",
    animRun: new Animation(42, "animate__hero--run", 9, 100, 169),
    animJump: new Animation(24, "animate__hero--jump", 5, 83, 168),

    jumpInitialY: 0,
    velocity: 0,
    minY: 1000,


    setCurrentAnim: function () {
        if (this.state === "run") {
            this.currentAnim = this.animRun;
        } else {
            this.currentAnim = this.animJump;
        }
    },

    changeState: function (state) {
        if (this.state !== "jump" && state === "jump") {
            this.initJump();
        }
        this.state = state;
        this.setCurrentAnim();
    },

    initJump: function () {
        this.velocity = jump.initialVelocity;
        this.jumpInitialY = this.y;
    },

    finishJump: function () {
        this.initialVelocity = 0;
        this.y = this.jumpInitialY;
    },

    jumpHero: function () {
        if (this.state === "jump") {
            this.y += this.velocity;
            this.minY = this.minY < this.y ? this.minY : this.y
            if (this.velocity < 0) {
                this.velocity += jump.gravityAsc;
            } else if (Math.abs(this.velocity) < 0.2 * Math.abs(jump.initialVelocity)) {
                this.velocity += jump.gravityClimax;
            } else {
                this.velocity += jump.gravityDesc;
            }
            if (this.jumpInitialY <= this.y) {
                this.changeState("run");
                this.finishJump();
            }
        }
        console.log(this.y, this.velocity);
    },

    moveHero: function () {
        if (hero.state === "jump") {
            hero.jumpHero();
        }
    },

    setY: function () {
        const dimensions = gameSettings.dimensions;
        const adjustPosition = -dimensions.height / dimensions.noSwimLines;
        this.y = Math.floor(dimensions.height / dimensions.noSwimLines * this.swLine + adjustPosition);
    },

    setX: function () {
        this.x = Math.floor(gameSettings.dimensions.width / 6);
    }
}



function appendHero() {
    hero.setX();
    //hero.setY();
    hero.changeState(hero.state);
    const element = document.createElement("div");
    element.classList.add("animate__hero", hero.currentAnim.animationClass);
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
    const sw = Math.floor(Math.random() * gameSettings.dimensions.noSwimLines) + 1;
    return sw;
}

function chooseEnemySwimLine() {
    const swNumber = randomizeSwimLine() / gameSettings.dimensions.noSwimLines;
    return swNumber;
}

function createNewEnemy() {
    if (timeInterval >= 5000 * (60 / fps) / level) {
        const dimensions = gameSettings.dimensions;
        const x = dimensions.width;
        const adjustPosition = -3 / 4 * dimensions.height / dimensions.noSwimLines;
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



function checkCollisions() {
    for (let enemy of enemies) {
        if (enemy.x > hero.x + hero.width / 4 && enemy.x < hero.x + hero.width * 3 / 4 &&
            enemy.y < hero.y + hero.height && enemy.y > hero.y) {
            changeScore(enemy);
            removeEnemy(enemy);
            enemies.splice(enemies.indexOf(enemy), 1);
            return true;
        }
    }
    return false;
}

function changeScore(enemy) {
    hero.health += enemy.enemyType.score;

    if (hero.health <= 0) {
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
            return true;
        }
    }
    return false;
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
    hero.currentAnim.updateFrame();
    const element = document.getElementById("game__hero");
    element.style.transform = `translate(${hero.x}px, ${hero.y}px)`;
    element.style.backgroundPosition = `${hero.currentAnim.posX}% ${hero.currentAnim.posY}%`
    element.style.width = `${hero.currentAnim.frameWidth}px`;
    element.style.height = `${hero.currentAnim.frameHeight}px`;
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
    hero.moveHero();
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
    if (e.keyCode === 32) {
        hero.changeState("jump");
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
        //appendHero();
        document.addEventListener("keydown", keyPressHandler, false);
        setGameInterval();
    }

}