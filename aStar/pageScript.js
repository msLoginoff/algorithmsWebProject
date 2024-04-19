
const fieldSize= localStorage.getItem('fieldSize');

const board = document.getElementById('board');
const boardParent = document.getElementById('boardParent');
const height = document.documentElement.clientHeight - 100;

boardParent.style.maxWidth = `${height}px`
boardParent.style.height = `${height}px`

createGrid(fieldSize);

function createGrid(n) {
    if (n < 2 || n > 2000) {
        return;
    }

    for (let i = 0; i < n*n; i++) {
        let cellWidth = 100 / n;
        let cell = document.createElement('cell');

        cell.style.width = `${cellWidth}%`;
        cell.style.height = `${cellWidth}%`;
        cell.setAttribute('id', `${i}`);
        cell.setAttribute('ondrop', 'drop(event)');
        cell.setAttribute('ondragover', 'allowDrop(event)');
        cell.setAttribute('onclick', 'setWalls(this)');
        cell.classList.add('gridCell');
        board.append(cell);
    }
}

function createStartCell() {
    let startCell = document.createElement('startCell');
    startCell.style.width = '100%';
    startCell.setAttribute('id', 'startCell');
    startCell.setAttribute('number', '0');
    startCell.setAttribute('draggable', 'true');
    startCell.setAttribute('ondragstart', 'drag(event)');
    startCell.classList.add('startCell');

    const cell = document.getElementById('0');
    cell.append(startCell);
}

createStartCell();

function createGoalCell() {
    let goalCell = document.createElement('goalCell');
    goalCell.style.width = '100%';
    goalCell.setAttribute('id', 'goalCell');
    goalCell.setAttribute('number', `${fieldSize * fieldSize - 1}`);
    goalCell.setAttribute('draggable', 'true');
    goalCell.setAttribute('ondragstart', 'drag(event)');
    goalCell.classList.add('goalStyle');

    const cell = document.getElementById(`${fieldSize * fieldSize - 1}`);
    cell.append(goalCell);
}

createGoalCell();
function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
    //if (e.target.classList.contains('')
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
}
