const MAX_SHAPE_IN_GAME = 5;
const START_LIVES_COUNT = 3;
const ADD_SHAPE_TIME_DIFFERENCE = 600;
const START_GAME_SPEED = 1000;

let gameBox, gameBoxWidth, gameBoxHeight;
let sidebar;
let scoreText;
let livesText;
let startGameBtn, endGameBtn;
let interval;
let score = 0;
let lives = START_LIVES_COUNT;
let shapeList = [];
let addShapeTime = 0;
let currentGameSpeed = START_GAME_SPEED;

const Message = {
    LOSE: {text: 'شما باختید', iconClass: 'fa-frown'},
    END_GAME: {text: 'بازی تمام شد', iconClass: 'fa-smile'}
};

let shapeKeys;
const Shape = {
    SQUARE: {className: 'square', colorProperty: 'backgroundColor'},
    CIRCLE: {className: 'circle', colorProperty: 'backgroundColor'},
    PARALLELOGRAM: {className: 'parallelogram', colorProperty: 'backgroundColor'},
    rectangle: {className: 'rectangle', colorProperty: 'backgroundColor'},
    EGG: {className: 'egg', colorProperty: 'backgroundColor'},
    TRIANGLE_UP: {className: 'triangle-up', colorProperty: 'borderBottomColor'},
    TRIANGLE_DOWN: {className: 'triangle-down', colorProperty: 'borderTopColor'},
    TRIANGLE_LEFT: {className: 'triangle-left', colorProperty: 'borderRightColor'},
    TRIANGLE_RIGHT: {className: 'triangle-right', colorProperty: 'borderLeftColor'},
};

let colorKeys;
const Color = {
    MAROON: 'maroon',
    RED: 'red',
    ORANGE: 'orange',
    YELLOW: 'yellow',
    OLIVE: 'olive',
    GREEN: 'green',
    PURPLE: 'purple',
    FUCHSIA: 'fuchsia',
    LIME: 'lime',
    TEAL: 'teal',
    AQUA: 'aqua',
    BLUE: 'blue',
    NAVY: 'navy',
};

document.addEventListener('DOMContentLoaded', initGame(), false);

function initGame() {
    init();
    addStartGameEvents();
}

function init() {
    gameBox = document.getElementById('gameBox');
    gameBoxWidth = gameBox.clientWidth;
    gameBoxHeight = gameBox.clientHeight;

    sidebar = document.getElementById('sidebar');

    shapeKeys = Object.keys(Shape);
    colorKeys = Object.keys(Color);
    scoreText = document.getElementById('score');
    livesText = document.getElementById('lives');

    startGameBtn = document.getElementById('startGameBtn');
    endGameBtn = document.getElementById('endGameBtn');
}

function addShape() {
    shapeList.push(createRandomShape());
}

function removeShape(shape) {
    let index = shapeList.indexOf(shape);
    if (index >= 0) {
        gameBox.removeChild(shape);
        shapeList.splice(index, 1);
        return true;
    }
    return false;
}

function createRandomShape() {
    let shape = document.createElement("div");
    let randomShape = getRandomShape();
    shape.classList.add('shape');
    shape.classList.add(randomShape.className);
    gameBox.appendChild(shape);

    shape.style.left = getRandomPosition(100, gameBoxWidth - 100) - shape.clientWidth + "px";
    shape.style.cursor = 'pointer';
    shape.style.top = '0';
    shape.style.opacity = '0';

    shape.style[randomShape.colorProperty] = getRandomColor();

    shape.addEventListener("mousedown", onShapeMouseDown);
    return shape;
}

function getRandomShape() {
    return Shape[shapeKeys[shapeKeys.length * Math.random() << 0]];
}

function getRandomColor() {
    return Color[colorKeys[colorKeys.length * Math.random() << 0]];
}

function getRandomPosition(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function timerStart() {
    if (!interval) {
        interval = setInterval(gameTick, 30)
    }
}

function timerStop() {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
}

function gameTick() {
    if (shapeList.length < MAX_SHAPE_IN_GAME && (Date.now() - addShapeTime > ADD_SHAPE_TIME_DIFFERENCE)) {
        addShapeTime = Date.now() - (Math.random() * ADD_SHAPE_TIME_DIFFERENCE);
        addShape();
    }
    for (let shape of shapeList) {
        shape.style.opacity = parseFloat(shape.style.opacity) + (currentGameSpeed / 30000);
        shape.style.top = parseInt(shape.style.top) + (currentGameSpeed / 500) + 'px';
        if (shape.offsetTop + shape.clientHeight - 2 >= gameBoxHeight) {
            removeShape(shape);
            increaseLives();
        }
    }
}

function increaseLives() {
    if (lives === 1) {
        lives = 0;
        displayLives();
        endGame(Message.LOSE);
        return;
    }
    lives--;
    displayLives();
}

function displayScore() {
    displayText(scoreText, score);
}

function displayLives() {
    displayText(livesText, lives);
}

function displayText(element, content) {
    element.textContent = content;
}

function resetGameData() {
    removeAllShapes();
    score = 0;
    displayScore();
    lives = START_LIVES_COUNT;
    displayLives();
    currentGameSpeed = START_GAME_SPEED;
}

function removeAllShapes() {
    while (shapeList.length) {
        removeShape(shapeList[0]);
    }
}

function endGame(message) {
    timerStop();
    removeAllShapes();
    setModalData(message);
    $('#gameModal').modal('show');
    addStartGameEvents();
}

function setModalData(message) {
    let i = $('.modal-body i');
    i.attr('class', '');
    i.addClass('fas');
    i.addClass(message.iconClass);
    $('#modalMessage').text(message.text);
    $('#modalScore').text(score);
}

function addStartGameEvents() {
    startGameBtn.addEventListener("mousedown", onStartBtnMouseDown);
    startGameBtn.style.cursor = 'pointer';
    startGameBtn.classList.remove('disabled');

    endGameBtn.removeEventListener("mousedown", onEndBtnMouseDown);
    endGameBtn.style.cursor = 'not-allowed';
    endGameBtn.classList.add('disabled');
}

function addEndGameEvents() {
    startGameBtn.removeEventListener("mousedown", onStartBtnMouseDown);
    startGameBtn.classList.add('disabled');
    startGameBtn.style.cursor = 'not-allowed';

    endGameBtn.addEventListener("mousedown", onEndBtnMouseDown);
    endGameBtn.style.cursor = 'pointer';
    endGameBtn.classList.remove('disabled');
}

/* ----------------- Event Listeners --------------------- */
function onShapeMouseDown(event) {
    if (removeShape(event.currentTarget)) {
        score++;
        currentGameSpeed += 15;
        displayScore();
    }
}

function onStartBtnMouseDown(event) {
    resetGameData();
    timerStart();
    addEndGameEvents();
}

function onEndBtnMouseDown(event) {
    endGame(Message.END_GAME);
}