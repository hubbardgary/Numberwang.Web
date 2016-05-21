'use strict';

angular.module('numberwang.gameBoardDirective', ['swipe'])
  .directive('gameBoardDirective', ['GameService', function (GameService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/directives/gameBoard.html',
      link: function ($scope, element, attrs) {
        // Fire after other directives to ensure the tile divs exist
        $scope.$watch('$last',function(v) {
          $scope.GameService = GameService;
          $scope.animationCount = 0;

          refreshBoard();

          element.on('transitionend', function(e) { endAnimation(e); });
          element.on('webkitTransitionEnd', function(e) { endAnimation(e); });
          element.on('otransitionend', function(e) { endAnimation(e); });
          element.on('oTransitionEnd', function(e) { endAnimation(e); });
          element.on('msTransitionEnd', function(e) { endAnimation(e); });
        });

        function endAnimation(e) {
          $scope.animationCount++;
          // Only trigger when all tile animations have completed
          if($scope.animationCount === $('.moving').length) {
            $('.moving').removeAttr('style');
            $('.moving').removeClass('animate');
            $('.moving').removeClass('moving');
            refreshBoard();
            $scope.moveInProgress = false;
            $scope.animationCount = 0;
          }
        }

        function refreshBoard() {
          var tiles = $('.tile');
          tiles.text('');
          tiles.removeClass();
          tiles.addClass('tile');
          var tileNo = 0;
          for(var i = 0; i < GameService.game.board.length; i++) {
            for(var j = 0; j < GameService.game.board.length; j++) {
              if(GameService.game.board[i][j] !== 0) {
                $(tiles[tileNo]).text(GameService.game.board[i][j]);
                $(tiles[tileNo]).addClass(getClass(GameService.game.type, GameService.game.board[i][j]));

                $(tiles[tileNo]).addClass(GameService.game.type);
                if(GameService.game.board[i][j] === GameService.game.getMaxNumber()) {
                  $(tiles[tileNo]).addClass('max');
                }
              }
              tileNo++;
            }
          }
        }
      },

      controller: function($scope, $attrs, GameService) {
        $scope.$on('handleMove', function(event, args) {
          var direction = args;
          setmoving();

          var $movingTiles = $('.moving');
          $movingTiles.addClass('animate');
          $movingTiles.each(function() {
            animate(this, direction, Number($(this).data('distance')))
          });
        });

        var axisMap = {
          'up' : 'Y',
          'down' : 'Y',
          'left' : 'X',
          'right' : 'X'
        };

        var distanceMap = {
          'up' : -100,
          'down' : 100,
          'left' : -100,
          'right' : 100
        };

        function animate(tile, direction, distance) {
          $(tile).css({'transform':'translate' + axisMap[direction] + '(' + distance * distanceMap[direction] + 'px)'});
        }

        function setmoving() {
      		$('.tile').removeClass('moving');
      		var tiles = $('.tile');
      		var tileNo = 0;
      		for(var i = 0; i < GameService.game.moveMatrix.length; i++) {
      			for(var j = 0; j < GameService.game.moveMatrix.length; j++) {
      				if(GameService.game.moveMatrix[i][j] !== 0) {
      					$(tiles[tileNo]).addClass('moving');
      					$(tiles[tileNo]).data('distance', GameService.game.moveMatrix[i][j].toString());
      				}
      				tileNo++;
      			}
      		}
        }
      }
    }
  }]);
