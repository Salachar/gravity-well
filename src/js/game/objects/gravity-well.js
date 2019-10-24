const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const WellContextMenu = require('../menus/well-context-menu');

const { rgba, sqr, getDistance } = require('../../lib/helpers');;

class GravityWell extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = 'well';

		this.z = 1;
		this.radius = opts.radius || 0;
		this.clickRadius = 10;
		this.force = 100;
		this.mDownEvent = null;
		this.forceDirection = 1;

		this.r = 255;
		this.g = 255;
		this.b = 255;

		this.mouse_lock.mDown = true;

		this.context_menu = null;

		return this;
	}

	mouseOver (mouse) {
		const dist = getDistance(this, mouse);
		if (dist < this.clickRadius) return true;
		return false;
	}

	onContext (mouse) {
		this.context_menu = new WellContextMenu(this, mouse);
		return this;
	}

	mDown (mouse) {
		if (this.context_menu)  {
			if (!this.context_menu.hover) {
				this.context_menu.remove();
				this.context_menu = null;
			}
			return this.mouse_lock.mDown;
		}

		if (!this.mouseOver(mouse)) return false;

		if (getDistance(this, mouse) < this.clickRadius) {
			this.mDownEvent = setInterval(() => {
				this.x = mouse.x;
				this.y = mouse.y;
				this.layer.update = true;
			}, 16);
		}

		return this.mouse_lock.mDown;
	}

	mUp (mouse) {
		clearInterval(this.mDownEvent);
		this.mDownEvent = null;
		return this.mouse_lock.mUp;
	}

	update (dt) {
		for (var i = 0; i < GOM.game_objects.length; ++i) {
			var obj = GOM.game_objects[i];
			if (obj.type === "projectile" || obj.type === 'chunk') {
				var xDis = this.x - obj.center.x;
				var yDis = this.y - obj.center.y;
				var dist = (xDis * xDis) + (yDis * yDis);
				if (dist < (this.radius * this.radius)) {
					if (dist < 2) {
						obj.shutdown();
					} else {
						// console.log('update object');
						dist = Math.sqrt(dist);
						var force = this.forceDirection * (((this.radius / dist) * (this.radius / dist)) / (this.radius * (this.force/10)));
						obj.velX = (obj.velX + ((xDis / dist) * force));
						obj.velY = (obj.velY + ((yDis / dist) * force));
					}
				}
			}
		}
	}

	draw () {
		var fill = null;
		// Draw the inner circle, the "clickable" part
		this.context.beginPath();
		this.context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		fill = rgba(this.r, this.g, this.b, 0.5);
		this.context.fillStyle = fill;
		this.context.fill();
		// Draw the radius so the user can see the area of influence
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		fill = rgba(this.r, this.g, this.b, 0.1);
		this.context.fillStyle = fill;
		this.context.fill();
	}
}

module.exports = GravityWell;
