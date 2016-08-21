Menis.Game.ProgressBar = function ProgressBar(current, max) {
	Menis.Game.GameObjects(this);
	this.ui = new Menis.Game.ProgressBarUI(this);
	this.percent = 0;
};

Menis.Game.ProgressBarUI = function ProgressBarUI(pb) {
	var ui = new Menis.Entity('progress_bar');

	Menis.Game.Util.linkPosition(pb, ui);

	ui.width = 400;
	ui.height = 40;

	var text = new Menis.UI.Text("loading...");
	text.fontName = "sans-serif";
	text.fontSize = "25pt";
	text.color = "#FFF"
	ui.addChild(text);

	var bar = new Menis.Entity();
	bar.y = 20;
	bar.setAnimation(new Menis.CodeAnimation(function (g)
	{
		g.strokeStyle = "#FFFFFF";
		g.fillStyle = "#CC0000";
		g.strokeRect(0, 0, 400, 20);
		g.fillRect(0, 0, 390 * pb.percent / 100, 14);
	}));
	ui.addChild(bar);

	return ui;
};