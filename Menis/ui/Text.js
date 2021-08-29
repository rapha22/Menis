import Entity from '../Entity.js';
import CodeAnimation from '../CodeAnimation.js';

export default Text = Entity.specialize(function (text)
{
	var self = this;

	self.text = text;
	self.fontName = null;
	self.fontSize = null;
	self.color = "#000000";

	self.setAnimation(new CodeAnimation(function (g)
	{
		if (!self.text) return;

		g.textBaseline = "top";
		g.font = self.fontSize + " " + self.fontName;
		g.fillStyle = self.color;
		g.fillText(self.text, 0, 0);
	}));
});