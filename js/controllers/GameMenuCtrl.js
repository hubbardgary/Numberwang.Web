'use strict';

angular.module('numberwang.GameMenu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/menu', {
    templateUrl: 'templates/views/menu.html',
    controller: 'GameMenuCtrl'
  });
}])

.controller('GameMenuCtrl', ['$scope', '$location', 'GameService', 'KeyboardService', function($scope, $location, GameService, KeyboardService) {

  $scope.startGame = function(mode) {
    GameService.startGame(mode);
    $location.path('/game');
  };

  $scope.resume = function() {
    $location.path('/game');
  };

  $scope.quit = function() {
    GameService.game = null;
  };

  $scope.gameInProgress = function() {
    return GameService.game != null && !GameService.game.gameOver();
  };

  $scope.currentGame = GameService.game == null ? '' : GameService.game.displayName;
  KeyboardService.dispose();
}]);
