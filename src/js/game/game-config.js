class CONFIG {
    constructor () {
        this.__props = {
            place_projectile: true,
            place_well: false,
            place_planet: false,
            confine_projectiles: false,
        };
    }

    set show_fps (new_val) {
        this.__props.show_fps = new_val;
    }

    get show_fps () {
        return this.__props.show_fps;
    }

    set place_projectile (new_val) {
        this.__props.place_projectile = new_val;
    }

    get place_projectile () {
        return this.__props.place_projectile;
    }

    set place_well (new_val) {
        this.__props.place_well = new_val;
    }

    get place_well () {
        return this.__props.place_well;
    }

    set place_planet (new_val) {
        this.__props.place_planet = new_val;
    }

    get place_planet () {
        return this.__props.place_planet;
    }

    set confine_projectiles (new_val) {
        this.__props.confine_projectiles = new_val;
    }

    get confine_projectiles () {
        return this.__props.confine_projectiles;
    }
}

module.exports = new CONFIG();
