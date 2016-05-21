'use strict';

// Declare app level module which depends on views, and components
angular.module('numberwang', [
  'ngRoute',
  'ui.bootstrap',
  'numberwang.GameMenu',
  'numberwang.game',
  'numberwang.GameOverCtrl',
  'numberwang.services',
  'numberwang.KeyboardService',
  'numberwang.gameBoardDirective',
  'numberwang.nextTileDirective',
  'numberwang.scoreDirective'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/menu'});
}]);
