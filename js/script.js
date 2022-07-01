const grid = document.getElementById(`grid`);
let squares = [...document.querySelectorAll(`.grid div`)];
const scoreEl = document.getElementById(`score`);
const startBtn = document.getElementById(`start-button`);
const width = 10;
let nextRandom = 0;
let timerId;
let gameSpeed = 500;
let score = 0;

const colors = [
    `red`,
    `blue`,
    `yellow`,
    `green`,
    `pink`,
    `purple`,
    `brown`
];

const lTetromino = [
    [0, width, width * 2, width * 2 + 1],
    [0, 1, 2, width],
    [0, 1, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width * 2 + 2, width + 2]
];
const jTetromino = [
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
    [0, 1, width, width * 2],
    [0, 1, 2, width + 2]
];
const zTetromino = [
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
];
const sTetromino = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
];
const tTetromino = [
    [0, 1, 2, width + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [0, width, width * 2, width + 1],
];
const iTetromino = [
    [0, width, width * 2, width * 3],
    [0, 1, 2, 3],
    [0, width, width * 2, width * 3],
    [0, 1, 2, 3],
];
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];

const theTetrominos = [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, iTetromino, oTetromino];
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominos.length);
let currentTetromino = theTetrominos[random][currentRotation];

const draw = () => {
    squares.map(square => {
        if (!square.classList.contains(`taken`)) {
            square.style.backgroundColor = ``;
        }
        square.classList.remove(`tetromino`);
    });
    currentTetromino.map(i => {
        squares[i + currentPosition].style.backgroundColor = colors[random];
        squares[i + currentPosition].classList.add(`tetromino`);
    });
};
const moveRight = () => {
    let isNotAtRightEdge = currentTetromino.some(e => ((e + currentPosition) % width) === width - 1) ? 0 : 1;
    if (isNotAtRightEdge) {
        currentPosition += 1;
    }
    if (currentTetromino.some(e => squares[e + currentPosition].classList.contains(`taken`))) {
        currentPosition -= 1;
    }
    draw();
};
const moveLeft = () => {
    let isNotAtLeftEdge = currentTetromino.some(e => ((e + currentPosition) % width === 0)) ? 0 : 1;
    if (isNotAtLeftEdge) {
        currentPosition -= 1;
    }
    if (currentTetromino.some(e => squares[e + currentPosition].classList.contains(`taken`))) {
        currentPosition += 1;
    }
    draw();
};
const moveDown = () => {
    currentPosition += width;
    draw();
    freeze();
};
const rotateRight = () => {
    currentRotation === 3 ? currentRotation = 0 : currentRotation++;
    let isAtLeftEdge = theTetrominos[random][currentRotation].some(e => ((e + currentPosition) % width === 0));
    if (!isAtLeftEdge) {
        if (theTetrominos[random][currentRotation].some(e => squares[e + currentPosition].classList.contains(`taken`)) ? 0 : 1) {
            currentTetromino = theTetrominos[random][currentRotation];
            draw();
        }
    }
};
const rotateLeft = () => {
    currentRotation === 0 ? currentRotation = 3 : currentRotation--;
    let isAtRightEdge = theTetrominos[random][currentRotation].some(e => ((e + currentPosition) % width) === width - 1);
    if (!isAtRightEdge) {
        if (theTetrominos[random][currentRotation].some(e => squares[e + currentPosition].classList.contains(`taken`)) ? 0 : 1) {
            currentTetromino = theTetrominos[random][currentRotation];
            draw();
        }
    }
};
const controls = (e) => {
    switch (e.key) {
        case `ArrowUp`:
            rotateRight();
            break;
        case `ArrowDown`:
            rotateLeft();
            break;
        case `ArrowLeft`:
            moveLeft();
            break;
        case `ArrowRight`:
            moveRight();
            break;
        case ` `:
            moveDown();
            break;
        default:
            break;
    }
};
document.addEventListener(`keydown`, controls);
// draw();

const freeze = () => {
    currentTetromino.forEach(index => {
        squares[currentPosition + index].style.backgroundColor = colors[nextRandom];
        draw();
    });
    if (currentTetromino.some(index => squares[index + currentPosition + width].classList.contains(`taken`))) {
        currentTetromino.forEach(index => {
            squares[currentPosition + index].classList.add(`taken`);
        });
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominos.length);
        currentTetromino = theTetrominos[random][currentRotation];
        currentPosition = 4;
        draw();
        displayUpNextTetromino();
        addScore();
        if (squares.some((e, i) => i < 20 && i > 10 ? e.classList.contains(`taken`) : 0)) gameOver();

    }
};
const downMover = () => {
    draw();
    currentPosition += width;
    freeze();
};
const startResumePause = () => {
    gameSpeed = +document.getElementById(`speed`).value || gameSpeed;
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        document.removeEventListener(`keydown`, controls);
    } else {
        draw();
        timerId = setInterval(downMover, gameSpeed);
        nextRandom = Math.floor(Math.random() * theTetrominos.length);
        displayUpNextTetromino();
        document.addEventListener(`keydown`, controls);
    }
};
startBtn.addEventListener(`click`, startResumePause);
// the next tetromino
const displaySquares = Array.from(document.querySelectorAll(`.mini-grid div`));
const displayWidth = 4;
const displayIndex = 0;
// without rotation
const upNextTetrominos = [
    [0, displayWidth, displayWidth * 2, displayWidth * 2 + 1],
    [1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1],
    [0, 1, displayWidth + 1, displayWidth + 2],
    [1, 2, displayWidth, displayWidth + 1],
    [0, 1, 2, displayWidth + 1],
    [0, displayWidth, displayWidth * 2, displayWidth * 3],
    [0, 1, displayWidth, displayWidth + 1],
];
// display the up next tetromino in the mini grid
const displayUpNextTetromino = () => {
    displaySquares.map(square => {
        square.classList.remove(`tetromino`);
        square.style.backgroundColor = ``;
    });
    upNextTetrominos[nextRandom].map(i => {
        displaySquares[i + displayIndex].classList.add(`tetromino`);
        displaySquares[i + displayIndex].style.backgroundColor = colors[nextRandom];
    });
};
// add score
const addScore = () => {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(i => squares[i].classList.contains(`taken`))) {
            score += 10;
            scoreEl.textContent = score;
            row.forEach(i => {
                squares[i].classList.remove(`taken`);
                squares[i].style.backgroundColor = ``;
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(square => grid.appendChild(square));
        }
    }
};
// restart
const startNewGame = document.getElementById(`start-new-game`);
startNewGame.onclick = () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        document.removeEventListener(`keydown`, controls);
    }
    for (let i = 0; i < 200; i++) {
        squares[i].classList.remove(`taken`);
    }
    nextRandom = 0;
    gameSpeed = +document.getElementById(`speed`).value || gameSpeed;
    score = 0;
    startBtn.addEventListener(`click`, startResumePause);
    scoreEl.innerText = score;
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominos.length);
    currentTetromino = theTetrominos[random][currentRotation];
    timerId = setInterval(downMover, gameSpeed);
    nextRandom = Math.floor(Math.random() * theTetrominos.length);
    displayUpNextTetromino();
    document.addEventListener(`keydown`, controls);
    draw();

};


// game over
const gameOver = () => {
    startBtn.removeEventListener(`click`, startResumePause);
    document.removeEventListener(`keydown`, controls);
    scoreEl.innerText = `You lose!`;
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
};