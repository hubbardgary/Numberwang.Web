'use strict';

angular.module('numberwang.scoreDirective', [])

.directive('scoreDirective', ['GameService', function (GameService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/score.html',
    controller: function($scope, $attrs, GameService) {
      $scope.score = function() {
        if($scope.GameService.game) {
          return $scope.GameService.game.score();
		}
		return 0;
      };
    }
  };
}]);
