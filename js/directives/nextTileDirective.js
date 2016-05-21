'use strict';

angular.module('numberwang.nextTileDirective', [])

.directive('nextTileDirective', ['GameService', function (GameService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/nextTile.html',
    link: function ($scope, element, attrs) {
      updateNextTile(GameService.game.type, GameService.game.nextTile);
    },

    controller: function($scope, $attrs, GameService) {
      $scope.$on('handleMove', function(event, args) {
        updateNextTile(GameService.game.type, GameService.game.nextTile);
      });
    }
  };
}]);

function updateNextTile(gameType, nextTile) {
  $('#nextTile').removeClass()
                .addClass(gameType)
                .addClass(getClass(gameType, nextTile))
                .text(nextTile);
}

function getClass(gameType, tileValue) {
  return gameType + '-' + tileValue;
}
