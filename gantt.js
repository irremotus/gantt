var Gantt = function() {
	canvas = document.getElementById('canvas1');
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.items = [];
	this.begin = -1;
	this.end = 0;
	this.lineCount = 0;
	this.topSpace = 50;
	this.getBounds = function() {
		var begin = -1;
		var end = 0;
		this.items.forEach(function(item) {
			if (begin == -1 || item.begin < begin)
				begin = item.begin;
			if (item.end > end)
				end = item.end;
		});
		this.begin = begin;
		this.end = end;
	}
	this.clear = function() {
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.draw = function() {
		this.clear();
		this.getBounds();
		this.drawDateBars();
		this.drawItems();
		console.log(this);
	}
	this.drawDateBars = function() {
		var width = this.canvas.width;
		var height = this.canvas.height;
		var numDays = (this.end - this.begin) / 86400000;
		console.log("num days: " + numDays);
		var barWidth = 1;
		//var barSpacing = (width - numDays * barWidth) / numDays;
		var barSpacing = width / numDays;
		var barX = barSpacing;
		var barY = this.topSpace;
		var ctx = this.canvas.getContext("2d");
		ctx.strokeStyle="#808080";
		for (i = 0; i < numDays; i++) {
			d = new Date(this.begin + i * (this.end - this.begin) / numDays);
			ctx.fillStyle="#000000";
			var textHeight = 15;
			ctx.font = textHeight.toString() + "px Arial";
			ctx.fillText((d.getMonth() + 1).toString() + "-" + d.getDate().toString(), barX, barY - textHeight);
			ctx.beginPath();
			ctx.moveTo(barX, barY);
			ctx.lineTo(barX, height);
			ctx.stroke();
			console.log("bar: x: " + barX);
			barX += barSpacing;
		}
	}
	this.addItem = function(item) {
		this.items.push(item);
	}
	this.drawItems = function() {
		var canvas = this.canvas;
		var begin = this.begin;
		var end = this.end;
		var gantt = this;
		this.items.forEach(function(item) {
			item.draw(gantt);
		});
	}
}

var Item = function(name, begin, end, complete) {
	this.items = [];
	this.begin = begin;
	this.end = end;
	this.name = name;
	this.id = "";
	this.complete = complete / 100;

	this.addItem = function(item) {
		this.items.push(item);
	}

	this.draw = function(g) {
		var ctx = g.canvas.getContext("2d");
		var barHeight = 20;
		var barX = (this.begin - g.begin) / (g.end - g.begin) * g.canvas.width;
		var barWidth = (this.end - this.begin) / (g.end - g.begin) * g.canvas.width;
		var barTopOffset = g.topSpace;
		var barY = barTopOffset + barHeight * 2 * g.lineCount;
		ctx.strokeStyle="#000000";
		ctx.fillStyle="#000000";
		ctx.rect(barX, barY, barWidth, barHeight);
		// draw the complete fill
		ctx.fillStyle="#FF0000";
		ctx.fillRect(barX, barY, barWidth * this.complete, barHeight);
		ctx.stroke();
		// draw text
		ctx.fillStyle="#000000";
		var textHeight = 15;
		ctx.font = textHeight.toString() + "px Arial";
		ctx.fillText(this.name, barX + textHeight, barY + textHeight);
		g.lineCount += 1;
		console.log("x: " + barX + ", y: " + barY + ", width: " + barWidth + ", height: " + barHeight);
		this.items.forEach(function(item) {
			item.draw(g);
		});
	}
}

