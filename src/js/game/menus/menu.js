const GOM = require('../../core/game-object-manager');
const CONFIG = require('../game-config');

class Menu {
    constructor () {
        this.setEvents();
    }

    setEvents () {
        document.getElementById('projectile-object').addEventListener('change', (event) => {
            CONFIG.place_projectile = true;
            CONFIG.place_well = false;
            CONFIG.place_planet = false;
        });
        document.getElementById('well-object').addEventListener('change', (event) => {
            CONFIG.place_projectile = false;
            CONFIG.place_well = true;
            CONFIG.place_planet = false;
        });
        document.getElementById('planet-object').addEventListener('change', (event) => {
            CONFIG.place_projectile = false;
            CONFIG.place_well = false;
            CONFIG.place_planet = true;
        });

        document.getElementById('confine_projectiles').addEventListener('change', (event) => {
            CONFIG.confine_projectiles = event.currentTarget.checked;
        });

        document.getElementById('reset-button').addEventListener('click', () => {
            GOM.shutdownAll();
        });
    }
}

module.exports = new Menu();
