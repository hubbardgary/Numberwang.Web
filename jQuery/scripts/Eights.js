var Eights = mixin(Game, {
  type: "eights",
  spawnNumbers: [3, 5, 8],
  initialTileCount: 4,

  move: function(direction) {
    return this.baseMove(direction);
  }
});
