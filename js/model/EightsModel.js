'use strict';

var Eights = mixin(BaseGame, {
  type: 'eights',
  displayName: 'Eights',
  spawnNumbers: [3, 5, 8],
  initialTileCount: 4,

  move: function(direction) {
    return this.baseMove(direction);
  }
});
