import Menis from '../../../Menis/Menis.js';

var Tile = function (x, y, leftY, rightY)
{
	var size = Tile.size;

	this.hit = false;

	leftY = leftY || 0;
	rightY = rightY || 0;

	this.x = x;
	this.y = y;
	this.leftY = this.y + leftY;
	this.rightY = this.y + rightY;
	
	//Angle for ramps, hills, etc
	this.angle = Math.atan2(
		(this.y + rightY) - (this.y + leftY),
		(this.x + size) - this.x
	);

	if (Menis.debugMode)
	{
		var square = new Menis.Entity();
		square.setAnimation(new Menis.CodeAnimation(function (g, e)
		{
			g.fillStyle = '#00AA00';
			g.fillRect(x * size, y * size, size, size)
		}));

		Menis.Layers.get(99).addChild(square);
	}
};

Tile.size = 20;

export const Level = {
	tiles: [],

	map: function (rect)
	{
		var left   = Math.ceil(rect.left / Tile.size);
		var top    = Math.ceil(rect.top / Tile.size);
		var right  = Math.ceil(left + (rect.right - rect.left) / Tile.size);
		var bottom = Math.ceil(top + (rect.bottom - rect.top) / Tile.size);

		var tiles = this.tiles;

		for (var x = left; x <= right; x++)
		{
			tiles[x] = tiles[x] || [];

			for (var y = top; y <= bottom; y++)
			{
				tiles[x][y] = new Tile(x, y);
			}
		}
	},

	getTile: function (x, y)
	{
		return this.tiles[x] && this.tiles[x][y] || null;
	},
	
	getClosestTileAtRight: function (startingX, y)
	{
		var tile = null;
		var x = startingX + 1;
		
		for(; !tile && x <= this.tiles.length; x++)
			tile = this.tiles[x] && this.tiles[x][y] || null;
			
		return tile;
	},
	
	getClosestTileAtLeft: function (startingX, y)
	{
		var tile = null;
		var x = startingX - 1;
		
		for(; !tile && x >= -1; x--)
			tile = this.tiles[x] && this.tiles[x][y] || null;
			
		return tile;
	},
	
	getClosestTileAtBottom: function (x, startingY)
	{
		var xTiles = this.tiles[x];

		if (!xTiles) return null;	

		var tile = null;
		var y = startingY + 1;
		
		for(; !tile && y <= xTiles.length; y++)
			tile = xTiles[y];
			
		return tile;
	},
	
	getClosestTileAtTop: function (x, startingY)
	{
		var xTiles = this.tiles[x];

		if (!xTiles) return null;
	
		var tile = null;
		var y = startingY - 1;
		
		for(; !tile && y >= -1; y--)
			tile = xTiles[y];
			
		return tile;
	}
};