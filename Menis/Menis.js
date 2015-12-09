function Menis(canvas)
{
	Menis.key             = new Menis.Key();
	Menis.mouse           = new Menis.Mouse(canvas);
	Menis.animator        = Menis.Animator;
	Menis.renderer        = new Menis.Renderer(canvas);
	Menis.resourceManager = new Menis.ResourceManager();
	Menis._entityManager  = Menis._EntityManager;

	Menis.root = new Menis.Entity('root');
	Menis.root.setSize(canvas.width, canvas.height);
	Menis._Layers(Menis.root);

	Menis.start = function () { Menis.Animator.start(); };
	Menis.stop  = function () { Menis.Animator.stop();  };

	Menis.Animator.animate = function ()
	{
		Menis._entityManager.triggerEnterFrameEvents(Menis.root);

		Menis._entityManager.removeMarkedEntities();

		Menis.renderer.render([Menis.root]);
	};

	canvas.addEventListener('mousedown', function () { canvas.focus(); });
}