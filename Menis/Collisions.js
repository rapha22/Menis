export default {

	between: function (value, start, end) {
		return value >= start && value <= end;
	},

	rectanglesOverlaps: function (a, b) {
		return this.rectanglesOverlapsX(a, b) && this.rectanglesOverlapsY(a, b);
	},

	rectanglesOverlapsX: function (a, b) {
		return (
			   this.between(a.left,  b.left, b.right)
			|| this.between(a.right, b.left, b.right)
			|| this.between(b.left,  a.left, a.right)
			|| this.between(b.right, a.left, a.right)
		);
	},

	rectanglesOverlapsY: function (a, b) {
		return (
			   this.between(a.top,    b.top, b.bottom)
			|| this.between(a.bottom, b.top, b.bottom)
			|| this.between(b.top,    a.top, a.bottom)
			|| this.between(b.bottom, a.top, a.bottom)
		);
	},

	getOverlappingRectangle: function (a, b) {
		var y1;
		if (a.top >= b.top && a.top <= b.bottom) y1 = a.top;
		else if (b.top >= b.top && b.top <= b.bottom) y1 = b.top;

		var y2;
		if (a.bottom >= b.top && a.bottom <= b.bottom) y2 = a.bottom;
		else if (b.bottom >= a.top && b.bottom <= a.bottom) y2 = b.bottom;

		var x1;
		if (a.left >= b.left && a.left <= b.right) x1 = a.left;
		else if (b.left >= a.left && b.left <= a.right) x1 = b.left;

		var x2;
		if (a.right >= b.left && a.right <= b.right) x2 = a.right;
		else if (b.right >= a.left && b.right <= a.right) x2 = b.right;

		if (y1 === undefined) return null;
		if (y2 === undefined) return null;
		if (x1 === undefined) return null;
		if (x2 === undefined) return null;

		return {
			top:    Math.min(y1, y2),
			bottom: Math.max(y1, y2),
			left:   Math.min(x1, x2),
			right:  Math.max(x1, x2)
		};
	}
};