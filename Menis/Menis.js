"use strict";

function Menis(canvas)
{
	JSLoader.loadScripts(
		[
			"Menis/util_lib.js",
			"Menis/Reflection.js",
			"Menis/Observable.js",

			"Menis/Animator.js",
			"Menis/Renderer.js",
			"Menis/EntityManager.js",
			"Menis/Entity.js",

			"Menis/Events.js",
			"Menis/Mouse.js",
			"Menis/Key.js",

			"Menis/ResourceManager.js",
			"Menis/Animation.js",
			"Menis/Collisions.js",

			"Menis/ImageAnimation.js",
			"Menis/SpritesheetAnimation.js",
			"Menis/CodeAnimation.js",
			"Menis/Text.js",
		],
		init
	);

	function init()
	{
		Menis.key             = new Menis.Key();
		Menis.mouse           = new Menis.Mouse(canvas);
		Menis.animator        = Menis.Animator;
		Menis.renderer        = new Menis.Renderer(canvas);
		Menis.resourceManager = new Menis.ResourceManager();
		Menis._entityManager  = Menis._EntityManager;

		Menis.root = new Menis.Entity();
		Menis.root.setSize(canvas.width, canvas.height);


		Menis.start = function () { Menis.Animator.start(); };
		Menis.stop  = function () { Menis.Animator.stop();  };

		Menis.Animator.animate = function ()
		{
			Menis._entityManager.triggerEnterFrameEvents(Menis.root);

			Menis._entityManager.removeMarkedEntities();

			Menis.renderer.render([Menis.root]);
		};
	}
}