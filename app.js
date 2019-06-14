var origBoard;

const huPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	
	origBoard = Array.from(Array(9).keys());
	// console.log(origBoard);
	
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if(typeof origBoard[square.target.id] == "number") {
		// Initially the index are numbers, after playing in a spot the number is changed to "X" or "O"
		
		turn(square.target.id, huPlayer);
		if(!checkTie()) {
			turn(bestSpot(), aiPlayer);
		}
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	
	let gameWon = checkWin(origBoard, player);
	if(gameWon) {
		gameOver(gameWon);
	}
}

function checkWin(board, player) {
	// finding places on the board that are already played in (marked)
	let plays = board.reduce((acc, el, ind) => 
		(el === player) ? acc.concat(ind) : acc, []
	);
	
	let gameWon = null;
	
	for (let [index, win] of winCombos.entries()) {
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {
				index,
				player
			}
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = 
			gameWon.player == huPlayer ? "blue" : "red";
	}
	
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lost...");
}

function emptySquares() {
	return origBoard.filter(s => typeof s == "number");
}

function checkTie() {
	if(emptySquares().length == 0) {
		// No empty cells left
		for(var i=0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener("click", turnClick, false);
		}
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function bestSpot() {
	// Basic easily beatable algorithm of choosing the first available empty space by aiPlayer
	// return emptySquares()[0];
	
	// Un-beatable AI
	return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();
	
	if(checkWin(newBoard, huPlayer)) {
		return {score: -10};
	}
	else if(checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}
	else if(availSpots.length === 0) {
		return {score: 0};
	}
}
