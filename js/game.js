const gameContainer = document.getElementById("game_container");
const resetButton = document.getElementById("resetButton");
const startButton = document.getElementById("startButton");

preloadImages();
resetButton.addEventListener("click", (event) => resetGame(event));
startButton.addEventListener("click", event => {
    startGameWithMusic(event);
}, false);
startButton.addEventListener("touchstart", event => {
    startGameWithMusic(event);
}, false);
window.onblur = function () {
    if (isGameRunning()) {
        clearInterval(interval)
        if (music) {
            stopSnd(music, true);
        }
    }
};
window.onfocus = function () {
    if (isGameRunning()) {
        clearInterval(interval);
        setGameInterval();
        if (music) {
            continueMusic();
        }
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

function isGameRunning() {
    return gameSettings !== null && gameSettings.gameStatus === 'start' && interval;
}

function startGameWithMusic(event) {
    game(event);
    startMusic();
    setTimeout(() => {
        stopSnd(music);
        continueMusic();
    }, 10);
}

function preloadImages() {
    const preloads = "img/game/hero_jump_small.png,img/game/hero_jump.png,img/game/hero_run_small.png,img/game/hero_run.png,img/game/street1.jpg".split(",");
    preloads.forEach(image => LoadImage(image));
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
        this.setBackgroundToPaneRatio();
    },
    setBackgroundToPaneRatio: function () {
        const backgroundDimensions = getImageDimensions("img/game/street1.jpg");
        const coverBackgroundDims = {
            width: backgroundDimensions.width * this.dimensions.height / backgroundDimensions.height,
            height: this.dimensions.height
        }
        this.backgroundRatio = coverBackgroundDims.width - this.dimensions.width !== 0 ?
            coverBackgroundDims.width / (coverBackgroundDims.width - this.dimensions.width) * 100 : 183.5;
    },
    dimensions: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    },
    backgroundRatio: 183.5,
    gameStatus: "stopped"
};

function LoadImage(src) {
    const pic = new Image();
    pic.src = src;
    return pic;
}

function getImageDimensions(image) {
    const loadedImg = LoadImage(image)

    return {
        width: loadedImg.width,
        height: loadedImg.height
    };
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
let timeout;
let timeInterval = 0;
let time = Date.now();
let level = 1;
let backgroundPosition = 0;
const initialSpeed = 0.1;
let speed = initialSpeed;
let speedFactor = 1;
const initialEnemyInterval = 5000;
const levelUpScore = 50;
let music;

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
    inertia: 0,
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
        this.health += health;
        if (this.health > initialHealth) {
            this.health = initialHealth;
        };
        this.updateInertia();
    },

    resetHealth: function () {
        this.health = initialHealth;
        this.resetInertia();
    },

    updateInertia: function () {
        this.inertia = (initialHealth - this.health) * 20;
    },

    resetInertia: function () {
        this.inertia = 0;
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
    const hero = document.getElementById("game__hero");
    if (hero) {
        gameContainer.removeChild(hero);
    }
}

function renderScores() {
    const docLevel = document.getElementById("game-level");
    const docScore = document.getElementById("game-score");
    const docHealth = document.getElementById("game-health");

    docLevel.innerText = `LEVEL ${level}`;
    docScore.innerText = `SCORE ${hero.score}`;
    docHealth.innerText = `HEALTH ${hero.health < 0 ? 0 : hero.health}`;
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
        clearInterval(interval);
        stopSnd(music);
        return 'gameOver';
    }
    return 'start';
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

function resetGame(event) {
    removeEnemies();
    enemies.length = 0;
    hero.resetScore();
    hero.resetHealth();
    resetLevel();
    renderScores()
    resetSpeed();
    clearInterval(interval);
    gameSettings.gameStatus = 'stopped';
    showStartButton();
    stopSnd(music);
}

function animateBackground(speed) {
    backgroundPosition = backgroundPosition < gameSettings.backgroundRatio ? backgroundPosition + speedFactor * speed : 0;
    const gameBackground = document.getElementById('game_container');
    gameBackground.style.backgroundPosition = `${backgroundPosition}% 0`;
}

function frame() {
    calculateIntervals();
    animateBackground(speed);
    createNewEnemy();
    moveEnemies();
    hero.move();
    changeScore();
    if (checkCollisions()) {
        renderScores();
        snd("snd/gulp.mp3");
    }
    gameSettings.gameStatus = checkHealth();
    if (gameSettings.gameStatus === 'gameOver') {
        openGameOverPanel();
        resetGame(null);
    }
    clearBoard();
    drawEnemies();
    drawHero();

    function changeScore() {
        const score = checkBoundries();
        if (score) {
            const lastScore = hero.score;
            hero.updateScore(score);
            if (lastScore % levelUpScore > hero.score % levelUpScore) {
                upLevel();

                increaseSpeed();
            }
            renderScores();
        }
    }
}

function snd(filename, loop = false) {
    const audio = new Audio(filename);
    if (loop) {
        audio.volume = 0;
        audio.play().then(() => {
            audio.pause()

        });
    } else {
        audio.play();
    }
    audio.loop = loop;
    return audio;
}

function stopSnd(audio, pause = false) {
    audio.pause();
    if (!pause) {
        audio.currentTime = 0;
    }
}

function continueMusic() {
    if (music) {
        music.play();
    }
}

function startMusic() {
    music = snd('snd/bground.mp3', true);
    music.volume = 0.2;
}



function keyPressHandler(e) {
    if (e.keyCode === 32) {
        setTimeout(() => hero.changeState("jump"), hero.inertia, false);
    } else if (e.keyCode === 39) {
        setTimeout(() => speedFactor = 3, hero.inertia, false);
    } else if (e.keyCode === 37) {
        setTimeout(() => speedFactor = 0.5, hero.inertia, false);
    }
}

function keyUpHandler(e) {
    if (e.keyCode !== 32) {
        setTimeout(() => speedFactor = 1, hero.inertia, false);
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
            setTimeout(() => speedFactor = 0.5, hero.inertia, false);
        } else if (innerCoords.innerX >= gameSettings.dimensions.width / 3 &&
            innerCoords.innerX < 2 * gameSettings.dimensions.width / 3) {
            setTimeout(() => hero.changeState("jump"), hero.inertia, false);
        } else {
            setTimeout(() => speedFactor = 3, hero.inertia, false);
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
            setTimeout(() => speedFactor = 1, hero.inertia, false);
        }
    }
}


function hideStartButton() {
    if (!startButton.classList.contains('u--hide')) {
        startButton.classList.add('u--hide');
    }
}

function showStartButton() {
    if (startButton.classList.contains('u--hide')) {
        startButton.classList.remove('u--hide');
    }
}

function startGameChangeBoard() {
    const game_container = document.getElementById("game_container");
    game_container.classList.add("game_container");
    game_container.classList.remove("c-game-container__start");
    game_container.style.display = "block";
    hideStartButton();
}

function setGameInterval() {
    interval = setInterval(frame, 1000 / fps);
}

function registerHandlers() {
    document.addEventListener("keydown", keyPressHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    gameContainer.addEventListener("touchstart", touchStartHandler, false);
    gameContainer.addEventListener("touchend", touchEndHandler, false);
}

function openGameOverPanel() {
    document.querySelector("#gameOver_panel").style.display = "flex";
    document.getElementById("resultInput").value = hero.score;
}


function game(event) {
    event.stopPropagation();
    startGameChangeBoard();
    gameSettings.setDimensions();
    if (gameSettings.gameStatus === 'stopped') {
        gameSettings.gameStatus = 'start';
        renderScores();
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
        if (isGameRunning()) {
            clearInterval(interval);
            setGameInterval();
        }
    });
})

document.querySelector("#publishButton").addEventListener("click", function () {
    setBestListToLocalStorage();
    document.querySelector("#gameOver_panel").style.display = "none";
    document.querySelector('#popupBestList').style.display = "flex";
    setBestResultList();
    document.querySelector('#popupBestList').style.display = "none";
})

function setBestResultList() {
    const elem = document.querySelector("#bestResultList");
    let list = JSON.parse(localStorage.getItem("bestList"));
    if (!list) {
        elem.innerHTML = "";
    } else {
        let result = '<table style="width:100%"> ';
        list.forEach((item, index) =>
            result += "<tr><td>" + (index + 1) + '.</td><td>' + item.nick + '</td><td>' + item.point) + '</td></tr>';
        elem.innerHTML = result + "</table>";
    }
}

function setBestListToLocalStorage() {
    let nick = document.querySelector("#nickInput").value;
    let result = document.querySelector("#resultInput").value;
    let list = JSON.parse(localStorage.getItem("bestList"));

    if (!list) {
        localStorage.setItem("bestList", JSON.stringify([{
            nick: nick,
            point: result
        }]));
    } else {
        if (list.length > 9) {
            if (list[9].point < result) {
                list.pop();
                list = addNewResultAndSortList(list, nick, result);
            }
        } else if (list.length < 10) {
            list = addNewResultAndSortList(list, nick, result);
        }

        localStorage.setItem("bestList", JSON.stringify(list));

    }
}

function addNewResultAndSortList(list, nick, result) {
    list.push({
        nick: nick,
        point: result
    });
    return list.sort((a, b) => b.point - a.point);
}