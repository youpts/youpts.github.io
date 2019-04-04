var canvas = document.getElementById('constructor');
var ctx = canvas.getContext('2d');
var cellSize = 10;

var struct = {
	width: 0,
	height: 0,
	pillars: [],
	beams: [[],]
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
	clearExactConfig();
	genExactConfig();
	updateNumberPillars();
	drawField(canvas, ctx);
	drawStruct(canvas, ctx, struct);
}

function toBuild() {
	var elWidth = document.getElementById("config-width");
	var elHeight = document.getElementById("config-height");
	if (elWidth.value && elHeight.value) {
		struct.width = +elWidth.value;
		struct.height = +elHeight.value;
		struct.pillars = [0, struct.width];
		struct.beams = [[0, struct.height],];
		updateScene();
	}
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
	struct.pillars[indexLast] = Math.round((last - penult) / 2 + penult);
	struct.pillars.push(last);
	struct.beams.push(struct.beams[struct.beams.length - 1]);
	updateScene();
}

function arrangePillars() {
	var numSpans = struct.pillars.length - 1;
	var step = struct.width / numSpans;
	struct.pillars = [];

	for (var i = 0; i <= numSpans; i++) {
		struct.pillars.push(Math.round(i * step));
	}
	updateScene();
}

function clearExactConfig() {
	var elExactConfig = document.getElementById("exact-config");
	elExactConfig.innerHTML = '';
}

function changeApply(obj) {
	var num = '';
	for (var i = 6; i < obj.id.length; i++) {
		num += obj.id[i];
	}

	var elEditField = document.getElementById('editXPillar' + num);

	struct.pillars[num - 1] = +elEditField.value;
	updateScene();
}

function genExactConfig() {
	var elExactConfig = document.getElementById("exact-config");
	
	for (var i = 1; i < struct.pillars.length - 1; i++) {
		var elPillarLabel = document.createElement('span');
		elPillarLabel.className = 'label';
		elPillarLabel.innerHTML = 'Pillar ' + (i + 1) + '. x: ';
		
		var elEditXPillar = document.createElement('input');
		elEditXPillar.className = 'edit-field';
		elEditXPillar.id = 'editXPillar' + (i + 1);
		elEditXPillar.value = struct.pillars[i];

		var elApply = document.createElement('a');
		elApply.id = 'pillar' + (i + 1);
		elApply.setAttribute('href', '#');
		elApply.setAttribute('onclick', 'changeApply(this)');
		elApply.className = 'button';
		elApply.innerText = 'Apply';


		elExactConfig.appendChild(elPillarLabel);
		elExactConfig.appendChild(elEditXPillar);
		elExactConfig.appendChild(elApply);
		elExactConfig.appendChild(document.createElement('br'));
	}
}

updateScene();
