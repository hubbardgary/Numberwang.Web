'use strict';

angular.module('numberwang.services', [])
  .factory('GameService', function() {

    var modeMap = {
      'threes': Threes,
      'fives': Fives,
      'eights': Eights,
      '2048': TwentyFortyEight
    };

    var gameService = {};
    gameService.startGame = function(mode) {
      gameService.game = Object.create(modeMap[mode]);
      gameService.game.setBoard();
    }

    return gameService;
  });
