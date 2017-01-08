var GameObject = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,

	getRectangle: function () {
		return {
			left: this.x,
			top: this.y,
			right: this.x + this.width,
			bottom: this.y + this.height
		};
	},

	hitTest: function (other) {
		return Menis.Collisions.rectanglesOverlaps(
			this.getRectangle(),
			other.getRectangle()
		);
	}
};