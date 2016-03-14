
var SAD = "data/sad.gif";
var HAPPY = "data/happy.gif";
var SMILE = "data/smile.gif";
var SURPRISE = "data/surprise.gif";
var board, counter1, counter2, button, timerId;

function mouseUp () {
	if (board.isSwept () || board.isExploded ()) {
		window.clearInterval (timerId);
		button.src = board.isExploded () ? SAD : HAPPY;
	} else {
		counter1.setValue(board.getMineCount() - board.getGuessCount());
	}
}

//TODO - Rename main() to main2() using 'References' menu
function main() {
    
    /*eslint-disable no-undef */
	counter1 = new Counter ("counter1");
	counter2 = new Counter ("counter2");
    /*eslint-enable no-undef */
    
	board = new Board ("board");
	board.reset (8, 8, 8);
	counter1.setValue (board.getMineCount());
	counter2.setValue (0);
	button = document.getElementById("button");
	button.src = SMILE;
	
	//TODO - get rid of local variable count, use getValue()+1 instead
	//TODO - add .tern-project file to enable cross file navigation
	//TODO - use Navigation and CodeAssist on counter2
	var count = 0;
	if (timerId) window.clearInterval (timerId);
	timerId = window.setInterval(function () {
		counter2.setValue (count++)
	}, 1000);
}