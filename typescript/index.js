// Code to handle main menu (needs to be in function in case of reset)
var player1Mark = 'o';
var currentGo = 'x';
var previousFirstGo = 'x';
var currentState;
var xWinArray = ['x', 'x', 'x'];
var oWinArray = ['o', 'o', 'o'];
var player1SelectXBtn = document.querySelector('.select-x');
var player1SelectOBtn = document.querySelector('.select-o');
var newGameVsCPUBtn = document.querySelector('.vsCPuBtn');
var newGameVsPlayerBtn = document.querySelector('.vsPlayerBtn');
var endGameQuitBtn = document.querySelector('#quitButton');
var endGameResetBtn = document.querySelector('#nextRoundButton');
var menuContainer = document.querySelector('#new-game-container');
var gameContainer = document.querySelector('#game-container');
var turnIcon = document.querySelector('#turn-indicator img');
var resetBtn = document.querySelector('#resetBtn');
var gameBoxes = document.querySelectorAll('#game-boxes .box');
var gameEndContainer = document.querySelector('#gameEndContainer');
var gameEndOverlay = document.querySelector('#endGameOverlay');
var xScoreElement = document.querySelector('#x-score-container .score');
var oScoreElement = document.querySelector('#o-score-container .score');
var tieScoreElement = document.querySelector('#number-of-ties-container .score');
var turnCounter;
var xScore;
var oScore;
var tieScore;
var winner;
var opponent;
Array.prototype.isEqual = function (line) {
    for (var i = 0; i < 3; i++) {
        if (this[i] !== line[i])
            return false;
    }
    return true;
};
function selectMark(e) {
    if (e.currentTarget === player1SelectXBtn) {
        player1Mark = 'x';
        player1SelectXBtn.classList.add('active');
        player1SelectOBtn.classList.remove('active');
        player1SelectXBtn.disabled = true;
        player1SelectOBtn.disabled = false;
        player1SelectXBtn.querySelector('img').src = '../assets/icon-x-hollow.svg';
        player1SelectOBtn.querySelector('img').src = '../assets/icon-o.svg';
    }
    else {
        player1Mark = 'o';
        player1SelectOBtn.classList.add('active');
        player1SelectXBtn.classList.remove('active');
        player1SelectOBtn.disabled = true;
        player1SelectXBtn.disabled = false;
        player1SelectXBtn.querySelector('img').src = '../assets/icon-x.svg';
        player1SelectOBtn.querySelector('img').src = '../assets/icon-o-hollow.svg';
    }
}
function beginGame(e) {
    currentState = new Array(9);
    currentGo = 'x';
    turnIcon.src = '../assets/icon-x.svg';
    gameContainer.classList.remove('o-go');
    gameContainer.classList.add('x-go');
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'grid';
    gameBoxes.forEach(function (box) {
        box.querySelector('div').style.backgroundImage = "none";
        box.disabled = false;
    });
    xScore = 0;
    tieScore = 0;
    oScore = 0;
    turnCounter = 0;
    xScoreElement.innerText = String(xScore);
    tieScoreElement.innerText = String(tieScore);
    oScoreElement.innerText = String(oScore);
    if (e.currentTarget === newGameVsCPUBtn) {
        opponent = 'cpu';
    }
    else {
        opponent = 'player';
    }
    if (opponent === 'cpu' && currentGo !== player1Mark) {
        CpuGo();
    }
}
function resetGame(e) {
    turnCounter = 0;
    menuContainer.style.display = 'grid';
    gameContainer.style.display = 'none';
    gameBoxes.forEach(function (box) { return box.style.backgroundColor = '#1F3641'; });
    currentGo = 'x';
}
function nextRound() {
    if (previousFirstGo === 'x') {
        currentGo = 'o';
        previousFirstGo = 'o';
        gameContainer.classList.remove('x-go');
        gameContainer.classList.add('o-go');
        turnIcon.src = './assets/icon-o.svg';
    }
    else {
        gameContainer.classList.remove('o-go');
        gameContainer.classList.add('x-go');
        currentGo = 'x';
        previousFirstGo = 'x';
        turnIcon.src = './assets/icon-x.svg';
    }
    gameBoxes.forEach(function (box) {
        box.disabled = false;
        box.querySelector('div').style.backgroundImage = "none";
        box.style.removeProperty('background-color');
        box.style.removeProperty('box-shadow');
    });
    gameEndContainer.style.display = 'none';
    gameEndOverlay.style.display = 'none';
    currentState = new Array(9);
    turnCounter = 0;
    if (opponent === 'cpu' && currentGo !== player1Mark) {
        CpuGo();
    }
}
function gameClick(e) {
    turnCounter += 1;
    var buttonClicked = e.currentTarget;
    buttonClicked.disabled = true;
    if (currentGo === 'x') {
        buttonClicked.querySelector('div').style.backgroundImage = "url(./assets/icon-x.svg)";
        currentState[parseInt(buttonClicked.id)] = 'x';
    }
    else {
        buttonClicked.querySelector('div').style.backgroundImage = "url(./assets/icon-o.svg)";
        currentState[parseInt(buttonClicked.id)] = 'o';
    }
    if (checkWinner() === true) {
        return;
    }
    ;
    if (turnCounter === 9) {
        winner = 'tie';
        endGame();
        return;
    }
    if (currentGo === 'x') {
        turnIcon.src = './assets/icon-o.svg';
        gameContainer.classList.remove('x-go');
        gameContainer.classList.add('o-go');
        currentGo = 'o';
    }
    else {
        turnIcon.src = './assets/icon-x.svg';
        gameContainer.classList.remove('o-go');
        gameContainer.classList.add('x-go');
        currentGo = 'x';
    }
    if (opponent === 'cpu' && currentGo !== player1Mark) {
        CpuGo();
    }
}
function CpuGo() {
    var selectedBox;
    do {
        var selectedBoxIndex = Math.floor(Math.random() * gameBoxes.length);
        selectedBox = gameBoxes[selectedBoxIndex];
    } while (selectedBox.disabled === true);
    selectedBox.click();
}
function highlightWinningButtons(winningBoxes) {
    var backgroundColor;
    var svgImage;
    if (currentGo === 'x') {
        backgroundColor = '#31C3BD';
        svgImage = 'url(./assets/icon-x-hollow.svg';
    }
    else {
        backgroundColor = '#F2B137';
        svgImage = 'url(./assets/icon-o-hollow.svg';
    }
    var time = 0;
    winningBoxes.forEach(function (box) {
        setTimeout(function () {
            box.style.backgroundColor = backgroundColor;
            var childElement = box.firstChild;
            childElement.style.backgroundImage = svgImage;
            box.style.boxShadow = 'inset 0px -8px 0px #10212A';
        }, time);
        time += 1000;
    });
}
function endGame() {
    var endGameMessageSm = gameEndContainer.querySelector('#smallMessage');
    var endGameMessageLa = gameEndContainer.querySelector('#largeMessage');
    var xColor = '#31C3BD';
    var silverColor = '#A8BFC9';
    var oColor = 'F2B137';
    gameEndContainer.style.display = 'flex';
    gameEndOverlay.style.display = 'block';
    //Handle endGame messages
    if (winner === player1Mark) {
        endGameMessageSm.innerHTML = 'PLAYER 1 WINS!';
    }
    else if (winner === 'tie') {
        endGameMessageSm.innerHTML = '';
        endGameMessageLa.innerHTML = 'ROUND TIED';
    }
    else if (opponent === 'player') {
        endGameMessageSm.innerHTML = 'PLAYER 2 WINS!';
    }
    else {
        endGameMessageSm.innerHTML = 'OH NO, YOU LOST...';
    }
    // Handle score updates and colours
    if (winner === 'x') {
        xScore += 1;
        xScoreElement.innerText = String(xScore);
        endGameMessageLa.style.color = xColor;
        endGameMessageLa.querySelector('span').style.backgroundImage = "url('./assets/icon-".concat(currentGo, ".svg')");
    }
    else if (winner === 'o') {
        oScore += 1;
        oScoreElement.innerText = String(oScore);
        endGameMessageLa.style.removeProperty('color');
        endGameMessageLa.style.color = oColor;
        endGameMessageLa.querySelector('span').style.backgroundImage = "url('./assets/icon-".concat(currentGo, ".svg')");
    }
    else {
        tieScore += 1;
        tieScoreElement.innerText = String(tieScore);
        endGameMessageLa.style.color = silverColor;
        endGameMessageLa.querySelector('span').style.backgroundImage = 'none';
    }
}
function checkWinner() {
    var _a, _b;
    var row1 = currentState.slice(0, 3);
    var row2 = currentState.slice(3, 6);
    var row3 = currentState.slice(6);
    var column1, column2, column3;
    var diagonal1, diagonal2;
    _a = getColumns(), column1 = _a[0], column2 = _a[1], column3 = _a[2];
    _b = getDiagonals(), diagonal1 = _b[0], diagonal2 = _b[1];
    if (row1.isEqual(xWinArray) || row1.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[0], gameBoxes[1], gameBoxes[2]]);
    }
    else if (row2.isEqual(xWinArray) || row2.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[3], gameBoxes[4], gameBoxes[5]]);
    }
    else if (row3.isEqual(xWinArray) || row3.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[6], gameBoxes[7], gameBoxes[8]]);
    }
    else if (column1.isEqual(xWinArray) || column1.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[0], gameBoxes[3], gameBoxes[6]]);
    }
    else if (column2.isEqual(xWinArray) || column2.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[1], gameBoxes[4], gameBoxes[7]]);
    }
    else if (column3.isEqual(xWinArray) || column3.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[2], gameBoxes[5], gameBoxes[8]]);
    }
    else if (diagonal1.isEqual(xWinArray) || diagonal1.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[0], gameBoxes[4], gameBoxes[8]]);
    }
    else if (diagonal2.isEqual(xWinArray) || diagonal2.isEqual(oWinArray)) {
        highlightWinningButtons([gameBoxes[2], gameBoxes[4], gameBoxes[6]]);
    }
    else {
        return false;
    }
    winner = currentGo;
    gameBoxes.forEach(function (box) { return box.disabled = true; });
    setTimeout(endGame, 3500);
    //endGame();
    return true;
}
function getColumns() {
    var getColumn1 = [];
    var getColumn2 = [];
    var getColumn3 = [];
    for (var i = 0; i < currentState.length; i += 3) {
        getColumn1.push(currentState[i]);
    }
    for (var i = 1; i < currentState.length; i += 3) {
        getColumn2.push(currentState[i]);
    }
    for (var i = 2; i < currentState.length; i += 3) {
        getColumn3.push(currentState[i]);
    }
    return [getColumn1, getColumn2, getColumn3];
}
function getDiagonals() {
    var getDiagonal1 = [];
    var getDiagonal2 = [];
    for (var i = 0; i < currentState.length; i += 4) {
        getDiagonal1.push(currentState[i]);
    }
    for (var i = 2; i < currentState.length - 1; i += 2) {
        getDiagonal2.push(currentState[i]);
    }
    return [getDiagonal1, getDiagonal2];
}
function quit() {
    gameEndContainer.style.display = 'none';
    gameEndOverlay.style.display = 'none';
    gameContainer.style.display = 'none';
    menuContainer.style.display = 'grid';
    gameBoxes.forEach(function (box) { return box.style.removeProperty('background-color'); });
}
player1SelectXBtn.addEventListener('click', selectMark);
player1SelectOBtn.addEventListener('click', selectMark);
newGameVsCPUBtn.addEventListener('click', beginGame);
newGameVsPlayerBtn.addEventListener('click', beginGame);
resetBtn.addEventListener('click', resetGame);
gameBoxes.forEach(function (gameBox) {
    gameBox.addEventListener('click', gameClick);
});
endGameQuitBtn.addEventListener('click', quit);
endGameResetBtn.addEventListener('click', nextRound);
