const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const { getRandomArbitrary, rgba } = require('../../lib/helpers');

class PlanetChunkObject extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = "chunk";

		this.velX = (opts.velX) ? opts.velX : (-1 + (Math.random() * 2));
		this.velY = (opts.velY) ? opts.velY : (-1 + (Math.random() * 2));

		var mag = Math.sqrt((this.velX * this.velX) + (this.velY * this.velY));
		this.velX = this.velX / mag;
		this.velY = this.velY / mag;
		// For 45 degree cone
		this.velY = this.velY * (Math.random() / 2);
		this.velX = this.velX * (Math.random() / 2);

		this.radius = opts.radius * Math.random();
		this.theta = 0;

		this.v1 = {};
		this.v2 = {};
		this.v3 = {};
		this.v4 = {};

		this.z = 5;
		this.rotateSpeed = Math.random() * 2;

		this.v1 = {
			x : getRandomArbitrary(0, this.radius),
			y : getRandomArbitrary(0, this.radius)
		};
		this.v2 = {
			x : getRandomArbitrary(0, this.radius),
			y : getRandomArbitrary(0, this.radius)
		};
		this.v3 = {
			x : getRandomArbitrary(0, this.radius),
			y : getRandomArbitrary(0, this.radius)
		};
		this.v4 = {
			x : getRandomArbitrary(0, this.radius),
			y : getRandomArbitrary(0, this.radius)
		};
	}

	checkBounds () {
		const x_bound = this.layer.canvas.width;
		const y_bound = this.layer.canvas.height;

		if (this.x > x_bound || this.x < 0 || this.y > y_bound || this.y + this.radius < 0) {
			this.shutdown();
		}
	}

	checkCollisions (opts) {
		// for (let i = 0; i < GOM.collidable_objects.length; ++i) {
		// 	const obj = GOM.collidable_objects[i];
		// 	const collision = obj.checkCollision(this);
		// }

		GOM.onCollidables('checkCollision', {
			caller: this
		});
	}

	update () {
		this.theta += this.rotateSpeed;
		this.x += this.velX;
		this.y += this.velY;
		this.center.x = this.x;
		this.center.y = this.y;

		this.checkBounds();
		if (this.remove) return;
		this.checkCollisions();
	}

	draw () {
		this.context.save();
		this.context.translate(this.x - this.radius, this.y - this.radius);
		this.context.rotate(this.theta * (Math.PI / 180));
		this.context.beginPath();
		this.context.moveTo(-this.v1.x, -this.v1.y);
		this.context.lineTo(-this.v2.x, +this.v2.y);
		this.context.lineTo(+this.v3.x, +this.v3.y);
		this.context.lineTo(+this.v4.x, -this.v4.y);
		this.context.lineTo(-this.v1.x, -this.v1.y);
		this.context.fillStyle = rgba(210, 210, 210);
		this.context.fill();
		this.context.restore();
	}
}

module.exports = PlanetChunkObject;
