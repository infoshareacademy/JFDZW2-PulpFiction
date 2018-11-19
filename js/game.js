let gameContainer = document.getElementById("game_container");
let resetButton = document.getElementById("resetButton");
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

window.onresize = function () {
    if (gameSettings !== null) {
        gameSettings.setDimensions();
    }
    if (hero !== null) {
        hero.setCurrentAnim();
        hero.setCurrentHeroDimensions();
        updateHeroStyle();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.iniWidth = 40;
        this.iniHeight = 40;
        this.htmlId = "enemy" + Date.now();
        this.enemyType = {};
        this.swing = new Swing();
        this.phase = Math.random() + 0.5;
        this.amplitude = 0.1;
    }
    vx(speed) {
        return -speed;
    }
    vy() {
        return this.amplitude * Math.sin((this.x / (4 * Math.PI)) - 2 * Math.PI / this.phase);
    }
    setAmplitude(amplitude) {
        this.amplitude = amplitude;
    }
};

class Swing {
    constructor() {
        this.swingTime = Date.now();
        this.swingTimer = 0;
        this.animationTime = 700;
        this.swingDegs = [-10, -5, 0, 5, 10, 5, 0, -5];
        this.swingFrames = this.swingDegs.length - 1;
        this.swingSeqNumber = Math.floor(Math.random() * (this.swingFrames));
        this.frameDuration = this.animationTime / this.swingFrames;
        this.swintDeg = this.setSwingDeg();
    }
    setSwingTimer() {
        const oldTimer = this.swingTime;
        this.swingTime = Date.now();
        this.swingTimer += (this.swingTime - oldTimer);
    }
    resetSwingTimer() {
        this.swingTimer = 0;
    }
    setSwingDeg() {
        if (this.swingTimer <= this.frameDuration) {
            this.setSwingTimer();
        } else {
            this.resetSwingTimer();
            this.swingSeqNumber = this.swingSeqNumber < this.swingFrames ? this.swingSeqNumber + 1 : 0;
        }
        this.swingDeg = this.swingDegs[this.swingSeqNumber];
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
    }
    setFramePosition() {
        const currentRow = Math.floor(this.currentFrame / this.framesPerRow);
        const currentFrame = this.currentFrame % this.framesPerRow;
        this.posX = currentFrame / (this.framesPerRow - 1) * 100;
        this.posY = 100 * currentRow / Math.floor((this.frames) / (this.framesPerRow));
    }
    updateFrame() {
        this.currentFrame = (this.currentFrame + 1) % (this.frames + 1);
        this.setFramePosition();
    }
}

const gameSettings = {
    setDimensions: function () {
        this.dimensions = getGameWidthHeight();
    },
    dimensions: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    },
    gameStatus: "stoped"
};

function LoadImage(src) {
    const pic = new Image();
    pic.src = src;
    return pic;
}

const enemyTypes = [{
        id: "beer",
        sprite: LoadImage("img/game/beer1.png"),
        score: -10
    },
    {
        id: "cupcake",
        sprite: LoadImage("img/game/cupcake1.png"),
        score: -5
    },
    {
        id: "dogfood",
        sprite: LoadImage("img/game/dogfood1.png"),
        score: 5
    },
    {
        id: "energydrink",
        sprite: LoadImage("img/game/energydrink.png"),
        score: 5
    },
    {
        id: "hamb",
        sprite: LoadImage("img/game/hamb1.png"),
        score: -10
    },
    {
        id: "soda",
        sprite: LoadImage("img/game/soda1.png"),
        score: -2
    },
    {
        id: "taco",
        sprite: LoadImage("img/game/taco1.png"),
        score: -5
    }
];

const jump = {
    gravityAsc: 0.2,
    gravityDesc: 0.3,
    gravityClimax: 0.05,
    initialVelocity: -4,
}

const enemies = [];
const initialHealth = 30;
const fps = 60;
let interval;
let timeInterval = 0;
let time = Date.now();
let level = 1;
let gameOver = false;
let backgroundPosition = 0;
const initialSpeed = 0.1;
let speed = initialSpeed;
let speedFactor = 1;
const initialEnemyInterval = 5000;
const levelUpScore = 50;

const hero = {
    x: 0,
    y: 50,
    fullHeight: 170,
    fullWidth: 100,
    height: 170,
    width: 100,
    moved: false,
    health: initialHealth,
    score: 0,
    state: "run",
    animRun: new Animation(42, "animate__hero--run", 9, 100, 169),
    animJump: new Animation(24, "animate__hero--jump", 5, 83, 168),

    animRunSmall: new Animation(42, "animate__hero--run", 9, 50, 84),
    animJumpSmall: new Animation(24, "animate__hero--jump", 5, 42, 84),
    jumpInitialY: 0,
    velocity: 0,
    minY: 1000,

    initialize: function () {
        this.changeState("run");
        this.setCurrentHeroDimensions();
    },

    setCurrentAnim: function () {
        if (gameSettings.dimensions.width <= 400) {
            if (this.state === "run") {
                this.currentAnim = this.animRunSmall;
            } else {
                this.currentAnim = this.animJumpSmall;
            }
        } else {
            if (this.state === "run") {
                this.currentAnim = this.animRun;
            } else {
                this.currentAnim = this.animJump;
            }
        }
    },

    changeState: function (state) {
        if (this.state !== "jump" && state === "jump") {
            this.initJump();
            snd("snd/jump.mp3");
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
            if (Math.abs(this.velocity) < 0.2 * Math.abs(jump.initialVelocity)) {
                this.velocity += jump.gravityClimax;
            } else if (this.velocity < 0) {
                this.velocity += jump.gravityAsc;
            } else {
                this.velocity += jump.gravityDesc;
            }
            if (this.jumpInitialY <= this.y) {
                this.finishJump();
                this.changeState("run");
            }
        }
    },

    move: function () {
        if (hero.state === "jump") {
            hero.jumpHero();
        }
    },

    setX: function () {
        this.x = Math.floor(1 / 6 * 100);
    },

    setCurrentHeroDimensions: function () {
        this.width = this.currentAnim.frameWidth;
        this.height = this.currentAnim.frameHeight;
    },

    updateScore: function (score) {
        this.score += score;
    },

    resetScore: function () {
        this.score = 0;
    },

    updateHealth: function (health) {
        console.log(this.health, health);
        this.health += health;
        if (this.health > initialHealth) {
            this.health = initialHealth;
        }
    },

    resetHealth: function () {
        this.health = initialHealth;
    },

    getHeroWidthPerc: function () {
        return 100 * this.width / gameSettings.dimensions.width;
    },

    getHeroHeightPerc: function () {
        return 100 * this.height / gameSettings.dimensions.height;
    }

}

function appendHero() {
    hero.setX();
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

function upLevel() {
    level++;
}

function resetLevel() {
    level = 1;
}

function increaseSpeed() {
    speed = initialSpeed + 0.02 * level;
}

function resetSpeed() {
    speed = initialSpeed;
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.vx(speedFactor * speed);
        enemy.y += enemy.vy();
        enemy.y = enemy.y > 90 ? 90 : enemy.y;
        enemy.swing.setSwingDeg();
    });
}

function randomizeEnemyType() {
    const enemyType = Math.floor(Math.random() * enemyTypes.length);
    return enemyType;
}

function createNewEnemy() {
    const ffps = 60 / fps;
    let levelDelay = 400 * (level - 1);
    levelDelay >= 4000 ? 4000 : levelDelay;
    if (timeInterval >= initialEnemyInterval * ffps - levelDelay) {
        const x = 100;
        const y = 55;
        const newEnemy = new Enemy(x, y);
        newEnemy.setAmplitude(newEnemy.amplitude + 0.01 * (level - 1));
        newEnemy.enemyType = enemyTypes[randomizeEnemyType()];
        newEnemy.x -= newEnemy.iniWidth / gameSettings.dimensions.width * 100;
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
    img.src = enemy.enemyType.sprite.src;
    element.appendChild(img);
    element.setAttribute("id", enemy.htmlId);
    gameContainer.appendChild(element);
    setStyleEnemy(enemy);
}

function removeEnemies() {
    enemies.forEach(object => {
        removeEnemy(object);
    });
}

function removeHero() {
    let hero = document.getElementById("game__hero");
    if (hero) {
        gameContainer.removeChild(hero);
    }
}

function checkCollisions() {
    for (let enemy of enemies) {
        if (enemy.x > hero.x + hero.getHeroWidthPerc() / 4 &&
            enemy.x < hero.x + hero.getHeroWidthPerc() * 3 / 4 &&
            enemy.y < hero.y + hero.getHeroHeightPerc() &&
            enemy.y > hero.y) {
            hero.updateHealth(enemy.enemyType.score);
            removeEnemy(enemy);
            enemies.splice(enemies.indexOf(enemy), 1);
            return true;
        }
    }
    return false;
}

function checkHealth() {
    if (hero.health <= 0) {
        document.querySelector("#gameOver_panel").style.display = "flex";
        clearInterval(interval);
        gameOver = true;
        gameSettings.gameStatus = 'stopped';
    }
}

function checkBoundries() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].x < 0) {
            const score = Math.abs(enemies[i].enemyType.score);
            removeEnemy(enemies[i]);
            enemies.splice(i, 1);
            return score;
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
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    }
}

function drawHero() {
    appendHero();
    hero.currentAnim.updateFrame();
    updateHeroStyle();
}

function updateHeroStyle() {
    const element = document.getElementById("game__hero");
    element.style.left = `${hero.x}%`;
    element.style.top = `${hero.y}%`;
    element.style.backgroundPosition = `${hero.currentAnim.posX}% ${hero.currentAnim.posY}%`
    element.style.width = `${hero.currentAnim.frameWidth}px`;
    element.style.height = `${hero.currentAnim.frameHeight}px`;
}

function setStyleEnemy(enemy) {
    let element = document.getElementById(enemy.htmlId);
    element.style.transform = `rotate(${enemy.swing.swingDeg}deg)`;
    element.style.transformOrigin = 'center top 0';
    element.style.left = `${enemy.x}%`;
    element.style.top = `${enemy.y}%`;
}

function drawEnemies() {
    enemies.forEach(enemy => {
        appendEnemy(enemy);
    });
}

function clearBoard() {
    removeEnemies();
    removeHero();
}

function resetGame() {
    console.log("reset")
    if (gameSettings.gameStatus === 'start') {
        removeEnemies();
        enemies.length = 0;
        hero.resetScore();
        hero.resetHealth();
        resetLevel();
        resetSpeed();
        clearInterval(interval);
        setGameInterval();
        gameOver = false;
    }
}

function animateBackground(speed) {
    backgroundPosition = backgroundPosition < 183.5 ? backgroundPosition + speedFactor * speed : 0;
    const gameBackground = document.getElementById("game_container");
    gameBackground.style.backgroundPosition = `${backgroundPosition}% 0`;
}

function frame() {
    calculateIntervals();
    animateBackground(speed);
    createNewEnemy();
    moveEnemies();
    hero.move();
    const score = checkBoundries();
    if (score) {
        const lastScore = hero.score;
        hero.updateScore(score);
        if (lastScore % levelUpScore > hero.score % levelUpScore) {
            upLevel();
            increaseSpeed();
        }
    }
    if (checkCollisions()) {
        snd("snd/gulp.mp3");
    }
    checkHealth();
    clearBoard();
    drawEnemies();
    drawHero();
}

function snd(filename) {
    let audio = new Audio(filename);
    audio.play();
}

function keyPressHandler(e) {
    if (e.keyCode === 32) {
        hero.changeState("jump");
    } else if (e.keyCode === 39) {
        speedFactor = 3;
    } else if (e.keyCode === 37) {
        speedFactor = 0.5;
    }
}

function keyUpHandler(e) {
    if (e.keyCode !== 32) {
        speedFactor = 1;
    }
}

function getGameBoxTouch(touchX, touchY) {
    const innerX = touchX - gameSettings.dimensions.left >= 0 ? touchX - gameSettings.dimensions.left : 0;
    const innerY = touchY - gameSettings.dimensions.top >= 0 ? touchY - gameSettings.dimensions.top : 0;
    return {
        innerX: innerX,
        innerY: innerY
    };
}

function touchStartHandler(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const innerCoords = getGameBoxTouch(touches[i].pageX, touches[i].pageY);
        if (innerCoords.innerX < gameSettings.dimensions.width / 3) {
            speed = 0.05;
        } else if (innerCoords.innerX >= gameSettings.dimensions.width / 3 &&
            innerCoords.innerX < 2 * gameSettings.dimensions.width / 3) {
            hero.changeState("jump");
        } else {
            speed = 0.3
        }
    }
}

function touchEndHandler(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const innerCoords = getGameBoxTouch(touches[i].pageX, touches[i].pageY);
        if (innerCoords.innerX < gameSettings.dimensions.width / 3 ||
            innerCoords.innerX >= 2 * gameSettings.dimensions.width / 3) {
            speed = 0.1
        }
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

function registerHandlers() {
    document.addEventListener("keydown", keyPressHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    let gameContainer = document.getElementById("game_container");
    gameContainer.addEventListener("touchstart", touchStartHandler, false);
    gameContainer.addEventListener("touchend", touchEndHandler, false);
}


function preloadImages() {
    const preloads = "img/game/hero_jump_small.png,img/game/hero_jump.png,img/game/hero_run_small.png,img/game/hero_run.png,img/game/street1.jpg".split(",");
    preloads.forEach(image => LoadImage(image));
}

function game(event) {
    event.stopPropagation();
    preloadImages();
    startGameChangeBoard();
    gameSettings.setDimensions();
    if (gameSettings.gameStatus === 'stoped') {
        gameSettings.gameStatus = 'start';
        clearInterval(interval);
        hero.initialize();
        registerHandlers();
        setGameInterval();
    }
}




/******************************************************** */

document.getElementById('instruction').addEventListener("click", function () {
    clearInterval(interval);
    document.querySelector('#popupInstruction').style.display = "flex";
});

document.getElementById('bestListButton').addEventListener("click", function () {
    clearInterval(interval);
    document.querySelector('#popupBestList').style.display = "flex";
    setBestResultList();

});

document.querySelectorAll('.c-close').forEach((elem) => {
    elem.addEventListener("click", (event) => {
        event.target.parentNode.parentNode.style.display = "none";
        if (interval && !gameOver) {
            clearInterval(interval);
            setGameInterval();
        }
        //document.querySelector('#popupInstruction').style.display = "none";

    });
})

document.querySelector("#publishButton").addEventListener("click", function () {
    let nick = document.querySelector("#nickInput").value;
    let result = document.querySelector("#resultInput").value;
    let list = JSON.parse(localStorage.getItem("bestList"));

    setBestListToLoaclStorage(item);

    document.querySelector("#gameOver_panel").style.display = "none";
    document.querySelector('#popupBestList').style.display = "flex";
    setBestResultList();
})

function setBestResultList() {
    const elem = document.querySelector("#bestResultList");
    let list = JSON.parse(localStorage.getItem("bestList"));
    if (!list) {
        elem.innerHTML = "1."
    } else {
        let result = "";
        list.forEach((item, index) => {
            result += ((index + 1) + '. ' + item.nick + '\t' + item.point) + '<br>';
        })
        elem.innerHTML = result;
    }
}

function setBestListToLoaclStorage(item) {
    if (!list) {
        localStorage.setItem("bestList", JSON.stringify([{
            nick: nick,
            point: result
        }]));
    } else {
        if (list.length > 9) {
            if (list[9].point < result) {
                list.pop();
                list = addNewResultAndSortList(nick, result);
            }
        } else if (list.length < 10) {
            list = addNewResultAndSortList(nick, result);
        }

        localStorage.setItem("bestList", JSON.stringify(list));

    }
}

function addNewResultAndSortList(nick, result) {
    list.push({
        nick: nick,
        point: result
    });
    return list.sort((a, b) => {
        return b.point - a.point;
    });
}