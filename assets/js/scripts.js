/* ----------------- Translates --------------------- */
const FA_VALUES = {
    values: {
        "btn.game.start": 'شروع بازی',
        "btn.game.end": 'پایان بازی',
        "btn.close": 'بستن',
        "game.score": 'امتیاز:',
        "game.end.message": 'بازی تمام شد',
        "you.win.message": 'شما برنده شدید',
        "you.lose.message": 'شما باختید',
    }
};

const EN_VALUES = {
    values: {
        "btn.game.start": 'Start Game',
        "btn.game.end": 'End Game',
        "btn.close": 'Close',
        "game.score": 'Score:',
        "game.end.message": 'Game is end',
        "you.win.message": 'You WIN',
        "you.lose.message": 'You LOSE',

    }
};

const Language = {
    FA: {name: 'IR_FA', values: FA_VALUES},
    EN: {name: 'US_EN', values: EN_VALUES},
}
let currentLang = Language.EN;
//--------------------------------------------------
const MAX_SHAPE_IN_GAME = 5;
const START_LIVES_COUNT = 3;
const START_GAME_SPEED = 1000;

let gameBox, gameBoxWidth, gameBoxHeight;
let sidebar;
let scoreText;
let livesText;
let startGameBtn, endGameBtn;
let mainInterval, shapeInterval;
let score = 0;
let lives = START_LIVES_COUNT;
let shapeList = [];
let currentGameSpeed = START_GAME_SPEED;
let translator;

const Message = {
    LOSE: {text: 'you.lose.message', iconClass: 'fa-frown'},
    END_GAME: {text: 'game.end.message', iconClass: 'fa-smile'}
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

function initLang() {
    translator = i18n.create(currentLang.values);

}

function initTexts() {
    startGameBtn.textContent = translator("btn.game.start");
    endGameBtn.textContent = translator("btn.game.end");
    $('#scoreModalLabel').text(translator('game.score'));
    $('#modalTitle').text(translator('btn.game.end'));
    $('.modal-footer > .btn').text(translator('btn.close'));
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

    $('#language').val(currentLang.name).trigger('change');
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
    if (!mainInterval) {
        mainInterval = setInterval(gameTick, 30);
        shapeCreatorStart();
    }
}

function timerStop() {
    if (mainInterval) {
        clearInterval(mainInterval);
        mainInterval = undefined;
        shapeCreatorStop();
    }
}

function gameTick() {
    for (let shape of shapeList) {
        shape.style.opacity = parseFloat(shape.style.opacity) + (currentGameSpeed / 30000);
        shape.style.top = parseInt(shape.style.top) + (currentGameSpeed / 500) + 'px';
        if (shape.offsetTop + shape.clientHeight - 2 >= gameBoxHeight) {
            removeShape(shape);
            increaseLives();
        }
    }
}

function shapeCreatorStart() {
    if (!shapeInterval) {
        shapeInterval = setInterval(createShapeTick, 1000)
    }
}

function shapeCreatorStop() {
    if (shapeInterval) {
        clearInterval(shapeInterval);
        shapeInterval = undefined;
    }
}

function createShapeTick() {
    if (shapeList.length < MAX_SHAPE_IN_GAME) {
        addShape();
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
    $('#modalMessage').text(translator(message.text));
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

function onLanguageChange(event) {
    let chooseLangName = $('#language').val()
    for (let lang in Language) {
        if (Language[lang].name === chooseLangName) {
            currentLang = Language[lang];
            initLang();
            initTexts();
        }
    }
}