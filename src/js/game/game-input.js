const GOM = require('../core/game-object-manager');
const GIM = require('../core/game-input-manager');
const CONFIG = require('./game-config');

const Projectile = require('./objects/projectile');
const GravityWell = require('./objects/gravity-well');
const Planet = require('./objects/planet');

const { getRandomInt } = require('../lib/helpers');

class GI {
    constructor () {
        this.projectile_timer = false;
        this.contextHover = false;
    }

    mClick () {}

    mUp (mouse) {
        clearInterval(this.projectile_timer);
        this.projectile_timer = null;
    }

    mDown (mouse) {
        if (CONFIG.place_well) {
            this.spawnWell(mouse);
        }

        if (CONFIG.place_planet) {
            this.spawnPlanet(mouse);
        }

        if (CONFIG.place_projectile) {
            this.projectile_timer = setInterval(() => {
                this.spawnProjectile(mouse);
            }, 50);
        }
    }

    mLeave (mouse) {
        clearInterval(this.projectile_timer);
        this.projectile_timer = null;
    }

    spawnPlanet (mouse) {
        new Planet({
            layer: GOM.back,
            x: mouse.x,
            y: mouse.y,
            radius: getRandomInt(100, 200)
        });
    }

    spawnWell (mouse) {
        new GravityWell({
            layer: GOM.middle,
            x: mouse.x,
            y: mouse.y,
            radius: 200
        });
    }

    spawnProjectile (mouse) {
        new Projectile({
            layer: GOM.front,
            x: mouse.x,
            y: mouse.y,
            velX: (mouse.x - mouse.prev.x) * 0.25,
            velY: (mouse.y - mouse.prev.y) * 0.25
        });
    }
}

module.exports = new GI();
