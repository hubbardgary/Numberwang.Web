var $move;
var moveInProgress = false;
var score = 0;
var gameInProgress;

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
			if(move(direction)) {
				// Moved successfully. Animate and update board.
				setMoveable();
				$move.addClass('animate');
				$move.addClass('move' + direction);
			}
			else {
				// Couldn't move in that direction
				moveInProgress = false;
			}
		}
	}

	function updateNextTile() {
		$('#nextTile').removeClass()
									.addClass(getClass(nextTile))
									.text(nextTile);
	}

	var moveAnimationFinished = function() {
		$move.removeClass('animate');
		$move.removeClass('moveable');
		$move.removeClass('moveDown');
		$move.removeClass('moveUp');
		$move.removeClass('moveLeft');
		$move.removeClass('moveRight');
		displayBoard();
		moveInProgress = false;
		if(gameOver()) {
			gameInProgress = false;
			$('.your-score').text('Your score: ' + score());
			$('#game-over-modal').modal();
		}
	}

	function setMoveable() {
		$('.tile').removeClass('moveable');
		var tiles = $('.tile');
		var tileNo = 0;
		for(var i = 0; i < moveMatrix.length; i++) {
			for(var j = 0; j < moveMatrix.length; j++) {
				if(moveMatrix[i][j] !== 0) {
					$(tiles[tileNo]).addClass('moveable');
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
		for(var i = 0; i < board.length; i++) {
	    for(var j = 0; j < board.length; j++) {
	      if(board[i][j] !== 0) {
					$(tiles[tileNo]).text(board[i][j]);
					$(tiles[tileNo]).addClass(getClass(board[i][j]));
				}
				tileNo++;
	    }
		}
		$move = $('.moveable');
		$move.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
		updateNextTile();
	};

	function getClass(tileValue) {
		return 'e' + tileValue;
	}

	function startGame() {
		gameInProgress = true;
		setBoard();
		displayBoard();
		$('.game-over').hide();
	}

	startGame();
});
