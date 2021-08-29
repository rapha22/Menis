import Entity from '../Entity.js';

const ScrollPanel = Entity.specialize(function (x, y, width, height)
{
	var panel = this;

	var container = new Entity();
	panel.addChild(container);

	panel.scrollBarBackgroundColor = '#COCOCO';
	panel.scrollBarForegroundColor = 'whitesmoke';
	panel.scrollBarSize = 20;

	var childVisibilityX = 0;
	var childVisibilityY = 0;

	//panel.clipRect(x, y, width, height);


	var horizontalBar = createHorizontalBar();
	var verticalBar = createVerticalBar();

	panel.addChild = function (child)
	{
		container.addChild(child);
	};

	panel.on(Menis.Events.ENTER_FRAME, function ()
	{
		var cs = container.getChildren();
		var containerWidth  = cs.reduce((r, c) => (c.x + c.width) > (r.x + r.width) ? c : r);
		var containerHeight  = cs.reduce((r, c) => (c.y + c.height) > (r.y + r.height) ? c : r);

		childVisibilityX = Math.min(width / containerWidth, 1);
		childVisibilityY = Math.min(height / containerHeight, 1);
	});

	function createHorizontalBar()
	{
		var bar = new Entity();
		var scroll = new Entity();

		bar.perc = 0;

		bar.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarBackgroundColor;
			g.fillRect(0, 0, width, panel.scrollBarSize);
		}));

		scroll.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarForegroundColor;
			g.fillRect(0, 0, width * childVisibilityX, panel.scrollBarSize);

			scroll.setSize(width * childVisibilityX, panel.scrollBarSize);
		}));

		scroll.on(Menis.Events.MOUSE_MOVE, function (e)
		{
			if (!Menis.mouse.isDown()) return;

			scroll.x += e.originalEvent.movementX;

			if (scroll.x < 0)
				scroll.x = 0;

			if (scroll.x + scroll.width > width)
				scroll.x = width - scroll.width;

			bar.perc = scroll.x / (width - scroll.width);
		});

		bar.addChild(scroll);

		bar.y = height;

		panel.addChild(bar);

		return bar;
	}

	function createVerticalBar()
	{
		var bar = new Entity();
		var scroll = new Entity();

		bar.perc = 0;

		bar.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarBackgroundColor;
			g.fillRect(0, 0, panel.scrollBarSize, height);
		}));

		scroll.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarForegroundColor;
			g.fillRect(0, 0, panel.scrollBarSize, height * childVisibilityY);

			scroll.setSize(width * childVisibilityX, panel.scrollBarSize);
		}));

		scroll.on(Menis.Events.MOUSE_MOVE, function (e)
		{
			if (!Menis.mouse.isDown()) return;

			scroll.y += e.originalEvent.movementY;

			if (scroll.y < 0)
				scroll.y = 0;

			if (scroll.y + scroll.height > height)
				scroll.y = height - scroll.height;

			bar.perc = scroll.y / (height - scroll.height);
		});

		bar.addChild(scroll);

		bar.x = width;

		panel.addChild(bar);

		return bar;
	}
});

export default ScrollPanel;