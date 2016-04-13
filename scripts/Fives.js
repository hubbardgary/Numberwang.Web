var Fives = mixin(Game, {
  type: "fives",
  spawnNumbers: [2, 3],
  initialTileCount: 8,
  tileScore: {
    /* Scoring for Fives is fairly arbitrary.
     * This array tranlates tile value to score.
     */
    5: 10,
    10: 25,
    20: 65,
    40: 170,
    80: 395,
    160: 975,
    320: 2455,
    640: 6540,
    1280: 16750,
    2560: 39500,
    5120: 95500,
    10240: 238750,
    20480: 716250
  },

  score: function() {
    var points = 0;
    this.forEachCell(function(i1, j1, self) {
      if(self.board[i1][j1] >= 5) {
        // All tiles higher than 20480 are scored as 1432500.
        points += self.tileScore[self.board[i1][j1]] ? self.tileScore[self.board[i1][j1]] : 1432500;
      }
    });
    return points;
  },

  move: function(direction) {
    var moved = this.baseMove(direction);
    if(this.spawnNumbers.indexOf(this.getMaxNumber()) < 0) {
      this.spawnNumbers.push(this.getMaxNumber());
      // Although a wider range of numbers can be spawned, we still want to
      // usually spawn 2 or 3.
      this.spawnNumbers.push(2);
      this.spawnNumbers.push(3);
    }
    return moved;
  },

  mergeTiles: function(a, b) {
    if(a === 0 && b !== 0) {
      return b;
    }
    if((a >= 5 && a === b) || (b !== 0 && a + b === 5)) {
      return a + b;
    }
    return -1;
  }
});
