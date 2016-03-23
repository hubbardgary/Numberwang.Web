var $move;
var moveInProgress = false;


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
				// Moved successfully. Animate and up board.
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
			$('#gameOver').addClass('show');
		}
	}

	function setMoveable() {
		$('div > div').removeClass('moveable');
		var tiles = $('div > div');
		var tileNo = 0;
		for(var i = 0; i < moveMatrix.length; i++) {
			for(var j = 0; j < moveMatrix.length; j++) {
				if(moveMatrix[i][j] !== 0) {
					$(tiles[tileNo]).addClass('moveable');
				}
				tileNo++;
			}
		}
		$move = $(".moveable");
		$move.on('webkitTransitionEnd', function(e) {
			moveAnimationFinished();
		});
	}

	$move = $(".moveable");

	$('.downButton').click(function (e) {
		performMove('down');
	});

	$('.upButton').click(function (e) {
		performMove('up');
	});

	$('.leftButton').click(function (e) {
		performMove('left');
	});

	$('.rightButton').click(function (e) {
		performMove('right');
	});

	$('.testButton').click(function (e) {
		board = [
			[3,3,3,3],
			[3,3,3,3],
			[3,3,3,3],
			[3,3,3,3]
		];
	})

	function displayBoard() {
		var tiles = $('div > div');
		tiles.text('');
		tiles.removeClass();
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
		$move = $(".moveable");
		$move.off('webkitTransitionEnd');
		updateNextTile();
	};

	function getClass(tileValue) {
		return "e" + tileValue;
	}

	setBoard();
	displayBoard();
});
