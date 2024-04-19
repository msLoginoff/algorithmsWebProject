
const cols = Number(localStorage.getItem('fieldSize'));
const rows = cols;

let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let wallsNumbers = [];

let start;
let goal;
let path = [];

function findStartCell(grid) {
    const startParent = document.getElementById('startCell').parentNode;
    const startNumber = Number(startParent.getAttribute('id'));
    return grid[startNumber % cols][Math.floor(startNumber/cols)];
}

function findGoalCell(grid) {
    const goalParent = document.getElementById('goalCell').parentNode;
    const goalNumber = Number(goalParent.getAttribute('id'));

    if (wallsNumbers.includes(goalParent.id)) {
        const tmpIndex = wallsNumbers.indexOf(goalParent.id);
        wallsNumbers.splice(tmpIndex, 1);
        goalParent.classList.remove('wallStyle');
        console.log(tmpIndex);
    }

    return grid[goalNumber % cols][Math.floor(goalNumber/cols)];
}

function setWalls(thisCell) {
    if (thisCell === null) return;

    if (!thisCell.classList.contains('wallStyle')) {
        thisCell.classList.remove('currentStyle');
        thisCell.classList.remove('neighborStyle');
        thisCell.classList.remove('answerStyle');
        thisCell.classList.add('wallStyle');
        wallsNumbers.push(thisCell.id);
    }
    else {
        thisCell.classList.remove('wallStyle');
        const tmp = wallsNumbers.indexOf(thisCell.id);
        wallsNumbers.splice(tmp, 1);
    }
}

function heuristic(position0, position1) {
    let distanceX = Math.abs(position1.x - position0.x);
    let distanceY = Math.abs(position1.y - position0.y);

    return distanceY + distanceX;
}


function GridPoint(x, y) {
    this.x = x;
    this.y = y;
    this.finalDistance = 0;
    this.distanceFromStartToCurrent = 0;
    this.neighbors = [];
    this.parent = undefined;

    this.updateNeighbors = function (grid) {
        let i = this.x;
        let j = this.y;
        if (i < cols - 1) {
            if (!wallsNumbers.includes(`${i + 1 + j * cols}`)) {
                this.neighbors.push(grid[i + 1][j]);
            }
        }
        if (i > 0) {
            if (!wallsNumbers.includes(`${i - 1 + j * cols}`)) {
                this.neighbors.push(grid[i - 1][j]);
            }
        }
        if (j < rows - 1) {
            if (!wallsNumbers.includes(`${i + (j + 1) * cols}`)) {
                this.neighbors.push(grid[i][j + 1]);
            }

        }
        if (j > 0) {
            if (!wallsNumbers.includes(`${i + (j - 1) * cols}`)) {
                this.neighbors.push(grid[i][j - 1]);
            }

        }
    };
}

function cleanGridStyle() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let thisCell = document.getElementById(`${i * cols + j}`);
            thisCell.classList.remove('currentStyle');
            thisCell.classList.remove('neighborStyle');
            thisCell.classList.remove('answerStyle');
        }
    }
}

function cleanWalls() {
    while (wallsNumbers.length > 0) {
        let thisCell = document.getElementById(`${wallsNumbers[0]}`);
        thisCell.classList.remove('wallStyle');
        wallsNumbers.splice(0, 1);
    }
}

function init() {
    openSet = [];
    closedSet = [];
    path = [];

    cleanGridStyle();
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new GridPoint(i, j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].updateNeighbors(grid);
        }
    }

    start = findStartCell(grid);
    goal = findGoalCell(grid);
    if (start === goal) {

    }
    openSet.push(start);
}

let timeCoefficient = 50;
let answerLength = 0;

let timeIdOne;
let timeIdTwo;
let timeIdThree;

function search() {
    clearTimeout(timeIdOne);
    clearTimeout(timeIdTwo);
    clearTimeout(timeIdThree);
    
    answerLength = 0;
    init();
    let counter = 0;

    while (openSet.length > 0) {
        counter++;
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].finalDistance < openSet[lowestIndex].finalDistance) {
                lowestIndex = i;
                break;
            }
        }

        let current = openSet[lowestIndex];

        timeIdOne = setTimeout(() => {
             if (current !== start && current !== goal) {
                 document.getElementById(`${current.x + current.y * cols}`).classList.remove('neighborStyle');
                 document.getElementById(`${current.x + current.y * cols}`).classList.add('currentStyle');
             }
             }, timeCoefficient * counter);

        if (current === goal) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }
            answerLength = path.length - 1;
            for (let i = 0; i < path.length; i++) {
                timeIdTwo = setTimeout(() => {
                    if (path[i] !== start && path[i] !== goal) {
                        document.getElementById(`${path[i].x + path[i].y * cols}`).classList.add('answerStyle');
                    }
                }, timeCoefficient * counter
                );
            }
            pasteAnswer();
            return;
        }

        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let possibleG = current.distanceFromStartToCurrent + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);

                } else if (possibleG >= neighbor.distanceFromStartToCurrent) {
                    continue;
                }

                neighbor.distanceFromStartToCurrent = possibleG;
                neighbor.distanceFromCurrentToGoal = heuristic(neighbor, goal);
                neighbor.finalDistance = neighbor.distanceFromStartToCurrent + neighbor.distanceFromCurrentToGoal;
                neighbor.parent = current;

                timeIdThree = setTimeout( () =>
                {
                    if (neighbor !== start && neighbor !== goal) {
                        document.getElementById(`${neighbor.x + neighbor.y * cols}`).classList.add('neighborStyle');
                    }
                }, timeCoefficient * counter
                )
            }


        }


    }

    pasteAnswer();

    return [];
}


