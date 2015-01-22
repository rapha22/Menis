(function ()
{
	var buff = createCanvasAndGraph(canvas.width, canvas.height);
	var drawing = createCanvasAndGraph(canvas.width, canvas.height);

	Menis.effects.EffectBase = function () { };

	Menis.effects.EffectBase.prototype.draw = function (g, e)
	{
		buff.graphs.clearRect(0, 0, buff.canvas.width, buff.canvas.height);
		buff.graphs.globalAlpha = 0.9;
		buff.graphs.drawImage(drawing.canvas, 0, 0);
		buff.graphs.globalAlpha = 1;

		//buff.graphs.globalCompositeOperation = "lighter";
		this.drawFunc(buff.graphs, e);

		drawing.graphs.clearRect(0, 0, drawing.canvas.width, buff.canvas.height);
		drawing.graphs.drawImage(buff.canvas, 0, 0);

		g.drawImage(drawing.canvas, 0, 0);
	};
	
	function createCanvasAndGraph(width, height)
	{
		var c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		
		var graphs = c.getContext("2d");	
		
		return { canvas:c, graphs:graphs };
	}

})();