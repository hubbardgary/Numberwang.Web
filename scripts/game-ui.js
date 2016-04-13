var $move;
var moveInProgress = false;
var score = 0;
var gameInProgress;
var game;

$(document).ready(function() {

	$(document).keydown(function(e) {
		switch(e.which) {
			case 37:
				performMove('left');
				break;
			case 38:
				performMove('up');
				break;
			case 39:
				performMove('right');
				break;
			case 40:
				performMove('down');
				break;
			default:
				break;
		}
	});

	function performMove(direction) {
		if(!moveInProgress) {
			moveInProgress = true;
			if(game.move(direction)) {
				// Moved successfully. Animate and update board.
				setMoveable();
				$move.addClass('animate');
				switch(direction) {
					case 'up':
						$move.each(function() {
							$(this).css({"transform":"translateY(" + Number($(this).data('distance')) * -100 + "px)"});
						});
						break;
					case 'down':
						$move.each(function() {
							$(this).css({"transform":"translateY(" + Number($(this).data('distance')) * 100 + "px)"});
						});
						break;
					case 'left':
						$move.each(function() {
							$(this).css({"transform":"translateX(" + Number($(this).data('distance')) * -100 + "px)"});
						});
						break;
					case 'right':
						$move.each(function() {
							$(this).css({"transform":"translateX(" + Number($(this).data('distance')) * 100 + "px)"});
						});
						break;
				}
			}
			else {
				// Couldn't move in that direction
				moveInProgress = false;
			}
		}
	}

	function updateNextTile() {
		$('#nextTile').removeClass()
									.addClass(game.type)
									.addClass(getClass(game.nextTile))
									.text(game.nextTile);
	}

	var moveAnimationFinished = function() {
		$move.removeClass('animate');
		$move.removeClass('moveable');
		$move.removeClass('moveDown');
		$move.removeClass('moveUp');
		$move.removeClass('moveLeft');
		$move.removeClass('moveRight');
		$move.removeAttr('style'); // Get rid of all dynamic styling - i.e. the stuff added in $.css() calls
		$move.data('distance', '');
		displayBoard();
		moveInProgress = false;
		if(game.gameOver()) {
			gameInProgress = false;
			$('.your-score').text('Your score: ' + game.score());
			$('#game-over-modal').modal();
		}
	}

	function setMoveable() {
		$('.tile').removeClass('moveable');
		var tiles = $('.tile');
		var tileNo = 0;
		for(var i = 0; i < game.moveMatrix.length; i++) {
			for(var j = 0; j < game.moveMatrix.length; j++) {
				if(game.moveMatrix[i][j] !== 0) {
					$(tiles[tileNo]).addClass('moveable');
					$(tiles[tileNo]).data('distance', game.moveMatrix[i][j].toString());
				}
				tileNo++;
			}
		}
		$move = $('.moveable');
		$move.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
			moveAnimationFinished();
		});
	}

	$move = $('.moveable');

	$('.down-button').click(function (e) {
		performMove('down');
	});

	$('.up-button').click(function (e) {
		performMove('up');
	});

	$('.left-button').click(function (e) {
		performMove('left');
	});

	$('.right-button').click(function (e) {
		performMove('right');
	});

	$('#board').swipe({
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			performMove(direction);
		},
		threshold: 50
	});

	$('.play-again').click(function (e) {
		startGame();
		$('#game-over-modal').modal('hide');
	});

	$('#game-over-modal').on('hidden.bs.modal', function() {
		if(!gameInProgress)
			$('.game-over').show();
	});

	function displayBoard() {
		var tiles = $('.tile');
		tiles.text('');
		tiles.removeClass();
		tiles.addClass('tile');
		var tileNo = 0;
		for(var i = 0; i < game.board.length; i++) {
	    for(var j = 0; j < game.board.length; j++) {
	      if(game.board[i][j] !== 0) {
					$(tiles[tileNo]).text(game.board[i][j]);
					$(tiles[tileNo]).addClass(getClass(game.board[i][j]));

					$(tiles[tileNo]).addClass(game.type);
					if(game.board[i][j] === game.getMaxNumber()) {
						$(tiles[tileNo]).addClass('max');
					}

				}
				tileNo++;
	    }
		}
		$move = $('.moveable');
		$move.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
		updateNextTile();
	};

	function getClass(tileValue) {
		return game.type + '-' + tileValue;
	}

	function startGame() {
		game = Object.create(Threes);
		gameInProgress = true;
		game.setBoard();
		game.printBoard();
		displayBoard();
		$('.game-over').hide();
	}

	startGame();
});
