'use strict';

angular.module('numberwang.game', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'templates/views/game.html',
    controller: 'GameCtrl'
  });
}])


.controller('GameCtrl', ['$scope', '$location', 'GameService', 'KeyboardService', '$uibModal', function($scope, $location, GameService, KeyboardService, $uibModal) {
  $scope.GameService = GameService;
  $scope.moveInProgress = false;

  $scope.performMove = function(direction) {
    if(!$scope.moveInProgress) {
			$scope.moveInProgress = true;
      if(GameService.game.move(direction)) {
        // Moved successfully. Trigger board update.
        $scope.$broadcast('handleMove', direction);
        if($scope.gameOver()) {
          var modalInstance = $uibModal.open({
            templateUrl: 'templates/views/gameOverModal.html',
            controller: 'GameOverCtrl'
          });
        }
      } else {
        $scope.moveInProgress = false;
      }
    }
  };

  $scope.gameOver = function() {
    if($scope.GameService.game) {
      return $scope.GameService.game.gameOver();
    } else {
      return false;
    }
  };

  $scope.score = function() {
    if($scope.GameService.game) {
      return $scope.GameService.game.score();
    } else {
      return 0;
    }
  };

  $scope.showScore = function() {
    if($scope.GameService.game) {
	  return GameService.game.showScore || GameService.game.gameOver();
	}
	return false;
  };

  $scope.showNextTile = function() {
    if($scope.GameService.game) {
      return GameService.game.showNextTile;
	}
	return false;
  };

  $scope.navigateToMenu = function() {
    $location.path('/');
  };

  KeyboardService.init();
  KeyboardService.on(function(direction) {
    $scope.performMove(direction);
    // Manually apply scope to ensure game over triggers correctly.
    $scope.$apply();
  });

  if(GameService.game == null) {
    $scope.navigateToMenu();
  }
}]);
