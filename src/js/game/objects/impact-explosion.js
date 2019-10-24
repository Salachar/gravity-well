const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const { rgba } = require('../../lib/helpers');

class ImpactExplosion extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.radius = opts.radius || 0;
		this.radiusMod = opts.radiusMod || 0.3;
		this.alpha = 0.5;
		this.alphaMod = opts.alphaMod || 0.1;
		this.callback = opts.callback || null;

		this.z = 5;

		return this;
	}

	update (dt) {
		this.radius += this.radiusMod;
		this.alpha += this.alphaMod;
		if (this.radius < 0) {
			this.radius = 0;
		}
		if (this.alpha > 1) {
			this.callback();
			this.alpha = 1;
			this.radiusMod *= -1;
			this.alphaMod *= -0.25;
		}
		if (this.alpha <= 0) {
			this.shutdown();
		}
	}

	draw () {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.context.fillStyle = rgba(230, 230, 230, this.alpha);
		this.context.fill();
	}
}

module.exports = ImpactExplosion;
