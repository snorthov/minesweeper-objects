
/* Square States */
var SQUARE = "square";
var MINE = "square mine";
var EXPLOSION = "square explosion";
var FLAG = "square flag";
var QUESTION = "square question";
var WRONG = "square wrong";
var EMPTY = "square empty";
function EMPTY_N(i) {
	return i === 0 ? EMPTY : SQUARE + " mines" + i;
}

function Board (tag) {
	var self = this;
	var table, rows = 8, columns = 8;
	var mineCount = rows + columns;
	
	function squareAt (i, j) {
		return table.childNodes[0].childNodes[i].childNodes[j].childNodes[0];
	}
	
	this.isExploded = function isExploded () {
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				if (squareAt(i, j).image == EXPLOSION) return true;
				if (squareAt(i, j).image == WRONG) return true;
			}
		}
		return false;
	}
	
	this.isSwept = function isSwept () {
		var mineCount = 0, selectedCount = 0;
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				if (squareAt(i, j).selected) selectedCount++;
				if (squareAt(i, j).image == MINE) mineCount++;
			}
		}
		return rows * columns == selectedCount + mineCount;
	}
	
	function mouseDown(event, i, j) {
		if (self.isSwept () || self.isExploded ()) return;
		if (squareAt(i, j).selected) return;
		if (!event) event = window.event;
		if (event.button == 0 || event.button == 1) {
			if (squareAt(i, j).guesses == FLAG) return;
			squareAt(i, j).className = EMPTY;
		} else {
			if (squareAt(i, j).guesses == FLAG) {
				squareAt(i, j).guesses = QUESTION;
				squareAt(i, j).className  = QUESTION;
			} else {
				if (squareAt(i, j).guesses == QUESTION) {
					squareAt(i, j).guesses = undefined;
					squareAt(i, j).className = SQUARE;
				} else {
					squareAt(i, j).guesses = FLAG;
					squareAt(i, j).className = FLAG;
				}
			}
		}
	}
	
	function select (i, j) {
		if (0 <= i && i < rows) {
			if (0 <= j && j < columns) {
				if (squareAt(i, j).selected) return;
				if (squareAt(i, j).image == MINE) return;
				if (squareAt(i, j).guesses == FLAG) return;
				squareAt(i, j).selected = true;
				if (squareAt(i, j).image) {
					squareAt(i, j).className = squareAt(i, j).image;
				} else {
					squareAt(i, j).className = EMPTY;
					select (i, j - 1);
					select (i - 1, j);
					select (i + 1, j);
					select (i, j + 1);
				}
			}
		}
	}
	
	//BUG mouse up left button doesn't come when dragged
	//BUG mouse up right button doesn't come at all on Safari
	function mouseUp(event, i, j) {
		if (self.isSwept () || self.isExploded ()) return;
		if (squareAt(i, j).selected) return;
		if (!event) event = window.event;
		if (event.button == 0 || event.button == 1) {
			if (squareAt(i, j).image) {
				if (squareAt(i, j).guesses == FLAG) return;
				squareAt(i, j).selected = true;
				squareAt(i, j).className = squareAt(i, j).image;
				if (squareAt(i, j).image == MINE) {
					squareAt(i, j).image = EXPLOSION;
					self.reveal ();
				}
			} else {
				select (i, j);
			}
		}
	}
	
	function mouseDownFunction (i, j) {
		return function (event) {mouseDown(event, i, j)};
	}
	
	function mouseUpFunction (i, j) {
		return function (event) {mouseUp(event, i, j)};
	}
	
	function initTable () {
		var parent;
		if (tag) {
			parent = document.getElementById(tag);
		} else {
			parent = document.getElementsByTagName("body")[0];
		}
		while (parent.firstChild) {
			parent.removeChild (parent.firstChild);
		}
		/*var*/ table = document.createElement("table");
		var tableBody = document.createElement("tbody");
		for (i=0; i<rows; i++) {
			var row = document.createElement("tr");
			for (var j=0; j<columns; j++) {
				var cell = document.createElement("td");
				var image = document.createElement("img");
				image.className = SQUARE;
				//TODO - get rid of magic number, make shadow.jpg the right size
				image.width = image.height = 18;
				image.onmousedown = mouseDownFunction (i, j);
				image.onmouseup = mouseUpFunction (i, j);
				image.oncontextmenu = function () {return false};
				cell.appendChild(image);
				row.appendChild(cell);
			}
			tableBody.appendChild(row);
		}
		table.appendChild(tableBody);
		parent.appendChild(table);
	}
	 
	function initBoard () {
		var count = 0
		while (count < mineCount) {
			var i = Math.floor(Math.random() * rows);
			var j = Math.floor(Math.random() * columns);
			if (!squareAt (i, j).image) {
				squareAt (i, j).image = MINE;
				count++;
			}
		}
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				if (!squareAt(i, j).image) {
					var awayCount = 0;
					for (var k=i-1; k<i+2; k++) {
						for (var l=j-1; l<j+2; l++) {
							if (0 <= k && k < rows) {
								if (0 <= l && l < columns) {
									if (squareAt(k, l).image == MINE) awayCount++;
								}
							}
						}
					}
					if (awayCount != 0) squareAt(i, j).image = EMPTY_N(awayCount);
				}
			}
		}
	}
	
	this.reset = function reset (newRows, newColumns, newMineCount) {
		rows = newRows;
		columns = newColumns;
		mineCount = newMineCount;
		initTable ();
		initBoard ();
	}
	
	//BUG Safari does not redraw the images every time (clicking anywhere repaints)
	this.reveal = function reveal () {
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				squareAt(i, j).selected = true;
				if (squareAt(i, j).guesses == FLAG) {
					if (squareAt(i, j).image != MINE) {
						squareAt(i, j).className = WRONG;
					}
				} else {
					squareAt(i, j).className = squareAt(i, j).image ? squareAt(i, j).image : EMPTY;
				}
			}
		}
	}
	
	this.getGuessCount = function getGuessCount () {
		var count = 0;
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				if (squareAt(i, j).guesses == FLAG) count++;
			}
		}
		return count;
	}
	
	this.getMineCount = function getMineCount () {
		var count = 0;
		for (var i=0; i<rows; i++) {
			for (var j=0; j<columns; j++) {
				if (squareAt(i, j).image == MINE) count++;
			}
		}
		return count;
	}

	this.reset (rows, columns, mineCount);
}