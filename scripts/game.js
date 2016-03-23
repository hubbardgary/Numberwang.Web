var board;
var moveMatrix;
var nextTile;
var spawnNumbers = [3, 5, 8];
var initialTileCount = 3;
var rotationMap = {
  "up" : 270,
  "right": 180,
  "down": 90,
  "left": 0
};

function printBoard() {
  var boardString = '';
  for(var i = 0; i < board.length; i++) {
    for(var j = 0; j < board.length; j++) {
      boardString += board[i][j];
      boardString += ',';
    }
    boardString += '\n';
  }
  console.log(boardString);
}

function printMoveMatrix() {
  var boardString = '';
  for(var i = 0; i < moveMatrix.length; i++) {
    for(var j = 0; j < moveMatrix.length; j++) {
      boardString += moveMatrix[i][j];
      boardString += ',';
    }
    boardString += '\n';
  }
  console.log(boardString);
}

function coordinate(x, y) {
  return {
    x: x,
    y: y
  };
}

function initializeBoard() {
  return [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
}

function pickANumberBetweenZeroAnd(max) {
  return Math.floor(Math.random() * max);
}

function pickACoordinate() {
  var vacantCells = [];
  for(var i = 0; i < board.length; i++) {
    if(board[i][board.length - 1] === 0) {
      vacantCells.push(i);
    }
  }
  return coordinate(vacantCells[pickANumberBetweenZeroAnd(vacantCells.length)],
                    board.length - 1);
}

function spawnNewTile() {
  return spawnNumbers[pickANumberBetweenZeroAnd(spawnNumbers.length)];
}

function setBoard() {
  board = initializeBoard();
  moveMatrix = initializeBoard();
  var tilesLaid = 0;
  do {
    var x = pickANumberBetweenZeroAnd(3);
    var y = pickANumberBetweenZeroAnd(3);
    if(board[x][y] === 0) {
      board[x][y] = spawnNewTile();
      tilesLaid++;
    }
  } while(tilesLaid < 3)
  nextTile = spawnNewTile();
}

function rotateClockwise(board, degrees) {
  if(degrees % 90 != 0 || degrees > 360 || degrees < 0) {
    // throw exception here
    return;
  }
  if(degrees === 0 || degrees === 360) {
    return board;
  }
  var newBoard = [[],[],[],[]];
  var maxBound = board.length - 1;

  for(var x = 0; x < board.length; x++) {
    for(var y = 0; y < board.length; y++) {
      if(degrees === 90) {
        newBoard[y][maxBound - x] = board[x][y];
      }
      else if (degrees === 180) {
        newBoard[maxBound - x][maxBound - y] = board[x][y];
      }
      else if (degrees === 270) {
        newBoard[maxBound - y][x] = board[x][y];
      }
    }
  }
  return newBoard;
}

function move(direction) {
  moveMatrix = initializeBoard();
  board = rotateBeforeMove(board, direction);
  var moved = shiftTilesLeft();

  if(moved) {
    var newTile = pickACoordinate();
    board[newTile.x][newTile.y] = nextTile;
    nextTile = spawnNewTile();
  }
  board = rotateAfterMove(board, direction);
  moveMatrix = rotateAfterMove(moveMatrix, direction);
  return moved;
}

function rotateBeforeMove(b, dir) {
  return rotateClockwise(b, rotationMap[dir]);
}

function rotateAfterMove(b, dir) {
  return rotateClockwise(b, 360 - rotationMap[dir]);
}

function shiftTilesLeft() {
  var moved = false;
  for(var x = 0; x < board.length; x++) {
    for(var y = 0; y < board.length - 1; y++) {
      var newValue = mergeTiles(board[x][y], board[x][y + 1]);
      if(newValue != -1) {
        board[x][y] = newValue;
        board[x][y + 1] = 0;
        moved = true;
        moveMatrix[x][y + 1] = 1; // Distance moved
      }
    }
  }
  return moved;
}

function mergeTiles(a, b) {
  if(a === 0 && b != 0) {
    return b;
  }
  if((a >= 8 && a === b) || (b !== 0 && a + b === 8)) {
    return a + b;
  }
  return -1;
}

function gameOver() {
  if(canMove()) {
    return false;
  }
  return true;
}

function canMove() {
  var canMove = false;
  for(var i = 0; i < board.length; i++) {
    for(var j = 0; j < board.length; j++) {
      forEachAdjacentCell(i, j, function(i1, j1) {
        if(mergeTiles(board[i][j], board[i1][j1]) != -1) {
          canMove = true;
        }
      });
    }
  }
  return canMove;
}

var forEachAdjacentCell = function(i, j, action) {
  for(var i1 = i - 1; i1 <= i + 1; i1++) {
    for(var j1 = j - 1; j1 <= j + 1; j1++) {
      if(inBounds(i1, j1) && !(i1 === i && j1 === j) && !(i1 !== i && j1 !== j)) {
        action(i1, j1);
      }
    }
  }
};

function inBounds(i, j) {
  return i >= 0 && i < board.length && j >= 0 && j < board.length;
}
