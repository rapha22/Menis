(function()
{
	var Level = window.Level = {};

	Level.tiles = [];

	Level.map = function (x, y, leftY, rightY)
	{
		var tile = new Tile(x, y, leftY, rightY);

		$root.addChild(tile);
		
		Level.tiles[x] = Level.tiles[x] || [];
		Level.tiles[x][y] = tile;
		
		return Level.map;
	};

	Level.getTile = function (x, y)
	{
		return Level.tiles[x] && Level.tiles[x][y] || undefined;
	};
	
	Level.getClosestTileAtRight = function (startingX, y)
	{
		var tile = null;
		var x = startingX + 1;
		
		for(; !tile && x <= Level.tiles.length; x++)
			tile = Level.tiles[x] && Level.tiles[x][y] || undefined;
			
		return tile;
	};
	
	Level.getClosestTileAtLeft = function (startingX, y)
	{
		var tile = null;
		var x = startingX - 1;
		
		for(; !tile && x >= -1; x--)
			tile = Level.tiles[x] && Level.tiles[x][y];
			
		return tile;
	};
	
	Level.getClosestTileAtBottom = function (x, startingY)
	{
		if (!Level.tiles[x]) return null;
	
		var tile = null;
		var y = startingY + 1;
		
		for(; !tile && y <= Level.tiles[x].length; y++)
			tile = Level.tiles[x][y];
			
		return tile;
	};
	
	Level.getClosestTileAtTop = function (x, startingY)
	{
		if (!Level.tiles[x]) return null;
	
		var tile = null;
		var y = startingY - 1;
		
		for(; !tile && y >= -1; y--)
			tile = Level.tiles[x][y];
			
		return tile;
	};
	
	Level.loadLevel = function (level)
	{
		for (var i = 0; i < level.length; i++)
		{
			Level.map(level[i][0], level[i][1], level[i][2], level[i][3]);
		}
	};
})();