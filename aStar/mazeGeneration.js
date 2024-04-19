let matrix = new Array(cols);

createMatrix(cols);

for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
        let thisCell = document.getElementById(`${i + j * cols}`)
        thisCell.classList.add('wallStyle');
    }
}

createMaze();

function MatrixItem(x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.value = false;

    this.createNeighbors = function (matrix) {
        let i = this.x;
        let j = this.y;

        if (i < cols - 2) {
            this.neighbors.push(matrix[i + 2][j]);
        }
        if (i > 1) {
            this.neighbors.push(matrix[i - 2][j]);
        }
        if (j < cols - 2) {
            this.neighbors.push(matrix[i][j + 2]);
        }
        if (j > 1) {
            this.neighbors.push(matrix[i][j - 2]);
        }
    };


}

function createMatrix(cols) {

    for (let i = 0; i < cols; i++) {
        matrix[i] = new Array(cols);
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = new MatrixItem(i,j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            matrix[i][j].createNeighbors(matrix);
        }
    }
}

function getRandomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function IsMazeGenerated() {
    for (let i = 0; i < cols; i += 2) {
        for (let j = 0; j < cols; j += 2) {
            if (!matrix[i][j].value) {
                return false;
            }
        }
    }

    return true;
}

function createMaze() {
    let current = matrix[0][0];
    let counter = 0;

    while (!IsMazeGenerated()) {
        counter++;
        let secondNeighbor = getRandomItem(current.neighbors);
        let firstNeighbor = matrix[(current.x + secondNeighbor.x) / 2][(current.y + secondNeighbor.y) / 2];

        let cellSecondNeighbor = document.getElementById(`${secondNeighbor.x + secondNeighbor.y * cols}`);
        let cellFirstNeighbor = document.getElementById(`${firstNeighbor.x + firstNeighbor.y * cols}`);

        if (!secondNeighbor.value) {
            secondNeighbor.value = true;
            firstNeighbor.value = true;
            cellSecondNeighbor.classList.remove('wallStyle');
            cellFirstNeighbor.classList.remove('wallStyle');
        }

        current = secondNeighbor;
    }

    if (cols % 2 === 0) {
        matrix[cols - 2][cols - 1].value = true;
        matrix[cols - 1][cols - 2].value = true;
        matrix[cols - 1][cols - 1].value = true;

        let lastCell = document.getElementById(`${(cols - 2) + (cols - 1) * cols}`);
        lastCell.classList.remove('wallStyle');

        lastCell = document.getElementById(`${(cols - 1) + (cols - 2) * cols}`);
        lastCell.classList.remove('wallStyle');

        lastCell = document.getElementById(`${(cols - 1) + (cols - 1) * cols}`);
        lastCell.classList.remove('wallStyle');
    }

    addWalls();
}

function addWalls() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            if (!matrix[i][j].value) {
                wallsNumbers.push(`${i + j * cols}`);
            }
            matrix[i][j].value = false;
        }
    }
}
