const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const PlanetChunk = require('./planet-chunk');
const ImpactExplosion = require('./impact-explosion');

const { getDistance, getRandomInt, rgba, sqr } = require('../../lib/helpers');

class Planet extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = 'planet';
		this.collidable = true;

		this.z = 5;
		this.radius = opts.radius || 0;
		this.coreRadius = this.radius / 3;
		this.holes = [];
		this.r = 230;
		this.g = 230;
		this.b = 230;
		this.holeRadius = 8;
		this.exploded = false;

		this.sqr_radius = sqr(this.radius);
		this.sqr_core_radiua = sqr(this.coreRadius);
		this.sqr_hole_radius = sqr(this.holeRadius);

		// Canvas circles are drawn with x, y being the center
		// So we dont want the center modified by anything
		this.center = {
			x: this.x,
			y: this.y
		};

		return this;
	}

	addHole (obj) {
		const hole = {
			x: obj.center.x,
			y: obj.center.y
		};
		this.holes.push(hole);
		this.holes_length = this.holes.length;
		this.drawHole(hole);
		// obj.velX/obj.velY will have the chunk come off opposite direction of object
		// this.impact(obj.centerX, obj.centerY, obj.velX, obj.velY);
		// chunk will come outwards from planet center
		this.impact(obj.center.x, obj.center.y, this.x - obj.center.x, this.y - obj.center.y);
		obj.shutdown();
	}

	drawHole (hole) {
		this.context.beginPath();
		this.context.arc(hole.x, hole.y, this.holeRadius, 0, 2 * Math.PI);
		this.context.fillStyle = rgba(70, 70, 70, 1);
		this.context.fill();
		this.context.closePath();
	}

	checkCollision (opts = {}) {
		const caller = opts.caller;
		let dist = getDistance(this.center, caller.center, true);
		if (dist < this.sqr_radius) {
			this.handleCollision(caller, dist);
			return true;
		}
		return false;
	}

	handleCollision (obj, dist) {
		if (dist < this.sqr_core_radiua) {
			this.explode();
			this.shutdown();
			GOM.middle.update = true;
			GOM.back.update = true;
		}

		var collision = true;
		for (let k = 0; k < this.holes_length; ++k) {
			dist = getDistance(this.holes[k], obj.center, true);
			if (dist < this.sqr_hole_radius) {
				collision = false;
				break;
			}
		}

		if (collision) {
			this.addHole(obj);
		}
	}

	explode () {
		if (this.exploded) return;
		this.exploded = true;

		var pArea = Math.PI * (this.radius * this.radius);
		var hArea = Math.PI * (this.holeRadius * this.holeRadius);
		var amountLeft = (Math.floor(pArea / hArea) * 1.5) - this.holes.length;
		if (amountLeft < 0) amountLeft = 0;

		new ImpactExplosion({
			layer: GOM.front,
			x: this.x,
			y: this.y,
			radius: this.radius,
			radiusMod: 0.7,
			alphaMod: 0.07,
			callback: () => {
				for (var i = 0; i < amountLeft; ++i) {
					const chunk_pos = {
						x: this.x + (-this.radius + getRandomInt(0, this.radius * 2)),
						y: this.y + (-this.radius + getRandomInt(0, this.radius * 2))
					};
					const dist = getDistance(this, chunk_pos, true);
					if (dist < sqr(this.radius)) {
						new PlanetChunk({
							layer: GOM.front,
							x: chunk_pos.x,
							y: chunk_pos.y,
							radius: this.holeRadius,
							velX: -1 * (this.x - chunk_pos.x),
							velY: -1 * (this.y - chunk_pos.y)
						});
					}
				}
			}
		});
	}

	impact (x, y, velX, velY) {
		const chunks = getRandomInt(1,3);
		for (let i = 0; i < chunks; ++i) {
			new ImpactExplosion({
				layer: GOM.front,
				x: x,
				y: y,
				radius: this.holeRadius,
				radiusMod: 0.3,
				alphaMod: 0.1,
				callback: () => {
					new PlanetChunk({
						layer: GOM.front,
						x: x,
						y: y,
						radius: this.holeRadius,
						velX: (-1 * velX),
						velY: (-1 * velY)
					});
				}
			});
		}
		GOM.back.update = true;
	}

	draw () {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.context.fillStyle = rgba(this.r - 30, this.g - 30, this.b - 30, 1);
		this.context.fill();
		this.context.closePath();

		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius * 0.9, 0, 2 * Math.PI);
		this.context.fillStyle = rgba(this.r, this.g, this.b, 1);
		this.context.fill();
		this.context.closePath();

		this.context.save();
			this.context.beginPath();
			this.context.arc(this.x, this.y, this.coreRadius, 0, 2 * Math.PI);
			this.context.fillStyle = '#CC3300';

			this.context.shadowBlur = this.coreRadius;
			this.context.shadowColor = '#FF0000';
			this.context.fill();
			this.context.closePath();
		this.context.restore();

		for (var i = 0; i < this.holes.length; ++i) {
			this.drawHole({
				x : this.holes[i].x,
				y : this.holes[i].y
			});
		}
	}
}

module.exports = Planet;
