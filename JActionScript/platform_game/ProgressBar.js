ProgressBar = Menis.Entity.specialize(function ()
{
	var text = new Menis.Text("loading...");
	text.fontName = "sans-serif";
	text.fontSize = "25pt";
	text.color = "#FFF"
	text.x = 20;
	text.Y = 20;
	this.addChild(text);

	this.percent = 0;

	var self = this;

	this.setAnimation(new Menis.CodeAnimation(function (g)
	{
		g.fillRect(0, 0, Menis.root.getWidth(), Menis.root.getHeight());

		g.strokeStyle = "#FFFFFF";
		g.rect(Menis.root.getWidth() / 2 - 200, Menis.root.getHeight() / 2 - 10, 400, 20);
		g.stroke();

		g.fillStyle = "#CC0000";

		g.fillRect(
			Menis.root.getWidth() / 2 - 195,
			Menis.root.getHeight() / 2 - 7,
			390 * self.percent / 100,
			14
		);
	}));
});