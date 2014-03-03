function Main(baseScriptsUrl)
{
	this.baseScriptsUrl = baseScriptsUrl;

	this.importFile = function(fileUrl, useBaseUrl)
	{
		var scriptTag = document.createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.src = (useBaseUrl ? baseScriptsUrl : "") + fileUrl;
		
		document.getElementsByTagName("head")[0].appendChild(scriptTag);
	}
	
	this.importFile("Util.js", true);
	this.importFile("DisplayObject.js", true);
	this.importFile("Animator.js", true);
	this.importFile("ImageAnimation.js", true);
	this.importFile("SpritesheetAnimation.js", true);
	this.importFile("CodeAnimation.js", true);
	this.importFile("Collisions.js", true);
}