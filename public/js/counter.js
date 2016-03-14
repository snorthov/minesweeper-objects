
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
	}
	
	this.getValue = function getValue () {
		return value;
	}
	
	function createDigit () {
		var digit = document.createElement("img");
		digit.src = "0.gif";
		return digit;
	}
	
	function initCounter () {
		var parent;
		if (tag) {
			parent = document.getElementById (tag);
		} else {
			parent = document.getElementsByTagName("body")[0];
		}
		while(parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
		for (var i=0; i<digits.length; i++) {
			parent.appendChild(digits [i] = createDigit());
		}
	}
}
