var SandBar = Menis.Entity.specialize(function ()
{
	this.max = 100;
	this.current = 0;

	this.setAnimation(new Menis.CodeAnimation(function (g, o)
	{
		var perc = o.current / o.max;

		g.fillStyle = perc < 0.6 ? "rgba(0, 0, 0, 0.7)" : perc < 0.8 ? "rgba(120, 80, 0, 0.7)" : "rgba(255, 0, 0, 0.7)";
		g.fillRect(0, 0, 300, 20);

		g.fillStyle = "rgb(199, 183, 135)";
		g.fillRect(0, 0, Math.floor(300 * perc), 20);

		g.lineWidth = 5;
		g.strokeStyle = perc < 0.6 ? "#000000" : perc < 0.8 ? "#FFAA00" : "#FF0000";
		g.strokeRect(0, 0, 301, 20);
	}));

	this.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (this.current >= this.max && this.onFull)
			this.onFull();
	});
});