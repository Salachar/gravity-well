const GOM = require('./core/game-object-manager');
const GIM = require('./core/game-input-manager');

const Menu = require('./game/menus/menu');
const WellContextMenu = require('./game/menus/well-context-menu');

const GI = require('./game/game-input');
const CONFIG = require('./game/game-config');

const APP = {};
window.APP = APP;

class Game {
	constructor () {
		GOM.shutdownAll();
		GOM.clearAllContexts();
		GIM.register(GI);
	}
}

window.onload = () => {
    // APP is only used for debugging purposes
    // Nothing in the game utilizes it
    APP.Game = new Game();
	APP.GOM = GOM;
    APP.GIM = GIM;
}

window.onresize = () => {
	GOM.resize();
}
