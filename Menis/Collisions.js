Menis.Collisions = {};

Menis.Collisions.between = function (value, start, end)
{
	return value >= start && value <= end;
};

Menis.Collisions.rectanglesOverlaps = function (a, b)
{
	return Menis.Collisions.rectanglesOverlapsX(a, b) && Menis.Collisions.rectanglesOverlapsY(a, b);
};

Menis.Collisions.rectanglesOverlapsX = function (a, b)
{
	return (
		   this.between(a.left,  b.left, b.right)
		|| this.between(a.right, b.left, b.right)
		|| this.between(b.left,  a.left, a.right)
		|| this.between(b.right, a.left, a.right)
	);
};

Menis.Collisions.rectanglesOverlapsY = function (a, b)
{
	return (
		   this.between(a.top,    b.top, b.bottom)
		|| this.between(a.bottom, b.top, b.bottom)
		|| this.between(b.top,    a.top, a.bottom)
		|| this.between(b.bottom, a.top, a.bottom)
	);
};