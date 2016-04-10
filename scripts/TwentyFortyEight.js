var TwentyFortyEight = mixin(Game, {
  type: "2048",
  spawnNumbers: [2, 4],
  initialTileCount: 3,
  mergeMatrix: [],
  currentScore: 0,

  score: function() {
    return this.currentScore;
  },

  updateScore: function(points) {
    this.currentScore += points;
  },

  mergeTiles: function(a, b) {
    // b is sliding onto a
    if (a === 0) {
      return b;
    } else if (a === b) {
      return a + b;
    }
    return -1;
  },

  shiftTilesLeft: function() {
    var moved = false;
    this.mergeMatrix = this.initializeBoard();
    this.forEachRow(function(row, _this) {
      for(var col = 1; col < _this.board[0].length; col++) {
        if(_this.attemptToMoveTileLeft(row, col)) {
          moved = true;
        }
      }
    });
    this.forEachMergeMatrixCell(function(i, j, _this) {
      if(_this.mergeMatrix[i][j] === 1) {
        _this.updateScore(_this.board[i][j]);
      }
    });
    return moved;
  },

  attemptToMoveTileLeft: function(row, col) {
    if(this.board[row][col] !== 0) {
      // Moving a non-zero tile so continue
      var destination = this.findDestination(row, col);
      if(destination !== col) {
        // The tile can be moved, so calculate new tile value
        if(this.board[row][destination] !== 0) {
          this.mergeMatrix[row][destination] = 1;
        }
         // Set new destination tile value
        this.board[row][destination] = this.mergeTiles(this.board[row][destination], this.board[row][col]);
        // Reset tile's previous location
        this.board[row][col] = 0;
        // Update MoveMatrix with distance moved to assist with animation calculation
        this.moveMatrix[row][col] = col - destination;
        return true;
      }
    }
    return false;
  },

  findDestination: function(row, col) {
    var destination = col;

    // Shifting left, so we want to consider each cell in the row to the left of the source cell
    for(var j = col - 1; j >= 0; j--) {
      if(this.mergeMatrix[row][j] === 1) {
        // A tile has already merged here in this turn so its out of bounds
        break;
      }
      else if(this.board[row][j] === 0) {
        // This is good, but there might be better
        destination = j;
        continue;
      }
      else if(this.board[row][j] !== this.board[row][col]) {
        // Occupied by a non-matching tile, so can't land here
        break;
      }
      else if(this.board[row][j] === this.board[row][col]) {
        // Occupied by identical tile. We will merge with this one so stop looking
        destination = j;
        break;
      }
    }
    return destination;
  },

  pickACoordinate: function() {
    var vacantCells = [];
    this.forEachCell(function(i, j, _this) {
      if(_this.board[i][j] === 0) {
        vacantCells.push(Object.create(_this.coordinate(i, j)));
      }
    });
    return vacantCells[Math.floor(Math.random() * vacantCells.length - 1) + 1];
  },

  move: function(direction) {
    return this.baseMove(direction);
  },

  forEachMergeMatrixCell: function(action) {
    for(var i = 0; i < this.mergeMatrix.length; i++) {
      for(var j = 0; j < this.mergeMatrix.length; j++) {
        action(i, j, this);
      }
    }
  }
});
