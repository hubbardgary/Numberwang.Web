var Game = {
  type: "BaseGame",
  spawnNumbers: [],
  initialTileCount: 0,
  gameType: function () {
    alert(this.type);
  },

  board: [],
  moveMatrix: [],
  nextTile: 0,

  rotationMap: {
    "up" : 270,
    "right": 180,
    "down": 90,
    "left": 0
  },

  //*************************
  // Debug helper functions *
  //*************************
  printBoard: function() {
    var boardString = '';
    for(var i = 0; i < this.board.length; i++) {
      for(var j = 0; j < this.board.length; j++) {
        boardString += this.board[i][j];
        boardString += ',';
      }
      boardString += '\n';
    }
    console.log(boardString);
  },

  printMoveMatrix: function() {
    var moveMatrixString = '';
    for(var i = 0; i < this.moveMatrix.length; i++) {
      for(var j = 0; j < this.moveMatrix.length; j++) {
        moveMatrixString += this.moveMatrix[i][j];
        moveMatrixString += ',';
      }
      moveMatrixString += '\n';
    }
    console.log(moveMatrixString);
  },

  //*****************************
  // Debug helper functions end *
  //*****************************

  printMoveMatrix: function() {
    var boardString = '';
    for(var i = 0; i < this.moveMatrix.length; i++) {
      for(var j = 0; j < this.moveMatrix.length; j++) {
        boardString += this.moveMatrix[i][j];
        boardString += ',';
      }
      boardString += '\n';
    }
    console.log(boardString);
  },

  coordinate: function(x, y) {
    return {
      x: x,
      y: y
    };
  },

  initializeBoard: function() {
    return [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];
  },

  pickANumberBetweenZeroAnd: function(max) {
    return Math.floor(Math.random() * max);
  },

  pickACoordinate: function() {
    var vacantCells = [];
    for(var i = 0; i < this.board.length; i++) {
      if(this.board[i][this.board.length - 1] === 0) {
        vacantCells.push(i);
      }
    }
    return this.coordinate(vacantCells[this.pickANumberBetweenZeroAnd(vacantCells.length)],
                      this.board.length - 1);
  },

  spawnNewTile: function() {
    return this.spawnNumbers[this.pickANumberBetweenZeroAnd(this.spawnNumbers.length)];
  },

  setBoard: function() {
    this.board = this.initializeBoard();
    this.moveMatrix = this.initializeBoard();
    var tilesLaid = 0;
    do {
      var x = this.pickANumberBetweenZeroAnd(this.board[0].length);
      var y = this.pickANumberBetweenZeroAnd(this.board.length);
      if(this.board[x][y] === 0) {
        this.board[x][y] = this.spawnNewTile();
        tilesLaid++;
      }
    } while(tilesLaid < this.initialTileCount)
    this.nextTile = this.spawnNewTile();
  },

  rotateClockwise: function(board, degrees) {
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
  },

  baseMove: function(direction) {
    this.moveMatrix = this.initializeBoard();
    this.board = this.rotateBeforeMove(this.board, direction);
    var moved = this.shiftTilesLeft();

    if(moved) {
      var newTile = this.pickACoordinate();
      this.board[newTile.x][newTile.y] = this.nextTile;
      this.nextTile = this.spawnNewTile();
    }
    this.board = this.rotateAfterMove(this.board, direction);
    this.moveMatrix = this.rotateAfterMove(this.moveMatrix, direction);
    return moved;
  },

  rotateBeforeMove: function(b, dir) {
    return this.rotateClockwise(b, this.rotationMap[dir]);
  },

  rotateAfterMove: function(b, dir) {
    return this.rotateClockwise(b, 360 - this.rotationMap[dir]);
  },

  shiftTilesLeft: function() {
    var moved = false;
    for(var x = 0; x < this.board.length; x++) {
      for(var y = 0; y < this.board.length - 1; y++) {
        var newValue = this.mergeTiles(this.board[x][y], this.board[x][y + 1]);
        if(newValue != -1) {
          this.board[x][y] = newValue;
          this.board[x][y + 1] = 0;
          moved = true;
          this.moveMatrix[x][y + 1] = 1; // Distance moved
        }
      }
    }
    return moved;
  },

  // This should be sufficient for 3s and 8s
  mergeTiles: function(a, b) {
    var maxSpawn = Math.max.apply(null, this.spawnNumbers);
    if(a === 0 && b != 0) {
      return b;
    }
    if((a >= maxSpawn && a === b) || (b !== 0 && a + b === maxSpawn)) {
      return a + b;
    }
    return -1;
  },

  gameOver: function() {
    if(this.canMove()) {
      return false;
    }
    return true;
  },

  canMove: function() {
    var canMove = false;
    for(var i = 0; i < this.board.length; i++) {
      for(var j = 0; j < this.board.length; j++) {
        this.forEachAdjacentCell(i, j, this, function(i1, j1, _this) {
          if(_this.mergeTiles(_this.board[i][j], _this.board[i1][j1]) != -1) {
            canMove = true;
          }
        });
      }
    }
    return canMove;
  },

  score: function() {
    var points = 0;
    this.forEachCell(function(i1, j1, self) {
      points += self.board[i1][j1];
    });
    return points + this.getMaxNumber();
  },

  getMaxNumber: function() {
    var max = 0;
    this.forEachCell(function(i, j, _this) {
      max = _this.board[i][j] > max ? _this.board[i][j] : max;
    });
    return max;
  },

  forEachAdjacentCell: function(i, j, self, action) {
    for(var i1 = i - 1; i1 <= i + 1; i1++) {
      for(var j1 = j - 1; j1 <= j + 1; j1++) {
        if(this.inBounds(i1, j1) && !(i1 === i && j1 === j) && !(i1 !== i && j1 !== j)) {
          action(i1, j1, self);
        }
      }
    }
  },

  inBounds: function(i, j) {
    return i >= 0 && i < this.board.length && j >= 0 && j < this.board.length;
  },

  forEachCell: function(action) {
    for(var i = 0; i < this.board.length; i++) {
      for(var j = 0; j < this.board.length; j++) {
        action(i, j, this);
      }
    }
  },

  forEachRow: function(action) {
    for(var i = 0; i < this.board.length; i++) {
      action(i, this);
    }
  }
}
