/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class GOM {
	constructor () {
		this.MILLISECONDS_BETWEEN_FRAMES = 16; // (1 / 60) * 1000
		this.GAME_LOOP = 0;
		this.last_frame = new Date().getTime();

		this.__props = {};

		this.__props.game_objects = [];
		this.__props.collidable_objects = [];
		this.__props.added_game_objects = [];

		this.el_fps_counter = document.getElementById('fps_counter');
		this.el_num_objects_counter = document.getElementById('num_objects_counter');

		this.startup();
	}

	set game_objects (new_game_objects) {
		this.__props.game_objects = new_game_objects;
	}

	get game_objects () {
		return this.__props.game_objects;
	}

	set collidable_objects (new_collidable_objects) {
		this.__props.collidable_objects = new_collidable_objects;
	}

	get collidable_objects () {
		return this.__props.collidable_objects;
	}

	set added_game_objects (new_added_game_objects) {
		this.__props.added_game_objects = new_added_game_objects;
	}

	get added_game_objects () {
		return this.__props.added_game_objects;
	}

	clearLayerObjects (layerObjects) {
		for (let i = 0; i < layerObjects.list.length; ++i) {
			if (layerObjects.list[x].shutdown) {
				layerObjects.list[x].shutdown();
			}
		}
		layerObjects.list = [];
	}

	clearLayer (layer) {
		layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		layer.backBufferContext.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
	}

	drawLayer (layer) {
		layer.backBufferContext.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

		let newObjList = [];
		for (let i = 0; i < layer.objects.list.length; ++i) {
			let obj = layer.objects.list[i];
			if (obj.remove) continue;
			newObjList.push(obj);
			obj.draw();
		}

		layer.objects.list = newObjList;
		layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		layer.context.drawImage(layer.backBuffer, 0, 0);
	}

	draw () {
		// The main game loop cares only about drawing the foreground every frame.
		// The middleground and background are for more persistent/heavy objects and is redrawn
		// through manual calls.

		// calculate the time since the last frame
		const this_frame = new Date().getTime();
		const dt = (this_frame - this.last_frame) / 1000;
		this.last_frame = this_frame;
		this.el_fps_counter.innerHTML = Math.ceil(1 / dt);

		this.addNewGameObjects();

		this.front.backBufferContext.clearRect(0, 0, this.front.canvas.width, this.front.canvas.height);

		let new_objects_list = [];
		let new_collidable_objects_list = [];
		for (let i = 0; i < this.game_objects.length; ++i) {
			let gameObj = this.game_objects[i];

			if (gameObj.update) {
				gameObj.update();
			}

			if (gameObj.remove) {
				gameObj = null;
				continue;
			}

			new_objects_list.push(gameObj);
			if (gameObj.collidable) {
				new_collidable_objects_list.push(gameObj);
			}

			if (gameObj.layer && gameObj.layer.zIndex === 3) {
				gameObj.draw();
			}
		}

		this.game_objects = new_objects_list;
		this.collidable_objects = new_collidable_objects_list;

		this.front.context.clearRect(0, 0, this.front.canvas.width, this.front.canvas.height);
		this.front.context.drawImage(this.front.backBuffer, 0, 0);

		if (this.middle.update) {
			this.middle.draw();
			this.middle.update = false;
		}
		if (this.back.update) {
			this.back.draw();
			this.back.update = false;
		}

		this.el_num_objects_counter.innerHTML = this.game_objects.length;
	}

	addNewGameObjects () {
		if (this.added_game_objects.length !== 0) {
			for (let i = 0; i < this.added_game_objects.length; ++i) {
				this.game_objects.push(this.added_game_objects[i]);
				if (this.added_game_objects[i].collidable) {
					this.collidable_objects.push(this.added_game_objects[i]);
				}
			}
			this.added_game_objects = [];
			this.game_objects.sort((a,b) => {
				return a.zOrder - b.zOrder;
			});
		}
	}

	eventOnObjects (event, data, object_exclude) {
		let locked_object = null;
		for (let i = 0; i < this.game_objects.length; ++i) {
			if (object_exclude && object_exclude.id === this.game_objects[i].id) continue;
			locked_object = this.eventOnObject(event, data, this.game_objects[i]);
			if (locked_object) return locked_object;
		}
	}

	eventOnObject (event, data, object) {
		if (!object) return null;
		const lock = object[event](data);
		if (event.match(/mClick|mDown|mUp/) && lock) return object;
		return null;
	}

	setCanvasSize () {
		// Get the width and height for you canvas, taking into account any constant menus.
		const container = document.getElementById('canvas_container');
		let canvasWidth = container.clientWidth;
		let canvasHeight = container.clientHeight;

		// Loop through the canvases and set the width and height
		['control', 'front', 'middle', 'back'].forEach((canvas_key) => {
			this[canvas_key].canvas.setAttribute('width', canvasWidth + 'px');
			this[canvas_key].canvas.setAttribute('height', canvasHeight + 'px');
			this[canvas_key].canvas.style.width  = canvasWidth + 'px';
			this[canvas_key].canvas.style.height = canvasHeight + 'px';
			this[canvas_key].backBuffer.setAttribute('width', canvasWidth + 'px');
			this[canvas_key].backBuffer.setAttribute('height', canvasHeight + 'px');
			this[canvas_key].backBuffer.style.width  = canvasWidth + 'px';
			this[canvas_key].backBuffer.style.height = canvasHeight + 'px';
		});
	}

	startup () {
		['control', 'front', 'middle', 'back'].forEach((canvas_key) => {
			this[canvas_key] = {
				canvas : document.getElementById(`${canvas_key}_canvas`),
				context : null,
				backBuffer : document.createElement('canvas'),
				backBufferContext : null,
				zIndex : 3,
				update: false,
				objects : {
					list : [],
					clear: () => {
						this.clearLayerObjects(this[canvas_key]);
					}
				},
				draw: () => {
					this.drawLayer(this[canvas_key]);
				},
				clear: () => {
					this.clearLayer(this[canvas_key]);
				}
			};
			this[canvas_key].context =  this[canvas_key].canvas.getContext('2d');
			this[canvas_key].backBufferContext =  this[canvas_key].backBuffer.getContext('2d');
		});

		this.setCanvasSize();
		// this.startLoop();
		this.gameLoop();
	}

	onCollidables (func, params) {
		const collidables = this.collidable_objects;
		for (let i = 0; i < collidables.length; ++i) {
			const obj = collidables[i];
			if (obj && obj[func]) {
				obj[func](params);
			}
		}
	}

	gameLoop () {
		window.requestAnimationFrame(() => {
			this.gameLoop();
		});
		this.draw();
	}

	startLoop () {
		// setInterval will call the function for our game loop
		this.GAME_LOOP = setInterval(() => {
			this.draw();
		}, this.MILLISECONDS_BETWEEN_FRAMES);
	}

	pauseLoop () {
		clearInterval(this.GAME_LOOP);
		this.GAME_LOOP = null;
	}

	resize () {
		this.setCanvasSize();
	}

	shutdownAll () {
		this.eventOnObjects('shutdown');
		this.game_objects = [];
		this.collidable_objects = [];
		this.added_game_objects = [];
		this.clearAllContexts();
	}

	addGameObject (game_object) {
		this.added_game_objects.push(game_object);
		if (game_object.layer) {
			game_object.layer.objects.list.push(game_object);
			game_object.layer.update = true;
		}
	}

	clearAllContexts () {
		this.front.clear();
		this.middle.clear();
		this.back.clear();
	}
}

module.exports = new GOM();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

const Helpers = {
	uuid: function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	rgba: function (r,g,b,a) {
		var a = (a) ? a : 1;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")"
	},

	sqr: function (value) {
		return value * value;
	},

	getDistance: function (p1, p2, no_sqrt) {
		let dist = Helpers.sqr(p1.x - p2.x) + Helpers.sqr(p1.y - p2.y);
		if (no_sqrt) return dist;
		return Math.sqrt(dist);
	},

	getRandomArbitrary: function (min, max){
		return Math.random() * (max - min) + min;
	},

	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	returnRandom: function (numbers) {
		var length = numbers.length;
		var index = getRandomInt(0, length-1);
		return numbers[index];
	},

	percentage: function (percent) {
		return (getRandomInt(1,100) >= percent);
	},

	getMouseCoords: function (event, canvas) {
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = canvas;

		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;

		while(currentElement = currentElement.offsetParent){
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		}

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return {
			x : canvasX,
			y : canvasY
		};
	},

    createElement: function (type, classes, opts) {
        opts = opts || {};
        let node = document.createElement(type);
        let classes_split = classes.split(' ');
        for (let i = 0; i < classes_split.length; ++i) {
            node.classList.add(classes_split[i]);
        }
        if (opts.attributes) {
            for (let attr in opts.attributes) {
                if (opts.attributes[attr]) {
                    node.setAttribute(attr, opts.attributes[attr]);
                }
            }
        }
        if (opts.dataset) {
            for (let data in opts.dataset) {
                if (opts.dataset[data]) {
                    node.dataset[data] = opts.dataset[data];
                }
            }
        }
        if (opts.events) {
            for (let event in opts.events) {
                node.addEventListener(event, opts.events[event]);
            }
        }
        if (opts.html) {
            node.innerHTML = opts.html;
        }
        if (opts.addTo) {
            opts.addTo.appendChild(node);
        }
        return node;
    }
};
module.exports = Helpers;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(1);
const uuid = Helpers.uuid;

class GOB {
	constructor (opts = {}) {
		this.id = uuid();

		this.x = opts.x || 0;
		this.y = opts.y || 0;

		this.collidable = false;

		this.__props = {};

		this.mouse_lock = {
			mClick: false,
			mDown: false,
			mUp: false,
			mLeave: false
		};

		this.__props.dimensions = {
			width: 0,
			half_width: 0,
			height: 0,
			half_height: 0
		};

		// x and y coords of the center of the object
		this.__props.center = {
			x: 0,
			y: 0
		}

		this.zOrder = opts.z || 0;

		this.remove = false;
		this.layer = opts.layer || null;
		this.context = (this.layer) ? this.layer.backBufferContext : null;

		GOM.addGameObject(this);
	}

	set width (new_width) {
		this.__props.dimensions.width = new_width;
		this.__props.dimensions.half_width = new_width / 2;
	}

	get width () {
		return this.__props.dimensions.width;
	}

	set height (new_height) {
		this.__props.dimensions.height = new_height;
		this.__props.dimensions.half_height = new_height / 2;
	}

	get height () {
		return this.__props.dimensions.height;
	}

	set center (new_center) {
		this.__props.center = new_center;
	}

	get center () {
		return {
			x: this.x + this.__props.dimensions.half_width,
			y: this.y + this.__props.dimensions.half_height
		};
	}

	checkCollision (opts = {}) {
		return false;
	}

	update () {}

	draw () {}

	keyPress () {}

	keyDown () {}

	keyUp () {}

	mClick () {
		return this.mouse_lock.mClick;
	}

	mDown () {
		return this.mouse_lock.mDown;
	}

	mUp () {
		return this.mouse_lock.mUp;
	}

	mLeave () {}

	mouseOver () {
		return false;
	}

	onContext () {
		return false;
	}

	shutdown () {
		this.remove = true;
	}
}

module.exports = GOB;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(1);
const getMouseCoords = Helpers.getMouseCoords;

// var SPACE_BAR = 32;
// var LEFT_ARROW = 37;
// var UP_ARROW = 38;
// var RIGHT_ARROW = 39;
// var DOWN_ARROW = 40;

// var SPACE_BAR_DOWN = false;
// var LEFT_ARROW_DOWN = false;
// var UP_ARROW_DOWN = false;
// var RIGHT_ARROW_DOWN = false;
// var DOWN_ARROW_DOWN = false;

const KEY_CODES = {
	32: 'SPACE_BAR',
	37: 'LEFT_ARROW',
	38: 'UP_ARROW',
	39: 'RIGHT_ARROW',
	40: 'DOWN_ARROW'
};

class GIM {
	constructor () {
		this.mouse = {
			x: 0,
			y: 0,
			prev: {
				x: 0,
				y: 0
			}
		};

		this.keysDown = {};
		this.input_managers = [];

		this.setupKeyEvents();
		this.setupControlCanvasEvents();
	}

	register (input_manager) {
		this.input_managers.push(input_manager);
	}

	setupKeyEvents () {
		document.addEventListener('keypress', (event) => {
			const key = KEY_CODES[event.keyCode];
			this.fireEvent('keyPress', key);
		});

		document.addEventListener('keydown', (event) => {
			const key = KEY_CODES[event.keyCode];
			this.keysDown[key] = true;
			GOM.eventOnObjects('keyDown', key);
		});

		document.addEventListener('keyup', (event) => {
			const key = KEY_CODES[event.keyCode];
			delete this.keysDown[key];
			GOM.eventOnObjects('keyUp', key);
		});
	}

	fireEvent (event, data) {
		let prev_locked_object = this.locked_object;
		// Check to see if there is a locked object, if there is, only fire the event on it
		if (this.locked_object) {
			this.locked_object = GOM.eventOnObject(event, data, this.locked_object);
			// Check to see if the object and event are still locked, if so, return
			if (this.locked_object) return;
		}
		// prev_locked_object will be passed over when the events are fired, this is
		// because if prev_locked_event was an object, the event would have been fired
		// on it above to see if it was still locked. We don't want double events.
		this.locked_object = GOM.eventOnObjects(event, data, prev_locked_object);
		// Don't fire the event on the input manager if an object is locked
		if (this.locked_object) return;

		this.input_managers.forEach((input_manager) => {
			input_manager[event](data);
		});
	}

	setupControlCanvasEvents () {
		GOM.control.canvas.addEventListener('click', (event) => {
			this.fireEvent('mClick', this.mouse);
		});

		GOM.control.canvas.addEventListener('mousedown', (event) => {
			if (event.which !== 1) return;
			this.fireEvent('mDown', this.mouse);
		});

		GOM.control.canvas.addEventListener('mouseup', (event) => {
			this.fireEvent('mUp', this.mouse);
		});

		GOM.control.canvas.addEventListener('mouseleave', (event) => {
			this.fireEvent('mLeave', this.mouse);
		});

		GOM.control.canvas.addEventListener('contextmenu', (event) => {
			// The normal context menu will only show up if there is no gameObject with
			// a registered onContext function.
			for (let i = 0; i < GOM.game_objects.length; ++i) {
				const obj = GOM.game_objects[i];
				if (obj.mouseOver(this.mouse)) {
					this.locked_object = obj.onContext(this.mouse);
					event.preventDefault();
					break; // I dont want multiple context menus open at once
				}
			}
		});

		GOM.control.canvas.addEventListener('mousemove', (event) => {
			const pos = getMouseCoords(event, GOM.control.canvas);
			if (this.mouse.prev.x !== this.mouse.x) {
				this.mouse.prev.x = this.mouse.x;
			}
			if (this.mouse.prev.y !== this.mouse.y) {
				this.mouse.prev.y = this.mouse.y;
			}
			this.mouse.x = pos.x;
			this.mouse.y = pos.y;
		});
	}
}

module.exports = new GIM();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const { createElement } = __webpack_require__(1);

class WellContextMenu {
    constructor (parent_gravity_well, mouse) {
        this.parent_gravity_well = parent_gravity_well;

        this.mouse_over = true;
        this.radius_max = 1000;
        this.force_max = 250;

        this.node = null;
        this.createCreateContextNode();
        this.positionMenu(mouse);

        setTimeout(() => {
            this.id_base = 'well_context';
            [
                'radius_input',
                'radius_value',
                'force_input',
                'force_value',
                'direction',
                'delete'
            ].forEach((node_id) => {
                this[`el_${this.id_base}_${node_id}`] = document.getElementById(`${this.id_base}_${node_id}`);
            });
            this.setEvents();
        }, 0);
    }

    nodeTemplate () {
        console.log(this.parent_gravity_well);
        return `
            <div>
                <span>Radius: </span><span id="well_context_radius_value">${this.parent_gravity_well.radius}</span>
                <div id="radius-input">
                    <span>1</span>
                    <input id="well_context_radius_input" type="range" min="1" max="${this.radius_max}" step="1" value="${this.parent_gravity_well.radius}">
                    <span>${this.radius_max}</span>
                </div>
            </div>
            <div>
                <span>Force: </span><span id="well_context_force_value">${this.parent_gravity_well.force}</span>
                <div id="force-input">
                    <span>1</span>
                    <input id="well_context_force_input" type="range" min="1" max="${this.force_max}" step="1" value="${this.parent_gravity_well.force}">
                    <span>${this.force_max}</span>
                </div>
            </div>
            <div>
                <label for="well_context_direction">Invert Force (push)?</label>
                <input id="well_context_direction" type="checkbox" ${this.parent_gravity_well.forceDirection === 1 ? '' : 'checked'}/>
            </div>
            <button id="well_context_delete">Delete</button>
        `;
    }

    createCreateContextNode () {
        this.node = createElement('div', 'well_context menu', {
            addTo: document.body,
            html: this.nodeTemplate()
        });
    }

    positionMenu (mouse) {
        const canvas_height = this.parent_gravity_well.layer.canvas.height;
        if (mouse.y > (canvas_height / 2)) {
            this.node.style.top = 'auto';
            this.node.style.bottom = canvas_height - mouse.y - 5 + 'px';
        } else {
            this.node.style.bottom = 'auto';
            this.node.style.top = mouse.y - 5 + 'px';
        }
        this.node.style.left = mouse.x - 5 + 'px';
    }

    setEvents () {
        this.node.addEventListener('mousehover', (e) => {
            this.mouse_over = true;
        });
        this.node.addEventListener('mouseleave', (e) => {
            this.mouse_over = false;
        });

        this.el_well_context_radius_input.addEventListener('change', (e) => {
            const val = parseInt(e.currentTarget.value, 10);
            this.el_well_context_radius_value.innerHTML = val;
            this.parent_gravity_well.radius = val;
            this.parent_gravity_well.layer.update = true;
        });

        this.el_well_context_force_input.addEventListener('change', (e) => {
            const val = parseInt(e.currentTarget.value, 10);
            this.el_well_context_force_value.innerHTML = val;
            this.parent_gravity_well.force = val;
        });

        this.el_well_context_delete.addEventListener('click', (e) => {
            this.parent_gravity_well.layer.update = true;
            this.parent_gravity_well.shutdown();
            this.node.remove();
        });

        this.el_well_context_direction.addEventListener('click', (e) => {
            if (e.currentTarget.checked) {
                this.parent_gravity_well.forceDirection = -1;
            } else {
                this.parent_gravity_well.forceDirection = 1;
            }
        });
    }

    remove () {
        this.node.remove();
    }
}

module.exports = WellContextMenu;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(4);

const Menu = __webpack_require__(7);
const WellContextMenu = __webpack_require__(5);

const GI = __webpack_require__(8);
const CONFIG = __webpack_require__(2);

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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const CONFIG = __webpack_require__(2);

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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(4);
const CONFIG = __webpack_require__(2);

const Projectile = __webpack_require__(9);
const GravityWell = __webpack_require__(10);
const Planet = __webpack_require__(11);

const { getRandomInt } = __webpack_require__(1);

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(3);
const CONFIG = __webpack_require__(2);

const { getDistance, getRandomInt, rgba, sqr } = __webpack_require__(1);

class Projectile extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = "projectile";

		this.z = 1000000;

		this.__props.velX = (opts.velX !== null) ? opts.velX : (-1 + (Math.random() * 2));
		this.__props.velY = (opts.velY !== null) ? opts.velY : (-1 + (Math.random() * 2));

		this.width = 2;
		this.height = 2;

		return this;
	}

	get velX () {
		return this.__props.velX;
	}

	set velX (new_velX) {
		this.__props.velX = new_velX;
	}

	get velY () {
		return this.__props.velY;
	}

	set velY (new_velY) {
		this.__props.velY = new_velY;
	}

	checkBounds () {
		const x_bound = this.layer.canvas.width;
		const y_bound = this.layer.canvas.height;

		if (CONFIG.confine_projectiles) {
			if (this.x < 0 || this.x > x_bound) {
				this.velX *= -1;
			}
			if (this.y < 0 || this.y > y_bound) {
				this.velY *= -1;
			}
		} else {
			if (this.x > x_bound || this.x < 0 || this.y > y_bound || this.y < 0) {
				this.shutdown();
			}
		}
	}

	checkCollisions () {
		GOM.onCollidables('checkCollision', {
			caller: this
		});
	}

	update () {
		this.x += this.velX;
		this.y += this.velY;
		// if (this.)
		this.checkBounds();
		if (this.remove) return;
		this.checkCollisions();
	}

	draw () {
		this.context.save();
			// this.context.shadowBlur = 10;
			// this.context.shadowColor = '#FFFFFF';

			this.context.beginPath();
			this.context.rect(this.x - 1, this.y - 1, 2, 2);
			this.context.fillStyle = '#FFFFFF';
			this.context.fill();

			// Draw the tail on the asteroid
			this.context.save();
				this.context.globalAlpha = 0.3;
				this.context.beginPath();
				this.context.lineWidth = 2;
				this.context.moveTo(this.x -1, this.y -1);
				this.context.lineTo(
					(this.x -1) + (-1 * this.velX * 5),
					(this.y -1) + (-1 * this.velY * 5)
				);

				this.context.strokeStyle = "#FFFFFF";
				this.context.stroke();
			this.context.restore();
		this.context.restore();
	}
}

module.exports = Projectile;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(3);
const CONFIG = __webpack_require__(2);

const WellContextMenu = __webpack_require__(5);

const { rgba, sqr, getDistance } = __webpack_require__(1);;

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


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(3);
const CONFIG = __webpack_require__(2);

const PlanetChunk = __webpack_require__(12);
const ImpactExplosion = __webpack_require__(13);

const { getDistance, getRandomInt, rgba, sqr } = __webpack_require__(1);

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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(3);
const CONFIG = __webpack_require__(2);

const { getRandomArbitrary, rgba } = __webpack_require__(1);

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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(3);
const CONFIG = __webpack_require__(2);

const { rgba } = __webpack_require__(1);

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


/***/ })
/******/ ]);