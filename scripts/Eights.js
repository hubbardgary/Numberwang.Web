var Eights = mixin(Game, {
  type: "Eights",
  spawnNumbers: [3, 5, 8],
  initialTileCount: 4,

  move: function(direction) {
    return this.baseMove(direction);
  }
});
