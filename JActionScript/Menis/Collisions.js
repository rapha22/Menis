Menis.Collisions = {};

Menis.Collisions.isInRange = function (value, start, end)
{
	return value >= start && value <= end;
}

Menis.Collisions.rectanglesOverlaps = function (a, b)
{
	var noOverlap = false;

	noOverlap |= a.left > b.right;
	noOverlap |= a.right < b.left;
	noOverlap |= a.top > b.bottom;
	noOverlap |= a.bottom < b.top;

	return !noOverlap;
}

Menis.Collisions.rectanglesOverlapsX = function (a, b)
{
	return this.isInRange(a.left, b.left, b.right) || this.isInRange(a.right, b.left, b.right);
}

Menis.Collisions.rectanglesOverlapsY = function (a, b)
{
	return this.isInRange(a.top, b.top, b.bottom) || this.isInRange(a.bottom, b.top, b.bottom);
}