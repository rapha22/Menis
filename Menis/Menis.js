import Renderer from './Renderer.js';
import * as AnimationStyles from './AnimationStyles.js';
import CodeAnimation from './CodeAnimation.js'
import { ImageAnimation, image } from './ImageAnimation.js'
import { SpritesheetAnimation, sprite } from './SpritesheetAnimation.js'

import Observable from './Observable.js'
import Events from './Events.js'

import Entity from './Entity.js'
import Layers from './Layers.js'

import Collisions from './Collisions.js'

import Text from './UI/Text.js'
import ScrollPanel from './UI/ScrollPanel.js'

import resourceManager from './ResourceManager.js'
import animator from './Animator.js'

import Key from './Key.js'
import Mouse from './Mouse.js'

export default function Menis(canvas) {
	const renderer = new Renderer(canvas, () => Menis.debugMode);

	Menis.renderer = renderer;

	Menis.root = new Menis.Entity('root');
	Menis.root.setSize(canvas.width, canvas.height);
	Layers(Menis.root);

	Menis.key = new Key();

	Menis.mouse = new Mouse(
		canvas,
		renderer,
		Menis.root,
		() => Menis.debugMode,
		() => Menis.traceMouse
	);

	Menis.start = function () { animator.start(); };
	Menis.stop  = function () { animator.stop();  };

	animator.animate = () => {
		Entity._EntityManager.triggerEnterFrameEvents(Menis.root);
		Entity._EntityManager.removeMarkedEntities();
		Menis.renderer.render([Menis.root]);
	};

	canvas.addEventListener('mousedown', function () { canvas.focus(); });
}

Menis.AnimationStyles = AnimationStyles;

Menis.CodeAnimation = CodeAnimation;

Menis.ImageAnimation = ImageAnimation;
Menis.image = image;

Menis.SpritesheetAnimation = SpritesheetAnimation;
Menis.sprite = sprite;

Menis.Observable = Observable;
Menis.Events = Events;

Menis.Entity = Entity;

Menis.UI = {
    Text,
    ScrollPanel
};

Menis.resourceManager = resourceManager;

Menis.Collisions = Collisions;