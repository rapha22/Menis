var ProgressBar = Menis.Entity.specialize(function ()
{
	var text = new Menis.UI.Text("loading...");
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
		g.fillRect(0, 0, Menis.root.width, Menis.root.height);

		g.strokeStyle = "#FFFFFF";
		g.rect(Menis.root.width / 2 - 200, Menis.root.height / 2 - 10, 400, 20);
		g.stroke();

		g.fillStyle = "#CC0000";

		g.fillRect(
			Menis.root.width / 2 - 195,
			Menis.root.height / 2 - 7,
			390 * self.percent / 100,
			14
		);
	}));
});