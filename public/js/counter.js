/*eslint-env browser */

function Counter (tag) {
	var value = 0;
	var digits = new Array (3);
	initCounter();
	
	//TODO - rename setValue() to setValue2() using references
	this.setValue = function setValue (newValue) {
		value = Math.max (0, Math.min (999, newValue));
		digits[0].src = "data/" + Math.floor(value / 100 % 10) + ".gif";
		digits[1].src = "data/" + Math.floor(value / 10 % 10) + ".gif";
		digits[2].src = "data/"+ Math.floor(value % 100 % 10) + ".gif";
	};
	
	this.getValue = function getValue () {
		return value;
	};
	
	function createDigit () {
		var digit = document.createElement("img");
		digit.src = "0.gif";
		return digit;
	}
	
	function initCounter () {
		var parentElement;
		if (tag) {
			parentElement = document.getElementById (tag);
		} else {
			parentElement = document.getElementsByTagName("body")[0];
		}
		while(parentElement.firstChild) {
			parentElement.removeChild(parentElement.firstChild);
		}
		for (var i=0; i<digits.length; i++) {
			parentElement.appendChild(digits [i] = createDigit());
		}
	}
}
