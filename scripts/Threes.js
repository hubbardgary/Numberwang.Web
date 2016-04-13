var Threes = mixin(Game, {
  type: "threes",
  spawnNumbers: [1, 2, 3],
  initialTileCount: 9,

  move: function(direction) {
    return this.baseMove(direction);
  },

  score: function() {
    var points = 0;
    this.forEachCell(function(i1, j1, self) {
      /* 1 and 2 are worth nothing.
       * Merged tiles start at 3 and double each time they're merged (3, 6, 12, 24, 48, etc).
       * The point score of each tile is 3 to the power of the tile's position in the above sequence,
       * so a 3 tile = 3^1 = 3 points, a 6 tile = 3^2 = 9 points, a 48 tile = 3^5 = 243 points.
       * The formula for the above sequence is a(n) = 3*2^(n-1)
       * Given a tile, its position in the sequence can be calculated by log(2x/3) / log(2).
       */
      if(self.board[i1][j1] % 3 === 0) {
        var power = (Math.log((2 * self.board[i1][j1]) / 3)) / Math.log(2);
        points += Number(Math.pow(3, power));
      }
    });
    return points;
  }
});
