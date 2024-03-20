//constants
const CANVAS = document.getElementById("astar-canvas");
const CTX = CANVAS.getContext("2d");
const CELL_SIZE  = 16;
const INPUT = document.getElementById("size");
let MAZE_WIDTH;
let MAZE_HEIGHT;
const INTERVAL_TIME = 5;
let START_POINT = null;
let END_POINT = null;
let maze = [];
const runBtn = document.getElementById('run');
const editStartBtn = document.getElementById('editStart');
//
//------------------------------------------
//images
const WALL_IMAGE = new Image();
WALL_IMAGE.src = 'images/Wall.png';
const FLOOR_IMAGE = new Image();
FLOOR_IMAGE.src = 'images/Floor.png';
const SELECT_IMAGE = new Image();
SELECT_IMAGE.src = 'images/Select.png';
const WALL_3D = new Image();
WALL_3D.src = 'images/3DWall.png';
const START_3D = new Image();
START_3D.src = 'images/3DStart.png';
const MOUSEMOVE_START = new Image();
MOUSEMOVE_START.src = 'images/MouseMoveStartImage.png';
const MOUSEMOVE_FINISH = new Image();
MOUSEMOVE_FINISH.src = 'images/MouseMoveEndImage.png';
const CHOSEN = new Image();
CHOSEN.src = 'images/Chosen.png';
const CONSIDERED = new Image();
CONSIDERED.src = 'images/Considered.png';
const MOUSEMOVE_WALL = new Image();
MOUSEMOVE_WALL.src = 'images/MouseMoveWallImage.png';
const MOUSEMOVE_FLOOR = new Image();
MOUSEMOVE_FLOOR.src = 'images/MouseMoveFloorImage.png';
//
//------------------------------------------
//-------------------CODE-------------------
//classes
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//
//------------------------------------------
//draw
function draw(x, y) {
  CTX.save();
  
  if(maze[x][y] != 2) {
    if (maze[x][y] == 1) {
      CTX.drawImage(FLOOR_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      if(maze[x][y - 1] == 0) {
        CTX.drawImage(WALL_3D, x * CELL_SIZE, (y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    } else {
      if(maze[x][y + 1] == 1) {
        CTX.drawImage(WALL_3D, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else {
        CTX.drawImage(WALL_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  else {
    CTX.drawImage(SELECT_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  if (maze[x][y] == 3) {
    if(maze[x][y + 1] == 1) {
      CTX.drawImage(PATH_3D, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    else {
      CTX.drawImage(PATH_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  
  CTX.restore();
}
//
//------------------------------------------
//map
  function createMazeRect() {
    MAZE_WIDTH = INPUT.value;
    MAZE_HEIGHT = INPUT.value;
    CANVAS.width = CELL_SIZE * MAZE_WIDTH;
    CANVAS.height = CELL_SIZE * MAZE_HEIGHT;
      
    for (let x = 0; x < MAZE_WIDTH; x++) {
      maze[x] = new Array(MAZE_HEIGHT);
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        maze[x][y] = 0;
        draw(x, y);
      }
    }

    for(let x = 0; x < MAZE_WIDTH; x++) {
      CTX.drawImage(WALL_3D, x * CELL_SIZE, (MAZE_HEIGHT - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  function createMazeBorders() {
    for(let x = 0; x < MAZE_WIDTH; x++) {
      CTX.drawImage(WALL_3D, x * CELL_SIZE, (MAZE_HEIGHT - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      CTX.drawImage(WALL_3D, x * CELL_SIZE, 0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    CTX.drawImage(WALL_IMAGE, 0 * CELL_SIZE, 0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    CTX.drawImage(WALL_IMAGE, (MAZE_WIDTH - 1) * CELL_SIZE, 0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  function createMaze() {
    createMazeRect();

    let x = Math.floor(Math.random() * MAZE_WIDTH / 2) * 2 + 1;
    let y = Math.floor(Math.random() * MAZE_HEIGHT / 2) * 2 + 1;
    if (x >= 0 && x < MAZE_WIDTH && y >= 0 && y < MAZE_HEIGHT) {
      maze[x][y] = 1;
    }

    draw(x, y);

    let toCheck = [];
    if (y - 2 >= 0) {
      toCheck.push(new Point(x, y - 2));
      maze[x][y - 2] = 2;
    }
    if (y + 2 < MAZE_HEIGHT) {
      toCheck.push(new Point(x, y + 2));
      maze[x][y + 2] = 2;
    }
    if (x - 2 >= 0) {
      toCheck.push(new Point(x - 2, y));
      maze[x - 2][y] = 2;
    }
    if (x + 2 < MAZE_WIDTH) {
      toCheck.push(new Point(x + 2, y));
      maze[x + 2][y] = 2;
    }
    toCheck.forEach(point => draw(point.x, point.y));
    
    let interval = setInterval(() => {
      if (toCheck.length <= 0) {
        clearInterval(interval);
        runBtn.disabled = false;
        return;
      }
  
      let index = Math.floor(Math.random() * toCheck.length);
      let randomPoint = toCheck[index];
      let x = randomPoint.x;
      let y = randomPoint.y;
      maze[x][y] = 1;
      toCheck.splice(index, 1);
  
      draw(x, y);
  
      connectCells(x, y, toCheck);
    }, INTERVAL_TIME);
  }

  function connectCells(x, y, toCheck) {
    let direction = ["north", "south", "east", "west"];
    while (direction.length > 0) {
      let dirIndex = Math.floor(Math.random() * direction.length);
      switch (direction[dirIndex]) {
        case "north":
          if (y - 2 >= 0 && maze[x][y - 2] == 1) {
            maze[x][y - 1] = 1;
            draw(x, y - 1);
            direction.splice(0, direction.length);
          }
        break;
        case "south":
          if (y + 2 < MAZE_HEIGHT && maze[x][y + 2] == 1) {
            maze[x][y + 1] = 1;
            draw(x, y + 1);
            direction.splice(0, direction.length);
          }
        break;
        case "east":
          if (x - 2 >= 0 && maze[x - 2][y] == 1) {
            maze[x - 1][y] = 1;
            draw(x - 1, y);
            direction.splice(0, direction.length);
          }
        break;
        case "west":
          if (x + 2 < MAZE_WIDTH && maze[x + 2][y] == 1) {
            maze[x + 1][y] = 1;
            draw(x + 1, y);
            direction.splice(0, direction.length);
          }
        break;
      }
      direction.splice(dirIndex, 1);
    }

    if (y - 2 >= 0 && maze[x][y - 2] == 0) {
      toCheck.push(new Point(x, y - 2));
      maze[x][y - 2] = 2;
    }
    if (y + 2 < MAZE_HEIGHT && maze[x][y + 2] == 0) {
      toCheck.push(new Point(x, y + 2));
      maze[x][y + 2] = 2;
    }
    if (x - 2 >= 0 && maze[x - 2][y] == 0) {
      toCheck.push(new Point(x - 2, y));
      maze[x - 2][y] = 2;
    }
    if (x + 2 < MAZE_WIDTH && maze[x + 2][y] == 0) {
      toCheck.push(new Point(x + 2, y));
      maze[x + 2][y] = 2;
    }
    toCheck.forEach(point => draw(point.x, point.y));
  }
//
//------------------------------------------
//add-ons for the map
  function deleteDeadEnds() {
    for (let i = 0; i < 4; i++) {
      let deadEnds = [];
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (maze[x][y] == 1) {
            let neighbors = 0;
            if (y - 1 >= 0 && maze[x][y - 1] == 1) {
              neighbors++;
            }
            if (y + 1 < MAZE_HEIGHT && maze[x][y + 1] == 1) {
              neighbors++;
            }
            if (x - 1 >= 0 && maze[x - 1][y] == 1) {
              neighbors++;
            }
            if (x + 1 < MAZE_WIDTH && maze[x + 1][y] == 1) {
              neighbors++;
            }
            if (neighbors <= 1) {
              deadEnds.push(new Point(x, y))
            }
          }
        }
      }
      
      deadEnds.forEach(point => {
        maze[point.x][point.y] = 0;
        draw(point.x, point.y);
      });
    }
  }

  function cultivation(value) {
    for (let i = 0; i < value; i++) {
      let newCells = [];
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (maze[x][y] == 0) {
            let neighbors = 0;
            for (let a = 0; a < 3; a++) {
              for (let b = 0; b < 3; b++) {
                let neighborX = x - a;
                let neighborY = y - b;
                if (neighborX >= 0 && neighborX < MAZE_WIDTH &&
                   neighborY >= 0 && neighborY < MAZE_HEIGHT) {
                  if (maze[neighborX][neighborY] == 1) {
                    neighbors++;
                  }
                }
              }
            }
            if (neighbors >= 4) {
              newCells.push(new Point(x, y));
            }
          }
        }
      }

      newCells.forEach(point => {
        maze[point.x][point.y] = 1;
        draw(point.x, point.y);
      });
    }
  }
//
//------------------------------------------
//A* algorithm
function highlightCell(inputCell, type) {
  switch (type) {
    case 'considered':
      CTX.drawImage(CONSIDERED, inputCell.x * CELL_SIZE, inputCell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      break;
    case 'chosen':
      CTX.drawImage(CHOSEN, inputCell.x * CELL_SIZE, inputCell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      break;
    default:
      break;
  }
}

function clearMaze() {
  for (let x = 0; x < MAZE_WIDTH; x++) {
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      if(maze[x][y] == 1) draw(x, y);
    }
  }
}

function drawPath(inputPath) {
  clearMaze();
  let currentIndex = 0;
  let interval = setInterval(() => {
    if (currentIndex >= inputPath.length - 1) {
      clearInterval(interval);
      return;
    }
    if (currentIndex == 0) {
      createLinePath(inputPath[currentIndex].x, inputPath[currentIndex].y, inputPath[currentIndex+1].x, inputPath[currentIndex+1].y);
      CTX.drawImage(START_3D, START_POINT.x * CELL_SIZE, START_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    else {
      CTX.drawImage(FLOOR_IMAGE, END_POINT.x * CELL_SIZE, END_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      createLinePath(inputPath[currentIndex].x, inputPath[currentIndex].y, inputPath[currentIndex+1].x, inputPath[currentIndex+1].y);
    }
    currentIndex++;
  }, INTERVAL_TIME);
}

function heuristic(start, goal) {
  return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

function getNeighbors(point) {
  let neighbors = [];
  if (maze[point.x - 1]?.[point.y] === 1) neighbors.push(new Point(point.x - 1, point.y));
  if (maze[point.x + 1]?.[point.y] === 1) neighbors.push(new Point(point.x + 1, point.y));
  if (maze[point.x]?.[point.y - 1] === 1) neighbors.push(new Point(point.x, point.y - 1));
  if (maze[point.x]?.[point.y + 1] === 1) neighbors.push(new Point(point.x, point.y + 1));
  return neighbors;
}

let newPath = [];
function aStar() {
  clearMaze();
  let openPoints = [new Point(START_POINT.x, START_POINT.y)];
  let closedPoints = [];

  let gCost = [[new Point(START_POINT.x, START_POINT.y), 0]];
  let fCost = [[new Point(START_POINT.x, START_POINT.y), heuristic(START_POINT, END_POINT)]];

  let cameFrom = [];

  let currentPoint;

  const intervalId = setInterval(() => {
    let minFCost = Infinity;
    for (let i = 0; i < openPoints.length; i++) {
      let pointFCost = fCost.find((point) => point[0].x === openPoints[i].x && point[0].y === openPoints[i].y)[1];
      if (pointFCost < minFCost) {
        currentPoint = openPoints[i];
        minFCost = pointFCost;
      }
    }

    if (currentPoint.x === END_POINT.x && currentPoint.y === END_POINT.y) {
      let path = [END_POINT];
      while (path[0].x !== START_POINT.x || path[0].y !== START_POINT.y) {
        path.unshift(cameFrom.find((point) => point[0].x === path[0].x && point[0].y === path[0].y)[1]);
      }
      newPath = path;
      drawPath(path);
      clearInterval(intervalId);
      return;
    }

    openPoints.splice(openPoints.indexOf(currentPoint), 1);
    highlightCell(currentPoint, 'chosen');
    closedPoints.push(currentPoint);

    for (let neighbor of getNeighbors(currentPoint)) {
      if (closedPoints.find((point) => point.x === neighbor.x && point.y === neighbor.y)) {
        continue;
      }

      const neighborGCostIndex = gCost.findIndex((point) => point[0].x === neighbor.x && point[0].y === neighbor.y);
      const tentativeGCost = gCost.find((point) => point[0].x === currentPoint.x && point[0].y === currentPoint.y)[1] + 1;

      if (neighborGCostIndex === -1) {
        openPoints.push(neighbor);
        highlightCell(neighbor, 'considered');
        gCost.push([neighbor, tentativeGCost]);
      } else if (tentativeGCost >= gCost[neighborGCostIndex][1]) {
        continue;
      }

      cameFrom.push([neighbor, currentPoint]);
      if (neighborGCostIndex === -1) {
        fCost.push([neighbor, tentativeGCost + heuristic(neighbor, END_POINT)]);
      } else {
        fCost[neighborGCostIndex][1] = tentativeGCost + heuristic(neighbor, END_POINT);
      }
    }
  }, INTERVAL_TIME * 3);
}
//------------------------------------------
//cell select animation
let lastPoint = null;
runBtn.addEventListener('click', function() {
  CANVAS.removeEventListener('mousemove', editMouseMoveHandler);
  CANVAS.removeEventListener('click', editClickHandler);
  CANVAS.addEventListener('mousemove', runMouseMoveHandler);
  CANVAS.addEventListener('click', runClickHandler);
  confirmBtn.replaceWith(editBtn);
});

function runMouseMoveHandler(event) {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);
    
  if(START_POINT == undefined) {
    if (maze[mazeX] && maze[mazeX][mazeY]) {
      if(maze[mazeX][mazeY] == 1) {
        if(lastPoint != undefined) {
          if(mazeX != lastPoint.x || mazeY != lastPoint.y) {
            CTX.drawImage(FLOOR_IMAGE, lastPoint.x * CELL_SIZE, lastPoint.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            CTX.drawImage(MOUSEMOVE_START, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
        lastPoint = new Point(mazeX, mazeY);
      }
    }
  }
  else if(END_POINT == undefined) {
    if (maze[mazeX] && maze[mazeX][mazeY]) {
      if(maze[mazeX][mazeY] == 1) {
        if(lastPoint != undefined) {
          if((mazeX != lastPoint.x || mazeY != lastPoint.y) && (START_POINT.x != lastPoint.x || START_POINT.y != lastPoint.y)) {
            CTX.drawImage(FLOOR_IMAGE, lastPoint.x * CELL_SIZE, lastPoint.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            CTX.drawImage(MOUSEMOVE_FINISH, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
        lastPoint = new Point(mazeX, mazeY);
      }
    }
  }
}

function createLinePath(startX, startY, endX, endY) {
  const centerStartX = startX + 0.5;
  const centerStartY = startY + 0.5;
  const centerEndX = endX + 0.5;
  const centerEndY = endY + 0.5;

  CTX.beginPath();
  CTX.moveTo(centerStartX * CELL_SIZE, centerStartY * CELL_SIZE);
  CTX.lineTo(centerEndX * CELL_SIZE, centerEndY * CELL_SIZE);
  CTX.lineWidth = CELL_SIZE / 3.5;
  CTX.lineCap = 'round';
  CTX.strokeStyle = '#34a853'
  CTX.stroke();
}

function runClickHandler(event) {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);
  
  if (maze[mazeX] && maze[mazeX][mazeY] && maze[mazeX][mazeY] == 1) {
    if(START_POINT == undefined) {
      START_POINT = new Point(mazeX, mazeY);
      if(END_POINT != undefined) {
        CTX.drawImage(START_3D, START_POINT.x * CELL_SIZE, START_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        aStar();
        editStartBtn.style.backgroundColor = '#7db8ff'
        editStartBtn.textContent = 'Изменить точку начала';
      }
    }
    else {
      END_POINT = new Point(mazeX, mazeY);
      aStar();
      editStartBtn.disabled = false;
    }
  }
}

function isBorder(inputX, inputY) {
  if(inputY == MAZE_HEIGHT - 1) return false;
  if(inputY == 0) return false;
  if(inputX == MAZE_WIDTH - 1) return false;
  if(inputX == 0) return false;
  return true;
}

function isPathPoint(inputX, inputY) {
  for(let i = 0; i < newPath.length; i++) {
    let currentPoint = newPath[i];
    if(inputX == currentPoint.x && inputY == currentPoint.y) {
      return false;
    }
  }

  if(START_POINT != undefined) {
    if(inputX == START_POINT.x && inputY == START_POINT.y) return false;
    return true;
  }
  return true;
}

//
//------------------------------------------
//edit maze
const editBtn = document.getElementById('edit');
const confirmBtn = document.createElement('button');
let editLastPoint = null;
let currentMouseMoveCell;
editBtn.addEventListener('click', function() {
  if(INPUT.value != "" && INPUT.value >= 15) {
    confirmBtn.id = 'confirm';
    confirmBtn.className = 'btn';
    confirmBtn.style.border = '1px solid #000000';
    confirmBtn.style.backgroundColor = '#f83e3e'
    confirmBtn.style.marginRight = '19.5vw';
    confirmBtn.textContent = 'Подтвердить';
    
    editBtn.replaceWith(confirmBtn);
    
    CANVAS.removeEventListener('mousemove', runMouseMoveHandler);
    CANVAS.removeEventListener('click', runClickHandler);
    CANVAS.addEventListener('mousemove', editMouseMoveHandler);
    CANVAS.addEventListener('click', editClickHandler);

    if(lastPoint != undefined) {
      if(isPathPoint(lastPoint.x, lastPoint.y)) draw(lastPoint.x, lastPoint.y);
    }
    if(editStartBtn.style.backgroundColor == "rgb(125, 184, 255)") editStartBtn.style.backgroundColor = '#eee';
  }
});

function editMouseMoveHandler(event) {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);

  if (isBorder(mazeX, mazeY) && isPathPoint(mazeX, mazeY)) {
    if(maze[mazeX][mazeY] == 0) {
      if(editLastPoint != undefined) {
        if(mazeX != editLastPoint.x || mazeY != editLastPoint.y) {
          draw(editLastPoint.x, editLastPoint.y);
          CTX.drawImage(MOUSEMOVE_FLOOR, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          currentMouseMoveCell = new Point(mazeX, mazeY);
        }
      }
      editLastPoint = new Point(mazeX, mazeY);
    }
    else {
      if(editLastPoint != undefined) {
        if(mazeX != editLastPoint.x || mazeY != editLastPoint.y) {
          draw(editLastPoint.x, editLastPoint.y);
          CTX.drawImage(MOUSEMOVE_WALL, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          currentMouseMoveCell = new Point(mazeX, mazeY);
        }
      }
      editLastPoint = new Point(mazeX, mazeY);
    }
  }
}

function editClickHandler(event) {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);

  if (isBorder(mazeX, mazeY) && isPathPoint(mazeX, mazeY)) {
    if(maze[mazeX][mazeY] == 0) {
      if(editLastPoint != undefined) {
        maze[mazeX][mazeY] = 1;
        draw(mazeX, mazeY);
      }
      editLastPoint = new Point(mazeX, mazeY);
    }
    else {
      if(editLastPoint != undefined) {
        maze[mazeX][mazeY] = 0;
        if(maze[mazeX][mazeY - 1] == 0) {
          draw(mazeX, mazeY);
          CTX.drawImage(WALL_IMAGE, mazeX * CELL_SIZE, (mazeY - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else {
          draw(mazeX, mazeY);
        }
      }
      editLastPoint = new Point(mazeX, mazeY);
    }
  }
}

confirmBtn.addEventListener('click', function() {
  CANVAS.removeEventListener('mousemove', editMouseMoveHandler);
  CANVAS.removeEventListener('click', editClickHandler);
  CANVAS.addEventListener('mousemove', runMouseMoveHandler);
  CANVAS.addEventListener('click', runClickHandler);
  if(currentMouseMoveCell != undefined) {
    if(isPathPoint(currentMouseMoveCell.x, currentMouseMoveCell.y)) {
      draw(currentMouseMoveCell.x, currentMouseMoveCell.y);
    }
  }
  confirmBtn.replaceWith(editBtn);
  runBtn.disabled = false;
  if(START_POINT != undefined) editStartBtn.disabled = false;
  if(editStartBtn.style.backgroundColor == "rgb(238, 238, 238)") editStartBtn.style.backgroundColor = '#7db8ff';
});
//
//------------------------------------------
//edit start point
function clearPath(inputPath) {
  for(let i = 0; i < inputPath.length; i++) {
    CTX.drawImage(FLOOR_IMAGE, newPath[i].x * CELL_SIZE, newPath[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
  CTX.drawImage(MOUSEMOVE_FINISH, newPath[newPath.length - 1].x * CELL_SIZE, newPath[newPath.length - 1].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  newPath = [];
}

editStartBtn.addEventListener('click', function() {
  if(maze.length == 0) alert('Сначала сгенерируйте лабиринт!');
  else if(newPath.length != 0) {
    editStartBtn.style.backgroundColor = '#f83e3e'
    editStartBtn.textContent = 'Выберите точку';

    clearPath(newPath);

    START_POINT = null;
    lastPoint = null;
  }
});
//
//------------------------------------------
//run code
function getMaze() {
  if(INPUT.value == "") {
    alert('Введите размер лабиринта!');
    return;
  }
  else if(INPUT.value < 15) {
    alert('Размер должен быть больше или равен 15!');
    return;
  }
  START_POINT = null;
  END_POINT = null;
  lastPoint = null;
  editStartBtn.disabled = true;
  runBtn.disabled = true;
  createMaze();
}

function editMaze() {
  if(INPUT.value == "") {
    alert('Введите размер лабиринта!');
    return;
  }
  else if(INPUT.value < 15) {
    alert('Размер должен быть больше или равен 15!');
    return;
  }
  if(maze.length == 0) createMaze();
  editStartBtn.disabled = true;
  runBtn.disabled = true;
}
//