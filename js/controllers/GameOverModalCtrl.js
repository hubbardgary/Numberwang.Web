'use strict';

angular.module('numberwang.GameOverCtrl', ['ngRoute', 'ui.bootstrap'])

.controller('GameOverCtrl', ['$scope', '$location', 'GameService', 'KeyboardService', '$uibModal', function($scope, $location, GameService, KeyboardService, $uibModal) {

  KeyboardService.dispose();

  $scope.score = function() {
    if(GameService.game) {
      return GameService.game.score();
	}
	return 0;
  };

  $scope.playAgain = function() {
    GameService.game = null;
    $location.path('/');
    $scope.$close();
  };
}]);
