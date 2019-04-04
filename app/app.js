var canvas = document.getElementById('constructor');
var ctx = canvas.getContext('2d');
var cellSize = 10;

var struct = {
	width: 5000,
	height: 2250,
	pillars: [0, 1500, 2375, 3250, 4125, 5000],
	beams: [[0, 200], [0, 2250], [0, 2250], [0, 2250], [0, 2250]]
}

function drawField(canvas, ctx) {
	var w = canvas.width;
	var h = canvas.height;

	ctx.save();
	ctx.clearRect(0, 0, w, h);
	for (var y = 0; y < h; y += cellSize) {
		if ((y / 10) % 2 == 0) {
			for (var x = 0; x < w; x += cellSize) {
				if ((x / 10) % 2 == 0) {
					ctx.fillStyle = "#252526";
					ctx.fillRect(x, y, cellSize, cellSize);
					ctx.fillStyle = '#1e1e1e';
					ctx.fillRect(x + cellSize, y, cellSize, cellSize);
				}
			}
		} else {
			for (var x = 0; x < w; x += cellSize) {
				if ((x / 10) % 2 != 0) {
					ctx.fillStyle = "#252526";
					ctx.fillRect(x, y, cellSize, cellSize);
					ctx.fillStyle = '#1e1e1e';
					ctx.fillRect(x - cellSize, y, cellSize, cellSize);
				}
			}
		}

	}
	ctx.restore();
}

// padding в процентах с одной стороны
function getScale(canvas, struct, padding) {
	if (struct.width > struct.height) {
		return (canvas.width - (canvas.width * (padding / 100)) * 2) / struct.width;
	} else {
		return (canvas.height - (canvas.height * (padding / 100)) * 2) / struct.height;
	}
}

function drawStruct(canvas, ctx, struct) {

	var padding = 10;
	var scale = getScale(canvas, struct, padding);
	var paddingLeft = struct.width > struct.height ? canvas.width * (padding / 100) : (canvas.width - (struct.width * scale)) / 2;
	var paddingTop = struct.width < struct.height ? canvas.height * (padding / 100) : (canvas.height - (struct.height * scale)) / 2;
	// draw pillars
	for (var i = 0; i < struct.pillars.length; i++) {
		var currX = (struct.pillars[i] * scale) + paddingLeft;
		var currY = (struct.height * scale) + paddingTop;
		drawAxisLine(ctx, currX, paddingTop, currX, currY);
	}
	// draw beams
	for (var i = 0; i < struct.beams.length; i++) {
		var x1 = (struct.pillars[i] * scale) + paddingLeft;
		var x2 = (struct.pillars[i + 1] * scale) + paddingLeft;

		for (var j = 0; j < struct.beams[i].length; j++) {
			var y1 = y2 = (struct.beams[i][j] * scale) + paddingTop;
			drawAxisLine(ctx, x1, y1, x2, y2);
		}

	}
}

function drawAxisLine(ctx, x1, y1, x2, y2) {
	ctx.save();
	ctx.setLineDash([5, 4]);
	ctx.strokeStyle = '#ce9178';
	ctx.beginPath();
	ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
	ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
	ctx.stroke();
	ctx.restore();
}

function updateNumberPillars() {
	var elNumPillars = document.getElementById('number-pillars');
	elNumPillars.innerText = struct.pillars.length;
}

function updateScene() {
	updateNumberPillars();
	drawField(canvas, ctx);
	drawStruct(canvas, ctx, struct);
}

function removePillar() {
	if (struct.pillars.length > 2) {
		var lastPillars = struct.pillars.pop();
		struct.pillars.pop();
		struct.beams.pop();
		struct.pillars.push(lastPillars);
		updateScene();
		return true;
	}
	return false;
}

function addPillar() {
	var indexLast = struct.pillars.length - 1;
	var last = struct.pillars[indexLast];
	var penult = struct.pillars[indexLast - 1];
	struct.pillars[indexLast] = (last - penult) / 2 + penult;
	struct.pillars.push(last);
	struct.beams.push(struct.beams[struct.beams.length - 1]);
	updateScene();
}

function arrangePillars() {
	var numSpans = struct.pillars.length - 1;
	var step = struct.width / numSpans;
	struct.pillars = [];

	for (var i = 0; i <= numSpans; i++) {
		struct.pillars.push(i * step);
	}
	console.log(struct.pillars);
	console.log(struct.beams);
	updateScene();
}

updateScene();

// function toBuild() {
// 	var width = document.getElementById("make-width");
// 	var height = document.getElementById("make-height");
// 	alert(width.value);
// 	alert(height.value);
// }

// function minPillars() {
// 	var numberOfPillars = document.getElementById("number-pillars");
// 	var value = +numberOfPillars.value;
// 	if (value <= 2) {
// 		numberOfPillars.value = 5;
// 	} else {
// 		numberOfPillars.value = numberOfPillars.value;	
// 	}
// }

// function checkNumberPillars() {
// 	var numbPillars = document.getElementById("num-pillars");
// 	numberPillars = +numbPillars.value;
// 	if (numberPillars < 2) {
// 		numberPillars = 2;
// 		numbPillars.value = 2;
// 	}
// }

// function pillarsApply() {


// 	numberPillars = +numberOfPillars.value;
// 	// document.'make-settings'.parentNode.removeChild(numberOfPillars);
// 	drawElementsPillars();

// 	numberOfPillars.value = numberPillars;
// 	console.log(numberPillars);
// }

// function clearElementsPillars() {
// 	var elFilling = document.getElementsByClassName('filling');
// 	if (elFilling.length > 2) {
// 		for (var i = 0; i < elFilling.length; i++) {
// 			console.log(elFilling[i]);
// 			elFilling[i].remove();
// 		}
// 	} else {
// 		elFilling[0].remove();
// 	}
// }

// function drawElementsPillars() {
// 	var butBuild = document.getElementById("but-build");

// 	clearElementsPillars();

// 	if (numberPillars < 2) {
// 		numberPillars = 2;
// 	}

// 	for (var i = 0; i < numberPillars - 1; i++) {
// 		var elPillar = document.createElement('div');
// 		elPillar.className = 'filling';
// 		var elTitle = document.createElement('span');
// 		elTitle.className = 'fillTitle';
// 		elTitle.innerHTML = 'Filling ' + (i + 1) + ':';

// 		elPillar.appendChild(elTitle);

// 		var elConf = document.getElementById('conf');
// 		elConf.insertBefore(elPillar, butBuild);
// 	}
// }

// checkNumberPillars();
// drawElementsPillars();
