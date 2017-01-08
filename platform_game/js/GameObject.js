var GameObject = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,

	getRectangle: function () {
		return {
			left: self.x,
			top: self.y,
			right: self.x + self.width,
			bottom: self.y + self.height
		};
	}
};